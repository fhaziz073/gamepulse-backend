import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatEntity } from 'src/entity/stat.entity';
import { VisualizationController } from './visualization.controller';
import { VisualizationService } from './visualization.service';

@Module({
  imports: [TypeOrmModule.forFeature([StatEntity])],
  controllers: [VisualizationController],
  providers: [VisualizationService],
})
export class VisualizationModule {}
