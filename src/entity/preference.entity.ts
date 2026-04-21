import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'Preference Table' })
export class Preference {
  @PrimaryGeneratedColumn('uuid', { name: 'Preference ID' })
  id: string;

  @Column({ name: 'Games Starting Notif Pref', default: false })
  gameStartNotifPref: boolean;

  @Column({ name: 'Ongoing Close Games Notif Pref', default: false })
  ongoingGameNotifPref: boolean;

  @Column({ name: 'Favorite Teams', type: 'uuid', array: true, default: [] })
  favTeams: string[];

  @Column({ name: 'Favorite Players', type: 'uuid', array: true, default: [] })
  favPlayers: string[];
}
