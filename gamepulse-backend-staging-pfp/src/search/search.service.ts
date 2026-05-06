import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Player } from 'src/entity/player.entity';
import { Team } from 'src/entity/team.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(Team) private teamsRepository: Repository<Team>,
    @InjectRepository(Game) private gamesRepository: Repository<Game>,
    @InjectRepository(Player) private playersRepository: Repository<Player>,
  ) {}
  async searchGame(searchTerm: string) {
    return this.gamesRepository
      .createQueryBuilder('game')
      .where('LOWER(game.id) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }

  async searchTeams(searchTerm: string) {
    return this.teamsRepository
      .createQueryBuilder('team')
      .where('LOWER(team.full_name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }

  async searchPlayer(searchTerm: string) {
    return this.playersRepository
      .createQueryBuilder('player')
      .where('LOWER(player.first_name) LIKE LOWER(:searchTerm)', {
        searchTerm: `%${searchTerm}%`,
      })
      .getMany();
  }
}
