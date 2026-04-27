import { Test, TestingModule } from '@nestjs/testing';
import { PlayerLogService } from './playerlog.service';
import axios from 'axios';
import { randomUUID } from 'crypto';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

jest.mock('crypto', () => ({
  randomUUID: jest.fn(),
}));

describe('PlayerLogService', () => {
  let service: PlayerLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PlayerLogService],
    }).compile();

    service = module.get<PlayerLogService>(PlayerLogService);

    jest.clearAllMocks();
  });

  describe('createPlayerLog', () => {
    it('should create and store a player log', () => {
      (randomUUID as jest.Mock).mockReturnValue('mock-uuid');

      const result = service.createPlayerLog('player1', 'game1');

      expect(result).toEqual({
        id: 'mock-uuid',
        playerId: 'player1',
        gameId: 'game1',
      });

      expect((service as any).playerLogs.length).toBe(1);
    });
  });

  describe('getAssistsProps', () => {
    it('should return assists data on success', async () => {
      mockedAxios.get.mockResolvedValue({ data: 5 });

      const result = await service.getAssistsProps('1', '10');

      expect(mockedAxios.get).toHaveBeenCalledWith(
        'https://api.balldontlie.io/v2/odds/player_props',
        expect.objectContaining({
          params: {
            player_id: '1',
            game_id: '10',
            prop_type: 'assists',
          },
        }),
      );
      expect(result).toBe(5);
    });

    it('should return 0 on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      const result = await service.getAssistsProps('1', '10');
      expect(result).toBe(0);
    });
  });

  describe('getReboundProps', () => {
    it('should return rebounds data on success', async () => {
      mockedAxios.get.mockResolvedValue({ data: 8 });

      const result = await service.getReboundProps('1', '10');
      expect(result).toBe(8);
    });

    it('should return 0 on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      const result = await service.getReboundProps('1', '10');
      expect(result).toBe(0);
    });
  });

  describe('getPointsProps', () => {
    it('should return points data on success', async () => {
      mockedAxios.get.mockResolvedValue({ data: 25 });

      const result = await service.getPointsProps('1', '10');
      expect(result).toBe(25);
    });

    it('should return 0 on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      const result = await service.getPointsProps('1', '10');
      expect(result).toBe(0);
    });
  });

  describe('getMinutesProps', () => {
    it('should return minutes data on success', async () => {
      mockedAxios.get.mockResolvedValue({ data: 32 });

      const result = await service.getMinutesProps('1', '10');
      expect(result).toBe(32);
    });

    it('should return 0 on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('API error'));

      const result = await service.getMinutesProps('1', '10');
      expect(result).toBe(0);
    });
  });
});