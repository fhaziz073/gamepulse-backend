import { Test, TestingModule } from '@nestjs/testing';
import { BettingService } from './betting.service';

describe('BettingService', () => {
  let bettingService: BettingService;
 
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BettingService],
    }).compile();

    bettingService = module.get<BettingService>(BettingService);
  });

});