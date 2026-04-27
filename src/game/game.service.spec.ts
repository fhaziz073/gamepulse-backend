import { Test, TestingModule } from '@nestjs/testing';
import { GameService } from './game.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Betting } from 'src/entity/betting.entity';
import { Repository } from 'typeorm';

const mockApi = {
  nba: {
    getGame: jest.fn(),
    getOdds: jest.fn(),
  },
};

jest.mock('@balldontlie/sdk', () => {
  return {
    BalldontlieAPI: jest.fn().mockImplementation(() => mockApi),
  };
});

describe('GameService', () => {
  let service: GameService;
  let gameRepo: jest.Mocked<Repository<Game>>;
  let bettingRepo: jest.Mocked<Repository<Betting>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GameService,
        {
          provide: getRepositoryToken(Game),
          useValue: {
            findOneBy: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Betting),
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<GameService>(GameService);
    gameRepo = module.get(getRepositoryToken(Game));
    bettingRepo = module.get(getRepositoryToken(Betting));

    jest.clearAllMocks();
  });

  describe('getGameFromDB', () => {
    it('should return a game if found', async () => {
      const mockGame = { id: 1 } as Game;
      gameRepo.findOneBy.mockResolvedValue(mockGame);

      const result = await service.getGameFromDB(1);
      expect(result).toEqual(mockGame);
      expect(gameRepo.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('should return null if error occurs', async () => {
      gameRepo.findOneBy.mockRejectedValue(new Error('DB error'));

      const result = await service.getGameFromDB(1);
      expect(result).toBeNull();
    });
  });

  describe('createGame', () => {
    it('should save a game', async () => {
      const game = { id: 1 } as Partial<Game>;
      gameRepo.save.mockResolvedValue(game as Game);

      await service.createGame(game);
      expect(gameRepo.save).toHaveBeenCalledWith(game);
    });
  });

  describe('getGameByID', () => {
    it('should return existing game if found in DB', async () => {
      const existingGame = { id: 1 } as Game;
      jest.spyOn(service, 'getGameFromDB').mockResolvedValue(existingGame);

      const result = await service.getGameByID(1);
      expect(result).toBe(existingGame);
    });

    it('should fetch from API and save if not in DB', async () => {
      jest.spyOn(service, 'getGameFromDB').mockResolvedValueOnce(null).mockResolvedValueOnce({
        id: 1,
      } as Game);

      mockApi.nba.getGame.mockResolvedValue({
        data: {
          id: 1,
          date: '2024-01-01',
          home_team: { id: 10 },
          visitor_team: { id: 20 },
        },
      });

      mockApi.nba.getOdds.mockResolvedValue({
        data: [{ id: 100, odds: 1.5 }],
      });

      gameRepo.save.mockResolvedValue({ id: 1 } as Game);
      bettingRepo.save.mockImplementation(async (odd) => odd as Betting);

      const result = await service.getGameByID(1);

      expect(mockApi.nba.getGame).toHaveBeenCalledWith(1);
      expect(mockApi.nba.getOdds).toHaveBeenCalled();
      expect(gameRepo.save).toHaveBeenCalled();
      expect(bettingRepo.save).toHaveBeenCalled();
      expect(result).toEqual({ id: 1 });
    });

    it('should return null if API returns no game', async () => {
      jest.spyOn(service, 'getGameFromDB').mockResolvedValue(null);

      mockApi.nba.getGame.mockResolvedValue({ data: null });

      const result = await service.getGameByID(1);
      expect(result).toBeNull();
    });
  });

  describe('helper methods', () => {
    const mockGame = {
      home_team_id: 10,
      visitor_team_id: 20,
      home_team_score: 100,
      visitor_team_score: 90,
    } as Game;

    beforeEach(() => {
      jest.spyOn(service, 'getGameByID').mockResolvedValue(mockGame);
    });

    it('getHomeTeam', async () => {
      expect(await service.getHomeTeam(1)).toBe(10);
    });

    it('getAwayTeam', async () => {
      expect(await service.getAwayTeam(1)).toBe(20);
    });

    it('getHomeScore', async () => {
      expect(await service.getHomeScore(1)).toBe(100);
    });

    it('getAwayScore', async () => {
      expect(await service.getAwayScore(1)).toBe(90);
    });
  });

  describe('getStatus', () => {
    it('should return game status from API', async () => {
      mockApi.nba.getGame.mockResolvedValue({
        data: [{ status: 'Final' }],
      });

      const result = await service.getStatus(1);
      expect(result).toBe('Final');
    });
  });
});