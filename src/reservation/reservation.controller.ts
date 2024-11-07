import { Controller, Post, Body } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from '../dto/create-reservation.dto';
import { Reservation } from '../entities/reservation.entity';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { userId, courseId, date } = createReservationDto;
    return this.reservationService.createReservation(userId, courseId, date);
  }
}
