import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('games')
  searchGames(@Query('q') query: string) {
    return this.searchService.searchGame(query);
  }

  @Get('teams')
  searchTeams(@Query('q') query: string) {
    return this.searchService.searchTeams(query);
  }

  @Get('players')
  searchPlayers(@Query('q') query: string) {
    return this.searchService.searchPlayer(query);
  }
}
