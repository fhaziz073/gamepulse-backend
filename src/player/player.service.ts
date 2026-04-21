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

  async getPlayerByName(playerName: string): Promise<NBAPlayer[]> {
    const response = await this.api.nba.getPlayers({ first_name: playerName });

    const players = response.data;

    await Promise.all(players.map((p) => this.createPlayer(p)));

    return players;
  }

  async getSeason(playerId: number) {
    const player = await this.api.nba.getAdvancedStats({
      seasons: [new Date().getFullYear() - 1],
      player_ids: [playerId],
    });
    return player.data;
  }
}
