import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Game } from './game.entity';
@Entity({ name: 'Betting Table' })
export class Betting {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendor: string;

  @Column()
  live: boolean;

  @Column()
  type: '2way' | 'spread' | 'over/under';

  @Column()
  odds_decimal_home: string;

  @Column()
  odds_decimal_visitor: string;

  @Column()
  odds_american_home: string;

  @Column()
  odds_american_visitor: string;

  @Column({ nullable: true })
  away_spread: string;

  @Column({ nullable: true })
  over_under: string;

  @ManyToOne(() => Game, (game) => game.bettingOdds)
  @JoinColumn({ name: 'game_id' })
  game: Game;

  @Column()
  game_id: number;
}
