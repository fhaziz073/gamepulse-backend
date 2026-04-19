import { Body, Controller, Get, Param } from '@nestjs/common';
import { TeamService } from './team.service';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}
  @Get(':id')
  async getTeam(@Param('id') id: number) {
    return await this.teamService.getTeamById(id);
  }
  @Get()
  async getAllPlayers(
    @Body()
    body: {
      ids: number[];
    },
  ) {
    return await this.teamService.getPlayers(body.ids);
  }
}
