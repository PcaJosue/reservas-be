import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Course } from './entities/course.entity';
import { Reservation } from './entities/reservation.entity';
import { ReservationService } from './reservation/reservation.service';
import { ReservationController } from './reservation/reservation.controller';
import * as fs from 'fs';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: +configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Course, Reservation],
        synchronize: true,
        ssl: {
          ca: fs.readFileSync(configService.get<string>('DB_CA_LINK')).toString(),
        },
      }),
    }),
    TypeOrmModule.forFeature([User, Course, Reservation]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class AppModule {}
