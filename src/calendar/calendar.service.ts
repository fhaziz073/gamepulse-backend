import { Injectable } from '@nestjs/common';
import { BalldontlieAPI } from '@balldontlie/sdk';
import 'dotenv/config';
export type Event = {
  start: string;
  end: string;
  title: string;
  summary?: string;
};

@Injectable()
export class CalendarService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  private readonly events: Event[] = [];

  async findAll(): Promise<Event[]> {
    let date1 = new Date();
    const offset = date1.getTimezoneOffset();
    date1 = new Date(date1.getTime() - offset * 60 * 1000);
    let date2 = new Date();
    date2.setMonth(date2.getMonth() + 1);
    const offset2 = date2.getTimezoneOffset();
    date2 = new Date(date2.getTime() - offset2 * 60 * 1000);
    const games = await this.api.nba.getGames({
      team_ids: [1],
      start_date: date1.toISOString().split('T')[0],
      end_date: date2.toISOString().split('T')[0],
    });
    const gamesData = games.data;
    for (const game of gamesData) {
      const gameLengthInMs = 2.5 * 60 * 60 * 1000;
      const gameStart = new Date(game.status);
      const gameEnd = new Date(gameStart.getTime() + gameLengthInMs);
      if (gameStart instanceof Date && !isNaN(gameStart.getTime())) {
        this.events.push({
          start:
            game.date +
            ' ' +
            gameStart.getHours().toString().padStart(2, '0') +
            ':' +
            gameStart.getMinutes().toString().padStart(2, '0') +
            ':' +
            gameStart.getSeconds().toString().padStart(2, '0'),
          end:
            game.date +
            ' ' +
            gameEnd.getHours().toString().padStart(2, '0') +
            ':' +
            gameEnd.getMinutes().toString().padStart(2, '0') +
            ':' +
            gameEnd.getSeconds().toString().padStart(2, '0'),
          title: `${game.visitor_team.name} at ${game.home_team.name}`,
        });
      } else {
        const currentTime = new Date();
        const currentTimeString =
          game.date +
          ' ' +
          currentTime.getHours().toString().padStart(2, '0') +
          ':' +
          currentTime.getMinutes().toString().padStart(2, '0') +
          ':' +
          currentTime.getSeconds().toString().padStart(2, '0');
        this.events.push({
          start: currentTimeString,
          end: currentTimeString,
          title: `${game.visitor_team.name} at ${game.home_team.name}`,
          summary: game.status,
        });
      }
    }
    return this.events;
  }
}
