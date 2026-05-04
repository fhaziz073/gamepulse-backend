import { Controller, Get, Param, Query } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
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
}
