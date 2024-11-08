import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    private readonly emailService: EmailService
  ) {}

  async getReservationsByUserId(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({
      where: { user: { id: userId } },
      relations: ['course'],
    });
  }

  async createReservation(userId: number, courseId: number, date: Date): Promise<Reservation> {
    const course = await this.courseRepository.findOne({ where: { id: courseId } });
    const user = await this.userRepository.findOne({ where: { id: userId } });


    if (!course) {
      throw new BadRequestException('Course not found');
    }

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const reservationsOnDate = await this.reservationRepository.count({
      where: { course: course, date },
    });

    if (reservationsOnDate >= course.capacity) {
      throw new BadRequestException('This course is fully booked for the selected date.');
    }

    const reservation = new Reservation();
    reservation.user = user;
    reservation.course = course;
    reservation.date = date;
    reservation.status = 'confirmed';

    const savedReservation = await this.reservationRepository.save(reservation);

    await this.sendReservationConfirmation(user, course, date, 'created');

    return savedReservation;
  }

  async modifyReservation(reservationId: number, newDate: Date): Promise<Reservation> {
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId }, relations: ['user', 'course'] });

    if (!reservation) throw new BadRequestException('Reservation not found');

    reservation.date = newDate;
    const updatedReservation = await this.reservationRepository.save(reservation);

    await this.sendReservationConfirmation(reservation.user, reservation.course, newDate, 'modified');

    return updatedReservation;
  }

  async cancelReservation(reservationId: number): Promise<void> {
    const reservation = await this.reservationRepository.findOne({ where: { id: reservationId }, relations: ['user', 'course'] });

    if (!reservation) throw new BadRequestException('Reservation not found');

    await this.reservationRepository.remove(reservation);

    await this.sendReservationConfirmation(reservation.user, reservation.course, reservation.date, 'canceled');
  }
  

  private async sendReservationConfirmation(user: User, course: Course, date: Date, action: string) {
    const reservationDate = typeof date === 'string' ? new Date(date) : date;

    const subject = `Your reservation has been ${action}`;
    const text = `Your reservation for ${course.name} on ${reservationDate} has been ${action}.`;
    const html = `<p>Your reservation for <strong>${course.name}</strong> on <strong>${reservationDate}</strong> has been ${action}.</p>`;

    await this.emailService.sendReservationEmail(user.email, subject, text, html);
  }
}
