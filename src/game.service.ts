import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { Team } from './team.service';

export interface Game {
  id: string,
  startTime: Date,
  homeTeam: Team,
  awayTeam: Team,
  homeScore: number,
  awayScore: number,
  status: string
}

@Injectable()
export class GameService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  private games: Game[] = [];

  async getGameById(gameId: string): Promise<string> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getStartTime(gameId: string): Promise<Date> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getHomeTeam(gameId: string): Promise<string> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getAwayTeam(gameId: string): Promise<Date> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getHomeScore(gameId: string): Promise<string> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getAwayScore(gameId: string): Promise<Date> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }

  async getStatus(gameId: string): Promise<Date> {
    const game = await this.api.nba.getGames({ id: gameId });
    return game;
  }


}
