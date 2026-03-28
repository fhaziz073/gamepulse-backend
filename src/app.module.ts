import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CalendarController } from './calendar/calendar.controller';
import { CalendarService } from './calendar/calendar.service';
import { LoginController } from './login/login.controller';
import { UserService } from './user/user.service';
import { UserController } from './user/user.controller';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [
    AppController,
    CalendarController,
    LoginController,
    UserController,
  ],
  providers: [AppService, CalendarService, UserService],
})
export class AppModule {}
