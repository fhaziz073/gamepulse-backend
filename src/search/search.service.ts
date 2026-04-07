import { Injectable } from '@nestjs/common';
import { gpdb } from './gamepulse_database';

@Injectable()
export class SearchService {

  async searchGame(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Game Table"
      WHERE LOWER("Game Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await gpdb.query(query, values);
    return result.rows;
  }

  async searchTeams(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Team Table"
      WHERE LOWER("Team Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await gpdb.query(query, values);
    return result.rows;
  }

  async searchPlayer(searchTerm: string) {
    const query = `
      SELECT *
      FROM "Player Table"
      WHERE LOWER("Player Name") LIKE LOWER($1)
    `;
    const values = [`%${searchTerm}%`];
    const result = await gpdb.query(query, values);
    return result.rows;
  }
}