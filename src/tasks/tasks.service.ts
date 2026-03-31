import { Inject, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { Pool } from 'pg';
import { CalendarService } from 'src/calendar/calendar.service';
import { PG_CONNECTION } from 'src/database/database.module';

@Injectable()
export class TasksService {
  constructor(
    private calendarService: CalendarService,
    @Inject(PG_CONNECTION) private pool: Pool,
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
    const query = 'SELECT "Notification Token" FROM "User Table"';
    const result = await this.pool.query(query);
    console.log(result.rows);
    if (diffInHrs < 1 && diffInHrs > 0) {
      console.log('Sending Notification');
      const query = 'SELECT "Notification Token" FROM "User Table"';
      const result = await this.pool.query(query);
      console.log(result.rows);
      const diffInMins = Math.round(diffInMs / (1000 * 60));
      for (const row of result.rows) {
        console.log(row['Notification Token']);
        await this.sendPushNotification(
          row['Notification Token'],
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
