import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';

@Module({
  imports: [],
  controllers: [AppController, CalendarController, LoginController],
  providers: [AppService, CalendarService, LoginService],
})
export class AppModule {}
