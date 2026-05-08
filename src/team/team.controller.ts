import { Body, Controller, Get, Param, Query } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Get(':id')
  async getTeam(@Param('id') id: number) {
    return await this.teamService.getTeamById(id);
  }
  @Get()
  async getAllPlayers(@Query('ids') ids: number | number[]) {
    const idsArray = Array.isArray(ids) ? ids : [ids];
    return await this.teamService.getPlayers(idsArray);
  }
}
