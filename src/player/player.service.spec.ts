import { Test, TestingModule } from '@nestjs/testing';
import { PlayerService } from './player.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Player } from 'src/entity/player.entity';
import { Repository } from 'typeorm';

const mockApi = {
  nba: {
    getPlayer: jest.fn(),
    getPlayers: jest.fn(),
    getAdvancedStats: jest.fn(),
  },
};

jest.mock('@balldontlie/sdk', () => {
  return {
    BalldontlieAPI: jest.fn().mockImplementation(() => mockApi),
  };
});

describe('PlayerService', () => {
  let service: PlayerService;
  let playerRepo: jest.Mocked<Repository<Player>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlayerService,
        {
          provide: getRepositoryToken(Player),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PlayerService>(PlayerService);
    playerRepo = module.get(getRepositoryToken(Player));

    jest.clearAllMocks();
  });

  describe('getPlayerFromDB', () => {
    it('should return player if found', async () => {
      const mockPlayer = { id: 1 } as Player;
      playerRepo.findOneBy.mockResolvedValue(mockPlayer);

      const result = await service.getPlayerFromDB(1);
      expect(result).toEqual(mockPlayer);
      expect(playerRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if DB throws error', async () => {
      playerRepo.findOneBy.mockRejectedValue(new Error('DB error'));

      const result = await service.getPlayerFromDB(1);
      expect(result).toBeNull();
    });
  });

  describe('createPlayer', () => {
    it('should save player', async () => {
      const player = { id: 1 } as Player;
      playerRepo.save.mockResolvedValue(player);

      await service.createPlayer(player);
      expect(playerRepo.save).toHaveBeenCalledWith(player);
    });
  });

  describe('getPlayerById', () => {
    it('should return existing player from DB', async () => {
      const existingPlayer = { id: 1 } as Player;
      jest.spyOn(service, 'getPlayerFromDB').mockResolvedValue(existingPlayer);

      const result = await service.getPlayerById(1);
      expect(result).toBe(existingPlayer);
    });

    it('should fetch from API and save if not in DB', async () => {
      jest
        .spyOn(service, 'getPlayerFromDB')
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1 } as Player);

      mockApi.nba.getPlayer.mockResolvedValue({
        data: { id: 1, first_name: 'LeBron' },
      });

      playerRepo.save.mockResolvedValue({ id: 1 } as Player);

      const result = await service.getPlayerById(1);

      expect(mockApi.nba.getPlayer).toHaveBeenCalledWith(1);
      expect(playerRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should return null if API returns no player', async () => {
      jest.spyOn(service, 'getPlayerFromDB').mockResolvedValue(null);

      mockApi.nba.getPlayer.mockResolvedValue({ data: null });

      const result = await service.getPlayerById(1);
      expect(result).toBeNull();
    });
  });

  describe('getPlayerByName', () => {
    it('should fetch players and save them', async () => {
      const players = [
        { id: 1, first_name: 'LeBron' },
        { id: 2, first_name: 'Lonnie' },
      ];

      mockApi.nba.getPlayers.mockResolvedValue({ data: players });
      playerRepo.save.mockImplementation(async (p) => p as Player);

      const result = await service.getPlayerByName('Le');

      expect(mockApi.nba.getPlayers).toHaveBeenCalledWith({
        first_name: 'Le',
      });
      expect(playerRepo.save).toHaveBeenCalledTimes(players.length);
      expect(result).toEqual(players);
    });
  });

  describe('getSeason', () => {
    it('should return advanced stats for previous season', async () => {
      const mockStats = [{ player_id: 1, efficiency: 25 }];

      mockApi.nba.getAdvancedStats.mockResolvedValue({
        data: mockStats,
      });

      const result = await service.getSeason(1);

      expect(mockApi.nba.getAdvancedStats).toHaveBeenCalledWith({
        seasons: [new Date().getFullYear() - 1],
        player_ids: [1],
      });
      expect(result).toEqual(mockStats);
    });
  });
});