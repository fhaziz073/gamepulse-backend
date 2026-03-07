import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { LoginController } from './login/login.controller';

@Module({
  imports: [],
  controllers: [AppController, CalendarController, LoginController],
  providers: [AppService, CalendarService],
})
export class AppModule {}
