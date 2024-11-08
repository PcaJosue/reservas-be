import { Controller, Get, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { CourseService } from './course.service';
import { Course } from '../entities/course.entity';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('courses')
@UseGuards(JwtAuthGuard)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Get()
  async getAllCourses(): Promise<Course[]> {
    return this.courseService.getAllCourses();
  }

  @Get(':id')
  async getCourseById(@Param('id', ParseIntPipe) id: number): Promise<Course> {
    return this.courseService.getCourseById(id);
  }
}
