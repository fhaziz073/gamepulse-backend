import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Betting } from 'src/entity/betting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Game, Betting])],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}
