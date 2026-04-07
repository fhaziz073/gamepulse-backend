import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { gpdb } from './gamepulse_database';


@Injectable()
export class TeamService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });

  async getTeamFromDB(teamId: number) {
    const result = await gpdb.query(
      `SELECT * FROM "Team Table" WHERE id = $1`,
      [teamId]
    );
    return result.rows[0];
  }

  async upsertGame(team: any) {
    const query = `
      INSERT INTO "Team Table"
      (id integer, name text, full_name text, abbreviation text, city text, conference text,division text, hex_code text)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
      `;

    const values = [
      team.id,
      team.name,
      team.full_name,
      team.abbreviation,
      team.city,
      team.conference,
      team.division,
      team.hex_code
    ];

    await gpdb.query(query, values);
  }

  async getTeamById(teamId: number) {
        const existing = await this.getTeamFromDB(teamId);
    if (existing) {
      return existing;
    } 
    const response = await this.api.nba.getTeam({ id: teamId });
    const game = response.data[0];

    if (!game) {
      return null;
    }

    await this.upsertGame(game);

    return await this.getTeamFromDB(teamId);
  }

  async getPlayers(id: number) {
    const players = await  fetch ("https://api.balldontlie.io/v1/players?team_ids[]=$1", id);
    return players;
  }

}
