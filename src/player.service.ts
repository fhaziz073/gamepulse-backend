import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { Game } from './game.service';
import { PlayerLog } from './playerlog.service';

export interface Player {
  id: string;
  name: string,
  season: Game[],
  height: number,
  age: number,
  weight: number,
  status: string,
  playerLog: PlayerLog
}

@Injectable()
export class PlayerService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  private players: Player[] = [];

  async getPlayerByName(playerName: string): Promise<string> {
    const player = await this.api.nba.getPlayers({ players: playerName });
    return player;
  }

  async getPlayerById(playerId: string): Promise<string> {
    const player = await this.api.nba.getPlayers({ id: playerId });
    return player;
  }

  async getSeason(playerId: string): Promise<string> {
    const player = await this.api.nba.getPlayers({ id: playerId });
    return player;
  }

  async getHeight(playerId: string): Promise<string> {
    const player = await this.api.nba.getPlayers({ id: playerId });
    return player;
  }

  async getWeight(playerId: string): Promise<string> {
    const player = await this.api.nba.getPlayers({ id: playerId });
    return player;
  }


}
