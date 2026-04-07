import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BettingService } from './betting.service';
 
@Controller('betting')
export class BettingController {
  constructor(private readonly bettingService: BettingService) {}
  
  

}
