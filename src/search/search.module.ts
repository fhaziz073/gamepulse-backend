import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { Team } from 'src/entity/team.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Game } from 'src/entity/game.entity';
import { Player } from 'src/entity/player.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Team, Game, Player])],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
