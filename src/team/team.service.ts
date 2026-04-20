import { Inject, Injectable } from '@nestjs/common';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { PG_CONNECTION } from 'src/database/database.module';
import { Pool } from 'pg';
export type Team = {
  hex_code: string;
  id: number;
  conference: 'East' | 'West';
  division:
    | 'Atlantic'
    | 'Central'
    | 'Southeast'
    | 'Northwest'
    | 'Pacific'
    | 'Southwest';
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
};
@Injectable()
export class TeamService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });

  async getTeamFromDB(teamId: number) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "Team Table" WHERE id = $1`,
        [teamId],
      );
      return result.rows[0] as Team;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async upsertTeam(team: Team) {
    const query = `
      INSERT INTO "Team Table"
      (id, name, full_name, abbreviation, city, conference, division, hex_code)
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
      team.hex_code,
    ];

    await this.pool.query(query, values);
  }
  //Need to manually add hex code to data
  async getTeamById(teamId: number) {
    const existing = await this.getTeamFromDB(teamId);
    if (existing) {
      return existing;
    }
    const response = await this.api.nba.getTeam(teamId);
    const team = response.data;

    if (!team) {
      return null;
    }
    await this.upsertTeam({ ...team, hex_code: '' });

    return await this.getTeamFromDB(teamId);
  }

  async getPlayers(team_ids: number[]) {
    const players = await this.api.nba.getPlayers({ team_ids });
    return players;
  }
}
