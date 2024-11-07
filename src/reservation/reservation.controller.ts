import { Controller, Post, Body, UseGuards, Put, Param, Delete } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { Reservation } from '../entities/reservation.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  @Post()
  async create(@Body() createReservationDto: CreateReservationDto): Promise<Reservation> {
    const { userId, courseId, date } = createReservationDto;
    return this.reservationService.createReservation(userId, courseId, date);
  }

  @Put(':id')
  async update(
    @Param('id') reservationId: number,
    @Body('date') newDate: Date,
  ): Promise<Reservation> {
    return this.reservationService.modifyReservation(reservationId, newDate);
  }

  @Delete(':id')
  async delete(@Param('id') reservationId: number): Promise<void> {
    return this.reservationService.cancelReservation(reservationId);
  }
}
