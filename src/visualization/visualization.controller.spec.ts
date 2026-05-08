import { Test, TestingModule } from '@nestjs/testing';
import { VisualizationController } from './visualization.controller';

describe('VisualizationController', () => {
  let controller: VisualizationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VisualizationController],
    }).compile();

    controller = module.get<VisualizationController>(VisualizationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
