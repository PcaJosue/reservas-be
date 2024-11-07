import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('course')
export class Course {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  schedule: string;

  @Column('int')
  capacity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  cost_per_session: number;

  @Column('text')
  details: string;
}
