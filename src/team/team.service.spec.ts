import { Test, TestingModule } from '@nestjs/testing';
import { TeamService } from './team.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Team } from 'src/entity/team.entity';
import { Repository } from 'typeorm';

const mockApi = {
  nba: {
    getTeam: jest.fn(),
    getPlayers: jest.fn(),
  },
};

jest.mock('@balldontlie/sdk', () => {
  return {
    BalldontlieAPI: jest.fn().mockImplementation(() => mockApi),
  };
});

describe('TeamService', () => {
  let service: TeamService;
  let teamRepo: jest.Mocked<Repository<Team>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TeamService,
        {
          provide: getRepositoryToken(Team),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<TeamService>(TeamService);
    teamRepo = module.get(getRepositoryToken(Team));

    jest.clearAllMocks();
  });

  describe('getTeamFromDB', () => {
    it('should return team if found', async () => {
      const mockTeam = { id: 1 } as Team;
      teamRepo.findOneBy.mockResolvedValue(mockTeam);

      const result = await service.getTeamFromDB(1);
      expect(result).toEqual(mockTeam);
      expect(teamRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if DB throws error', async () => {
      teamRepo.findOneBy.mockRejectedValue(new Error('DB error'));

      const result = await service.getTeamFromDB(1);
      expect(result).toBeNull();
    });
  });

  describe('createTeam', () => {
    it('should save team', async () => {
      const team = { id: 1 } as Team;
      teamRepo.save.mockResolvedValue(team);

      await service.createTeam(team);
      expect(teamRepo.save).toHaveBeenCalledWith(team);
    });
  });

  describe('getTeamById', () => {
    it('should return existing team from DB', async () => {
      const existingTeam = { id: 1 } as Team;
      jest.spyOn(service, 'getTeamFromDB').mockResolvedValue(existingTeam);

      const result = await service.getTeamById(1);
      expect(result).toBe(existingTeam);
    });

    it('should fetch from API, save, and return if not in DB', async () => {
      jest
        .spyOn(service, 'getTeamFromDB')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1 } as Team);

      mockApi.nba.getTeam.mockResolvedValue({
        data: { id: 1, full_name: 'Lakers' },
      });

      teamRepo.save.mockResolvedValue({ id: 1 } as Team);

      const result = await service.getTeamById(1);

      expect(mockApi.nba.getTeam).toHaveBeenCalledWith(1);
      expect(teamRepo.save).toHaveBeenCalledWith({
        id: 1,
        full_name: 'Lakers',
        hex_code: '',
      });
      expect(result).toEqual({ id: 1 });
    });

    it('should return null if API returns no team', async () => {
      jest.spyOn(service, 'getTeamFromDB').mockResolvedValue(null);

      mockApi.nba.getTeam.mockResolvedValue({ data: null });

      const result = await service.getTeamById(1);
      expect(result).toBeNull();
    });
  });

  describe('getPlayers', () => {
    it('should return players from API', async () => {
      const mockPlayers = [{ id: 10 }, { id: 20 }];

      mockApi.nba.getPlayers.mockResolvedValue(mockPlayers);

      const result = await service.getPlayers([1]);

      expect(mockApi.nba.getPlayers).toHaveBeenCalledWith({
        team_ids: [1],
      });
      expect(result).toEqual(mockPlayers);
    });
  });
});