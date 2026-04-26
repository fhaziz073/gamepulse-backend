import { Body, Controller, Get, Param, Query } from '@nestjs/common';
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
  @Get(':id/stats')
  async getPlayerStats(@Param('id') id: number) {
    return await this.playerService.getSeason(id);
  }
}
