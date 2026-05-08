import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerLogService } from './playerlog.service';
 
@Controller('playerlogs')
export class PlayerLogController {
  constructor(private readonly playerLogService: PlayerLogService) {}

}
