import { Body, Controller, Get, Param } from '@nestjs/common';
import { PlayerService } from './player.service';

@Controller('players')
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}
  @Get(':id')
  async getPlayerById(@Param('id') id: number) {
    return await this.playerService.getPlayerById(id);
  }
  @Get()
  async getPlayerByName(@Body() body: { name: string }) {
    return await this.playerService.getPlayerByName(body.name);
  }
  @Get(':id/stats')
  async getPlayerStats(@Param('id') id: number) {
    return await this.playerService.getSeason(id);
  }
}
