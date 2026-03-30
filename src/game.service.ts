import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { gpdb } from './gamepulse_database';


@Injectable()
export class GameService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  
  async getGameFromDB(gameId: number) {
    const result = await gpdb.query(
      `SELECT * FROM "Game Table" WHERE id = $1`,
      [gameId]
    );
    return result.rows[0];
  }

  async upsertGame(game: any) {
    const query = `
      INSERT INTO "Game Table"
      (id, date, status, home_team_id, visitor_team_id, season, home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, visitor_q1, visitor_q2, visitor_q3, visitor_q4, visitor_ot1, visitor_ot2, visitor_ot3, home_team_score,visitor_team_score, postseason, postponed)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22, $23)
      ON CONFLICT (id) DO UPDATE SET
        status = EXCLUDED.status,
        home_team_id = EXCLUDED.home_team_id,
        visitor_team_id = EXCLUDED.visitor_team_id,
        home_team_score = EXCLUDED.home_team_score,
        visitor_team_score = EXCLUDED.visitor_team_score
    `;

    const values = [
      game.id,
      game.date,
      game.status,
      game.home_team_id,
      game.visitor_team_id,
      game.season, 
      game.home_q1, 
      game.home_q2, 
      game.home_q3, 
      game.home_q4, 
      game.home_ot1, 
      game.home_ot2, 
      game.home_ot3, 
      game.visitor_q1, 
      game.visitor_q2, 
      game.visitor_q3, 
      game.visitor_q4, 
      game.visitor_ot1, 
      game.visitor_ot2, 
      game.visitor_ot3, 
      game.home_team_score,
      game.visitor_team_score, 
      game.postseason, 
      game.postponed
    ];

    await gpdb.query(query, values);
  }

  async getGameByID(gameId: number) {
    const existing = await this.getGameFromDB(gameId);
    if (existing) {
      return existing;
    } 
    const response = await this.api.nba.getGame({ id: gameId });
    const game = response.data[0];

    if (!game) {
      return null;
    }

    await this.upsertGame(game);

    return await this.getGameFromDB(gameId);
  }


  async getHomeTeam(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.home_team_id;
  }

  async getAwayTeam(gameId: number){
    const game = await this.getGameByID(gameId);
    return game?.visitor_team_id;
  }

  async getHomeScore(gameId: number){
    const game = await this.getGameByID(gameId);
    return game?.home_team_score;
  }

  async getAwayScore(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.visitor_team_id;
  }

  async getStatus(gameId: number){
    const game = await this.getGameByID(gameId);
    return game?.status;
  }
}



