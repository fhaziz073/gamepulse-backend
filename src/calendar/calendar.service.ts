import { Injectable } from '@nestjs/common';
import { BalldontlieAPI } from '@balldontlie/sdk';
import 'dotenv/config';
type Event = {
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

  async findAll(): Event[] {
    const games = await this.api.nba.getGames({
      team_ids: [1],
      start_date: '2026-02-01',
    });
    const gamesData = games.data
    for(game of gamesData)
    {
        
    }
    return this.events;
  }
}
