import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Team Table' })
export class Team {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  full_name: string;

  @Column()
  abbreviation: string;

  @Column()
  city: string;

  @Column()
  conference: string;

  @Column()
  division: string;

  @Column()
  hex_code: string;
}
