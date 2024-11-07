import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from '../entities/reservation.entity';
import { User } from '../entities/user.entity';
import { Course } from '../entities/course.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,
    
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    
    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,
  ) {}

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

    return this.reservationRepository.save(reservation);
  }
}
