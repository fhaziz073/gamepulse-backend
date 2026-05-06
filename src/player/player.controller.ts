import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { PlayerService } from './player.service';
import * as express from 'express';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @Get('image')
  async getPlayerHeadshot(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
    @Res() res: express.Response,
  ) {
    const imageBuffer = await this.playerService.getHeadshot(
      firstName,
      lastName,
    );
    res.set('Content-Type', 'image/png');
    res.set('Cache-Control', 'public, max-age=86400'); // cache for 1 day
    res.send(imageBuffer);
  }
  @Get(':id')
  async getPlayerById(@Param('id') id: number) {
    return await this.playerService.getPlayerById(id);
  }
  @Get()
  async getPlayerByName(
    @Query('firstName') firstName: string,
    @Query('lastName') lastName: string,
  ) {
    return await this.playerService.getPlayerByName(firstName, lastName);
  }
  @Get(':id/advancedStats')
  async getPlayerAdvancedStats(@Param('id') id: number) {
    return await this.playerService.getAdvanced2026Stats(id);
  }
  @Get(':id/seasonalStatAvgs')
  async getPlayerSeasonalStatAvgs(@Param('id') id: number) {
    return await this.playerService.get2026StatAvgs(id);
  }
  @Get(':id/stats')
  async getPlayerStats(@Param('id') id: number) {
    return await this.playerService.get2026Stats(id);
  }
  @Get(':id/injury')
  async getPlayerInjury(@Param('id') id: number) {
    return await this.playerService.getInjuryStatus(id);
  }
  @Get(':id/stats/:gameId')
  async getGameStats(@Param('id') id: number, @Param('gameId') gameId: number) {
    return await this.playerService.getGameStats(id, gameId);
  }
}
