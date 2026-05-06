import { Module } from '@nestjs/common';
import { PlayerLogController } from './playerlog.controller';
import { PlayerLogService } from './playerlog.service';

@Module({
  imports: [],
  controllers: [PlayerLogController],
  providers: [PlayerLogService],
})
export class PlayerLogModule {}
