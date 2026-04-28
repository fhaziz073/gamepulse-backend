import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CalendarModule } from 'src/calendar/calendar.module';
import { User } from 'src/entity/user.entity';
import { TasksService } from './tasks.service';
import { Preference } from 'src/entity/preference.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Preference]), CalendarModule],
  providers: [TasksService],
})
export class TasksModule {}
