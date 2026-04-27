import { Test, TestingModule } from '@nestjs/testing';
import { SearchService } from './search.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Player } from 'src/entity/player.entity';
import { Team } from 'src/entity/team.entity';
import { Repository } from 'typeorm';

describe('SearchService', () => {
  let service: SearchService;

  let gameRepo: jest.Mocked<Repository<Game>>;
  let playerRepo: jest.Mocked<Repository<Player>>;
  let teamRepo: jest.Mocked<Repository<Team>>;

  const mockQueryBuilder = () => ({
    where: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  });

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SearchService,
        {
          provide: getRepositoryToken(Game),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Player),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Team),
          useValue: {
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<SearchService>(SearchService);

    gameRepo = module.get(getRepositoryToken(Game));
    playerRepo = module.get(getRepositoryToken(Player));
    teamRepo = module.get(getRepositoryToken(Team));

    jest.clearAllMocks();
  });

  describe('searchGame', () => {
    it('should search games by id', async () => {
      const qb = mockQueryBuilder();
      const mockResults = [{ id: 123 }];

      qb.getMany.mockResolvedValue(mockResults);
      gameRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.searchGame('123');

      expect(gameRepo.createQueryBuilder).toHaveBeenCalledWith('game');
      expect(qb.where).toHaveBeenCalledWith(
        'LOWER(game.id) LIKE LOWER(:searchTerm)',
        { searchTerm: '%123%' },
      );
      expect(qb.getMany).toHaveBeenCalled();
      expect(result).toEqual(mockResults);
    });
  });

  describe('searchTeams', () => {
    it('should search teams by full_name', async () => {
      const qb = mockQueryBuilder();
      const mockResults = [{ full_name: 'Los Angeles Lakers' }];

      qb.getMany.mockResolvedValue(mockResults);
      teamRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.searchTeams('lakers');

      expect(teamRepo.createQueryBuilder).toHaveBeenCalledWith('team');
      expect(qb.where).toHaveBeenCalledWith(
        'LOWER(team.full_name) LIKE LOWER(:searchTerm)',
        { searchTerm: '%lakers%' },
      );
      expect(result).toEqual(mockResults);
    });
  });

  describe('searchPlayer', () => {
    it('should search players by first_name', async () => {
      const qb = mockQueryBuilder();
      const mockResults = [{ first_name: 'LeBron' }];

      qb.getMany.mockResolvedValue(mockResults);
      playerRepo.createQueryBuilder.mockReturnValue(qb as any);

      const result = await service.searchPlayer('lebron');

      expect(playerRepo.createQueryBuilder).toHaveBeenCalledWith('player');
      expect(qb.where).toHaveBeenCalledWith(
        'LOWER(player.first_name) LIKE LOWER(:searchTerm)',
        { searchTerm: '%lebron%' },
      );
      expect(result).toEqual(mockResults);
    });
  });
});