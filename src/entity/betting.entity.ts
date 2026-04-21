import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Betting Table' })
export class Betting {
  @PrimaryColumn()
  id: number;

  @Column()
  vender: string;

  @Column()
  spread_home_value: string;

  @Column()
  spread_home_odds: number;

  @Column()
  spread_away_value: string;

  @Column()
  spread_away_odds: number;

  @Column()
  moneyline_home_odds: number;

  @Column()
  moneyline_away_odds: number;

  @Column()
  total_value: string;

  @Column()
  total_over_odds: number;

  @Column()
  total_under_odds: number;
}
