import { Test, TestingModule } from '@nestjs/testing';
import { PlayerLogController } from './playerlog.controller';
import { PlayerLogService } from './playerlog.service';
 
describe('PlayerLogController', () => {
    let playerLogController: PlayerLogController;
    let playerLogService: PlayerLogService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlayerLogController],
      providers: [PlayerLogService]
    }).compile();

    playerLogController = module.get<PlayerLogController>(PlayerLogController);
    playerLogService = module.get<PlayerLogService>(PlayerLogService);
  });
 
});
