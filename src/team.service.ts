import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Game } from './game.service';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { Player } from './player.service';

export interface Team {
  id: string;
  teamName: string;
  colorHex: string;
  season: Game[];
  players: Player[];
}

@Injectable()
export class TeamService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  private teams: Team[] = [];

  async getTeamByName(teamName: string): Promise<string> {
    const team = await this.api.nba.getTeams({ teams: teamName });
    return team;
  }

  async getTeamById(teamId: string): Promise<string> {
    const team = await this.api.nba.getTeams({ id: teamId });
    return team;
  }

  async getSeasons(id: string): Promise<Game[]> {
    const games = await this.api.nba.getGames({ teamId: id });
    return games;
  }

  async getPlayers(id: string): Promise<Player[]> {
    const players = await this.api.nba.getPlayers({ teamId: id });
    return players;
  }

}
