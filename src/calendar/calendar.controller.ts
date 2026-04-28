import { Controller, Get, Param } from '@nestjs/common';
import { CalendarService, Event } from './calendar.service';
@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}
  @Get(':id')
  async findUpcomingGames(@Param('id') id: number): Promise<Event[]> {
    return await this.calendarService.findAll([id]);
  }
}
