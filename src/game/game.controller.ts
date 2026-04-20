import { Controller, Get, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}
  @Get(':id')
  async getGame(@Param('id') id: number) {
    return await this.gameService.getGameByID(id);
  }
  @Get(':id/homeId')
  async getHomeTeam(@Param('id') id: number) {
    return await this.gameService.getHomeTeam(id);
  }
  @Get(':id/homeScore')
  async getHomeTeamScore(@Param('id') id: number) {
    return await this.gameService.getHomeScore(id);
  }
  @Get(':id/visitorId')
  async getVisitorTeam(@Param('id') id: number) {
    return await this.gameService.getAwayTeam(id);
  }
  @Get(':id/visitorScore')
  async getVisitorTeamScore(@Param('id') id: number) {
    return await this.gameService.getAwayScore(id);
  }
}
