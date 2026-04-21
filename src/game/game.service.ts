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

  async createGame(game: Game) {
    await this.gamesRepository.save(game);
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
    // const response2 = (
    //   await this.api.nba.getOdds({
    //     date: game.date,
    //     game_id: gameId,
    //   })
    // ).data[0];
    const bettingOdds = null;
    const gameInfo = {
      home_team_id: game.home_team.id,
      visitor_team_id: game.visitor_team.id,
      date: new Date(game.date),
      id: game.id,
      season: game.season,
      postseason: game.postseason,
      postponed: false,
      home_team_score: game.home_team_score,
      visitor_team_score: game.visitor_team_score,
      bettingOdds,
    };
    await this.createGame(gameInfo);

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
