import { Controller, Get } from '@nestjs/common';
import type { Request } from 'express';
@Controller('calendar')
export class CalendarController {
  @Get()
  findUpcomingGames(): string {
    return 'This action returns all events for your favorite teams';
  }
}
