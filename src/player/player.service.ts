import { Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BalldontlieAPI, NBAPlayer } from '@balldontlie/sdk';
import { PG_CONNECTION } from 'src/database/database.module';
import { Pool } from 'pg';

@Injectable()
export class PlayerService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });

  async getPlayerFromDB(playerId: number) {
    const result = await this.pool.query(
      `SELECT * FROM "Player Table" WHERE id = $1`,
      [playerId],
    );
    return result.rows[0];
  }

  async upsertPlayer(player: any) {
    const query = `
      INSERT INTO "Player Table"
      (id, first_name, last_name, position, height, weight, jersey_number, college, country, draft_year, draft_round, draft_number)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (id) DO UPDATE SET
        first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        position = EXCLUDED.position,
        height = EXCLUDED.height,
        weight = EXCLUDED.weight
    `;

    const values = [
      player.id,
      player.first_name,
      player.last_name,
      player.position,
      player.height,
      player.weight,
      player.jersey_number,
      player.college,
      player.country,
      player.draft_year,
      player.draft_round,
      player.draft_number,
    ];

    await this.pool.query(query, values);
  }

  async getPlayerById(playerId: number) {
    const existing = await this.getPlayerFromDB(playerId);
    if (existing) {
      return existing;
    }
    const response = await this.api.nba.getPlayer(playerId);
    const player = response.data[0];

    if (!player) {
      return null;
    }

    await this.upsertPlayer(player);

    return await this.getPlayerFromDB(playerId);
  }

  async getPlayerByName(playerName: string): Promise<NBAPlayer[]> {
    const response = await this.api.nba.getPlayers({ first_name: playerName });

    const players = response.data;

    await Promise.all(players.map((p) => this.upsertPlayer(p)));

    return players;
  }

  async getSeason(playerId: number) {
    // const player = await BalldontlieAPI.nba.getAdvancedStats({
    //   seasons: `${new Date().getFullYear()}`,
    // });
    const player = await this.api.nba.getAdvancedStats({
      seasons: [new Date().getFullYear()],
    });
    return player.data;
  }

  async getHeight(playerId: number) {
    const player = await this.getPlayerById(playerId);
    return player?.height;
  }

  async getWeight(playerId: number) {
    const player = await this.getPlayerById(playerId);
    return player?.weight;
  }
}
