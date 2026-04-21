import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from './entity/user.entity';
import { Preference } from './entity/preference.entity';
import { Team } from './entity/team.entity';
import { Game } from './entity/game.entity';
import { CalendarModule } from './calendar/calendar.module';
import { TasksModule } from './tasks/tasks.module';
import { Player } from './entity/player.entity';
import { Betting } from './entity/betting.entity';
import { UsersModule } from './user/user.module';
import { PlayerModule } from './player/player.module';
import { GameModule } from './game/game.module';
import { SearchModule } from './search/search.module';
import { TeamModule } from './team/team.module';
@Module({
  imports: [
    AuthModule,
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL ? { rejectUnauthorized: false } : false,
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: process.env.POSTGRES_PASSWORD,
      database: 'gamepulse',
      entities: [User, Preference, Team, Game, Player, Betting],
      synchronize: true,
    }),
    CalendarModule,
    TasksModule,
    UsersModule,
    PlayerModule,
    GameModule,
    SearchModule,
    TeamModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
