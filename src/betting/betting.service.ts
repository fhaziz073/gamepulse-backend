import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { gpdb } from './gamepulse_database';
import { BalldontlieAPI } from '@balldontlie/sdk';

@Injectable()
export class BettingService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  
  async getBettingTableFromDB(betId: number) {
    const result = await gpdb.query(
      `SELECT * FROM "Betting Table" WHERE id = $1`,
      [betId]
    );
    return result.rows[0];
  }

  async upsertBetting(betting: any) {
    const query = `
      INSERT INTO "Betting Table"
      (id, game_id, vendor, spread_home_value, spread_home_odds, spread_away_value, spread_away_odds, moneyline_home_odds, moneyline_away_odds, total_value, total_over_odds, total_under_odds)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
      ON CONFLICT (id) DO UPDATE SET
        game_id = EXCLUDED.game_id,
        vendor = EXCLUDED.vendor,
        spread_home_value = EXCLUDED.spread_home_value,
        spread_home_odds = EXCLUDED.spread_home_odds,
        spread_away_value = EXCLUDED.spread_away_value,
        spread_away_odds = EXCLUDED.spread_away_odds,
        moneyline_home_odds = EXCLUDED.moneyline_home_odds,
        moneyline_away_odds = EXCLUDED.moneyline_away_odds,
        total_value = EXCLUDED.total_value,
        total_over_odds = EXCLUDED.total_over_odds,
      total_under_odds = EXCLUDED.total_under_odds
    `;

    const values = [
      betting.id,
      betting.game_id,
      betting.vendor,
      betting.spread_home_value, 
      betting.spread_home_odds, 
      betting.spread_away_value, 
      betting.spread_away_odds, 
      betting.moneyline_home_odds, 
      betting.moneyline_away_odds, 
      betting.total_value, 
      betting.total_over_odds, 
      betting.total_under_odds
    ];

    await gpdb.query(query, values);
  }

  async getBettingByID(bettingId: number) {
    const existing = await this.getBettingByID(bettingId);
    if (existing) {
      return existing;
    } 
    const response = await this.api.nba.getBettingOdds(bettingId);
    const betting = response.data[0];

    if (!betting) {
      return null;
    }

    await this.upsertBetting(betting);

    return await this.getBettingByID(bettingId);
  }

  
  
}
 


