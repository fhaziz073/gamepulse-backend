import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Game Table' })
export class Game {
  @PrimaryColumn()
  id: number;

  @CreateDateColumn()
  date: Date;

  @Column()
  home_team_id: number;

  @Column()
  visitor_team_id: number;

  @Column()
  season: number;

  @Column()
  home_team_score: number;

  @Column()
  visitor_team_score: number;

  @Column()
  postseason: boolean;

  @Column()
  postponed: boolean;

  // @OneToOne(() => Betting)
  // @JoinColumn()
  // bettingOdds: Betting;
}
