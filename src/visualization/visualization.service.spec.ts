import { Test, TestingModule } from '@nestjs/testing';
import { VisualizationService } from './visualization.service';

describe('VisualizationService', () => {
  let service: VisualizationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VisualizationService],
    }).compile();

    service = module.get<VisualizationService>(VisualizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
