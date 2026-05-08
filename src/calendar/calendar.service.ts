import { Injectable } from '@nestjs/common';
import { BalldontlieAPI, NBAGame } from '@balldontlie/sdk';
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

  async findAll(team_ids: number[]): Promise<Event[]> {
    const events: Event[] = [];
    let date1 = new Date();
    const offset = date1.getTimezoneOffset();
    date1 = new Date(date1.getTime() - offset * 60 * 1000);
    let date2 = new Date();
    date2.setMonth(date2.getMonth() + 1);
    const offset2 = date2.getTimezoneOffset();
    date2 = new Date(date2.getTime() - offset2 * 60 * 1000);
    const games = await this.api.nba.getGames({
      team_ids: team_ids,
      start_date: date1.toISOString().split('T')[0],
      end_date: date2.toISOString().split('T')[0],
    });
    const gamesData = games.data;
    for (const game of gamesData) {
      const gameLengthInMs = 2.5 * 60 * 60 * 1000;
      const gameStart = new Date(game.status);
      const gameEnd = new Date(gameStart.getTime() + gameLengthInMs);
      const formatDateTime = (d: Date) => {
        const date =
          `${d.getUTCFullYear()}-` +
          `${(d.getUTCMonth() + 1).toString().padStart(2, '0')}-` +
          `${d.getUTCDate().toString().padStart(2, '0')}`;
        const time =
          `${d.getUTCHours().toString().padStart(2, '0')}:` +
          `${d.getUTCMinutes().toString().padStart(2, '0')}:` +
          `${d.getUTCSeconds().toString().padStart(2, '0')}`;
        return `${date} ${time}`;
      };

      events.push({
        start: formatDateTime(gameStart),
        end: formatDateTime(gameEnd),
        title: `${game.visitor_team.name} at ${game.home_team.name}`,
      });
    }
    return events;
  }
  async getNextGame(team_ids: number[]): Promise<NBAGame> {
    const today = new Date().toLocaleDateString('en-CA');
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const future = nextMonth.toLocaleDateString('en-CA');

    const games = await this.api.nba.getGames({
      team_ids,
      start_date: today,
      end_date: future,
    });
    return games.data[0];
  }
  async getTodaysGames(): Promise<NBAGame[]> {
    const today = new Date().toLocaleDateString('en-CA');
    return (
      await this.api.nba.getGames({
        dates: [today],
      })
    ).data;
  }
}
