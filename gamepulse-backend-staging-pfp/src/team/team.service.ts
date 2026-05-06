import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BalldontlieAPI } from '@balldontlie/sdk';
import { InjectRepository } from '@nestjs/typeorm';
import { Team } from 'src/entity/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private teamsRepository: Repository<Team>,
  ) {}
  private apiKey = process.env.SPORTS_API_KEY as string;
  private api = new BalldontlieAPI({ apiKey: this.apiKey });

  async getTeamFromDB(teamId: number) {
    try {
      const result = await this.teamsRepository.findOneBy({ id: teamId });
      return result;
    } catch {
      console.log("Can't connect to database");
    }
    return null;
  }

  async createTeam(team: Team) {
    await this.teamsRepository.save(team);
  }
  //Need to manually add hex code to data
  async getTeamById(teamId: number) {
    const existing = await this.getTeamFromDB(teamId);
    if (existing) {
      return existing;
    }
    const response = await this.api.nba.getTeam(teamId);
    const team = response.data;

    if (!team) {
      return null;
    }
    await this.createTeam({ ...team, hex_code: '' });

    return await this.getTeamFromDB(teamId);
  }

  async getPlayers(team_ids: number[]) {
    if (!(Array.isArray(team_ids) && team_ids.length > 0)) {
      throw new BadRequestException('Array is malformed');
    }
    const players = await this.api.nba.getActivePlayers({ team_ids });
    if (players.data.length === 0) {
      throw new NotFoundException('Team id array contains no valid id');
    }
    return players.data;
  }
}
