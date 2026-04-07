import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PlayerService } from './player.service';
 
@Controller()
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

}
