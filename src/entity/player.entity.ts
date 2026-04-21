import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Player Table' })
export class Player {
  @PrimaryColumn()
  id: number;

  @Column()
  first_name: string;

  @Column()
  last_name: string;

  @Column()
  position: string;

  @Column()
  height: string;

  @Column()
  weight: string;

  @Column()
  jersey_number: string;

  @Column()
  college: string;

  @Column()
  country: string;

  @Column()
  draft_year: number;

  @Column()
  draft_round: number;

  @Column()
  draft_number: number;
}
