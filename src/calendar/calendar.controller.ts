import { Controller, Get } from '@nestjs/common';
import type { Request } from 'express';
import { CalendarService, Event } from './calendar.service';
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}
  @Get()
  async findUpcomingGames(): Promise<Event[]> {
    return await this.calendarService.findAll();
  }
}
