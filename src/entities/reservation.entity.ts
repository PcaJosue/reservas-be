import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('reservation')
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: Date;
}
