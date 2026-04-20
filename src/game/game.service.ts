import { Inject, Injectable } from '@nestjs/common';
import { BalldontlieAPI, NBAGame } from '@balldontlie/sdk';
import { Pool } from 'pg';
import { PG_CONNECTION } from 'src/database/database.module';
export type Game = {
  id: number;
  home_team_id: number;
  visitor_team_id: number;
  season: number;
  home_q1: number;
  home_q2: number;
  home_q3: number;
  home_q4: number;
  home_ot1: number;
  home_ot2: number;
  home_ot3: number;
  visitor_q1: number;
  visitor_q2: number;
  visitor_q3: number;
  visitor_q4: number;
  visitor_ot1: number;
  visitor_ot2: number;
  visitor_ot3: number;
  home_team_score: number;
  visitor_team_score: number;
  postseason: boolean;
  postponed: boolean;
  date: Date;
};
@Injectable()
export class GameService {
  constructor(@Inject(PG_CONNECTION) private pool: Pool) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  async getGameFromDB(gameId: number) {
    try {
      const result = await this.pool.query(
        `SELECT * FROM "Game Table" WHERE id = $1`,
        [gameId],
      );
      return result.rows[0] as Game;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async upsertGame(game: Game) {
    const query = `
      INSERT INTO "Game Table"
      (id, date, home_team_id, visitor_team_id, season, home_q1, home_q2, home_q3, home_q4, home_ot1, home_ot2, home_ot3, visitor_q1, visitor_q2, visitor_q3, visitor_q4, visitor_ot1, visitor_ot2, visitor_ot3, home_team_score,visitor_team_score, postseason, postponed)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22, $23)
      ON CONFLICT (id) DO UPDATE SET
        home_team_id = EXCLUDED.home_team_id,
        visitor_team_id = EXCLUDED.visitor_team_id,
        home_team_score = EXCLUDED.home_team_score,
        visitor_team_score = EXCLUDED.visitor_team_score
    `;

    const values = [
      game.id,
      game.date,
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
      game.postponed,
    ];

    await this.pool.query(query, values);
  }
  //Only get data for inidividual quarters for games past 2023
  async getGameByID(gameId: number) {
    const existing = await this.getGameFromDB(gameId);
    if (existing) {
      return existing;
    }
    const response = await this.api.nba.getGame(gameId);
    const game = response.data;

    if (!game) {
      return null;
    }
    const gameInfo = {
      home_team_id: game.home_team.id,
      visitor_team_id: game.visitor_team.id,
      date: new Date(game.date),
      id: game.id,
      season: game.season,
      postseason: game.postseason,
      postponed: false,
      home_q1: 0,
      home_q2: 0,
      home_q3: 0,
      home_q4: 0,
      home_ot1: 0,
      home_ot2: 0,
      home_ot3: 0,
      visitor_q1: 0,
      visitor_q2: 0,
      visitor_q3: 0,
      visitor_q4: 0,
      visitor_ot1: 0,
      visitor_ot2: 0,
      visitor_ot3: 0,
      home_team_score: game.home_team_score,
      visitor_team_score: game.visitor_team_score,
    } as Game;
    await this.upsertGame(gameInfo);

    return await this.getGameFromDB(gameId);
  }

  async getHomeTeam(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.home_team_id;
  }

  async getAwayTeam(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.visitor_team_id;
  }

  async getHomeScore(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.home_team_score;
  }

  async getAwayScore(gameId: number) {
    const game = await this.getGameByID(gameId);
    return game?.visitor_team_score;
  }

  async getStatus(gameId: number) {
    const response = await this.api.nba.getGame(gameId);
    return (response.data[0] as NBAGame)?.status;
  }
}
