import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { Betting } from './betting.entity';

@Entity({ name: 'Game Table' })
export class Game {
  @PrimaryColumn()
  id: number;

  @Column()
  date: string;

  @Column()
  home_team_id: number;

  @Column()
  visitor_team_id: number;

  @Column()
  season: number;

  @Column({ nullable: true })
  home_q1: number;

  @Column({ nullable: true })
  home_q2: number;

  @Column({ nullable: true })
  home_q3: number;

  @Column({ nullable: true })
  home_q4: number;

  @Column({ nullable: true })
  home_ot1: number;

  @Column({ nullable: true })
  home_ot2: number;

  @Column({ nullable: true })
  home_ot3: number;

  @Column({ nullable: true })
  visitor_q1: number;

  @Column({ nullable: true })
  visitor_q2: number;

  @Column({ nullable: true })
  visitor_q3: number;

  @Column({ nullable: true })
  visitor_q4: number;

  @Column({ nullable: true })
  visitor_ot1: number;

  @Column({ nullable: true })
  visitor_ot2: number;

  @Column({ nullable: true })
  visitor_ot3: number;

  @Column()
  home_team_score: number;

  @Column()
  visitor_team_score: number;

  @Column()
  postseason: boolean;

  @Column({ nullable: true })
  postponed: boolean;

  @OneToMany(() => Betting, (bettingOdds) => bettingOdds.game, {
    cascade: true,
  })
  bettingOdds: Betting[];
}
