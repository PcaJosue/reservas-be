import { IsNotEmpty, IsDateString, IsNumber } from 'class-validator';

export class CreateReservationDto {

  @IsNumber()
  @IsNotEmpty()
  courseId: number;

  @IsDateString()
  @IsNotEmpty()
  date: Date;
}
