import { Injectable } from '@nestjs/common';
import { BalldontlieAPI, NBAGame } from '@balldontlie/sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Repository } from 'typeorm';
import { Betting } from 'src/entity/betting.entity';
@Injectable()
export class GameService {
  constructor(
    @InjectRepository(Game) private gamesRepository: Repository<Game>,
    @InjectRepository(Betting)
    private bettingOddsRepository: Repository<Betting>,
  ) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });
  async getGameFromDB(gameId: number) {
    try {
      const result = await this.gamesRepository.findOneBy({ id: gameId });
      return result;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async createGame(game: Partial<Game>) {
    await this.gamesRepository.save(game);
  }
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
    const bettingOdds: Betting[] = [];
    const gameInfo = {
      home_team_id: game.home_team.id,
      visitor_team_id: game.visitor_team.id,
      ...game,
      bettingOdds,
    };
    await this.createGame(gameInfo);
    const bettingOddsData = (
      await this.api.nba.getOdds({
        date: game.date,
        game_id: gameId,
      })
    ).data;
    for (const odd of bettingOddsData) {
      bettingOdds.push(
        await this.bettingOddsRepository.save({ ...odd, game_id: gameId }),
      );
    }
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
