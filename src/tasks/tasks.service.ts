import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarService } from 'src/calendar/calendar.service';
import { User } from 'src/entity/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TasksService {
  constructor(
    private calendarService: CalendarService,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  @Cron('0 */15 * * * *')
  async sendNotification() {
    const games = await this.calendarService.findAll();
    console.log(games[0].title);
    console.log(games[0].start);
    const nextGameStart = new Date(games[0].start);
    const now = new Date();
    const diffInMs = nextGameStart.getTime() - now.getTime();
    const diffInHrs = diffInMs / (1000 * 60 * 60);
    console.log(diffInHrs);
    const result = await this.usersRepository
      .createQueryBuilder('user')
      .select(['user.notificationToken'])
      .getMany();
    console.log(result);
    if (diffInHrs < 1 && diffInHrs > 0) {
      const result = await this.usersRepository
        .createQueryBuilder('user')
        .select(['user.notificationToken'])
        .getMany();
      console.log(result);
      const diffInMins = Math.round(diffInMs / (1000 * 60));
      for (const row of result) {
        console.log(row.notificationToken);
        await this.sendPushNotification(
          row.notificationToken,
          diffInMins.toString(),
          games[0].title,
        );
      }
    }
  }
  async sendPushNotification(
    expoPushToken: string,
    timeRemaing: string,
    body: string,
  ) {
    const message = {
      to: expoPushToken,
      sound: 'default',
      title: `Game in ${timeRemaing}`,
      body: body,
      data: { someData: 'goes here' },
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  }
}
