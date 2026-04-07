import { Test, TestingModule } from '@nestjs/testing';
import { BettingController } from './betting.controller';
import { BettingService } from './betting.service';
 
describe('BettingController', () => {
  let bettingController: BettingController;
  let bettingService: BettingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BettingController],
      providers: [BettingService],
    }).compile();

    bettingController = module.get<BettingController>(BettingController);
    bettingService = module.get<BettingService>(BettingService);
  });

});

