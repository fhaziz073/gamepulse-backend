import { Injectable } from '@nestjs/common';
import { BalldontlieAPI, NBAPlayer } from '@balldontlie/sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Player } from 'src/entity/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player) private playersRepository: Repository<Player>,
  ) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });

  async getPlayerFromDB(playerId: number) {
    try {
      const result = await this.playersRepository.findOneBy({ id: playerId });
      return result;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async createPlayer(player: Player) {
    await this.playersRepository.save(player);
  }
  async getPlayerById(playerId: number) {
    const existing = await this.getPlayerFromDB(playerId);
    if (existing) {
      return existing;
    }
    const response = await this.api.nba.getPlayer(playerId);
    const player = response.data;

    if (!player) {
      return null;
    }

    await this.createPlayer(player);

    return await this.getPlayerFromDB(playerId);
  }

  async getPlayerByName(
    first_name: string,
    last_name: string,
  ): Promise<NBAPlayer[]> {
    const response = await this.api.nba.getActivePlayers({
      first_name,
      last_name,
    });

    const players = response.data;

    await Promise.all(players.map((p) => this.createPlayer(p)));

    return players;
  }

  async getAdvanced2026Stats(playerId: number) {
    const player = await this.api.nba.getAdvancedStats({
      seasons: [new Date().getFullYear() - 1],
      player_ids: [playerId],
    });
    return player.data;
  }
  async get2026StatAvgs(playerId: number) {
    const player = await this.api.nba.getSeasonAverages({
      season: new Date().getFullYear() - 1,
      player_id: playerId,
    });
    return player.data;
  }
  async get2026Stats(playerId: number) {
    const playerStats = await this.api.nba.getStats({
      seasons: [new Date().getFullYear() - 1],
      player_ids: [playerId],
      start_date: '2026-04-01',
    });
    return playerStats.data.reverse();
  }
  async getInjuryStatus(playerId: number) {
    const player = await this.api.nba.getPlayerInjuries({
      player_ids: [playerId],
    });
    return player.data;
  }
}
