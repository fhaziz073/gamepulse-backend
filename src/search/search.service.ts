import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/database/database.module';

@Injectable()
export class SearchService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}
  async searchGame(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Game Table"
      WHERE LOWER("Game Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async searchTeams(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Team Table"
      WHERE LOWER("Team Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await this.pool.query(query, values);
    return result.rows;
  }

  async searchPlayer(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Player Table"
      WHERE LOWER("Player Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await this.pool.query(query, values);
    return result.rows;
  }
}
