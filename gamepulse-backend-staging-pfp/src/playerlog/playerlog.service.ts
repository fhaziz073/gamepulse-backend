import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import axios from 'axios';
export interface PlayerLog {
  id: string;
  playerId: string;
  gameId: string;
}

@Injectable()
export class PlayerLogService {
  private apiKey = process.env.SPORTS_API_KEY as string;
  private playerLogs: PlayerLog[] = [];

  createPlayerLog(playerId: string, gameId: string): PlayerLog {
    const playerLog: PlayerLog = {
      id: randomUUID(),
      playerId,
      gameId,
    };

    this.playerLogs.push(playerLog);
    return playerLog;
  }

  async getAssistsProps(playerId: string, gameId: string): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.balldontlie.io/v2/odds/player_props',
        {
          params: {
            player_id: playerId,
            game_id: gameId,
            prop_type: 'assists',
          },
          headers: { Authorization: this.apiKey },
        },
      );
      return response.data;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getReboundProps(playerId: string, gameId: string): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.balldontlie.io/v2/odds/player_props',
        {
          params: {
            player_id: playerId,
            game_id: gameId,
            prop_type: 'rebounds',
          },
          headers: { Authorization: this.apiKey },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }

  async getPointsProps(playerId: string, gameId: string): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.balldontlie.io/v2/odds/player_props',
        {
          params: { player_id: playerId, game_id: gameId, prop_type: 'points' },
          headers: { Authorization: this.apiKey },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
  async getMinutesProps(playerId: string, gameId: string): Promise<number> {
    try {
      const response = await axios.get(
        'https://api.balldontlie.io/v2/odds/player_props',
        {
          params: {
            player_id: playerId,
            game_id: gameId,
            prop_type: 'minutes',
          },
          headers: { Authorization: this.apiKey },
        },
      );

      return response.data;
    } catch (error) {
      console.error(error);
      return 0;
    }
  }
}
