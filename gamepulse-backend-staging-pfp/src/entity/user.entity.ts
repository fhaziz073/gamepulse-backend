import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Preference } from './preference.entity';

@Entity({ name: 'User Table' })
export class User {
  @PrimaryGeneratedColumn('uuid', { name: 'User ID' })
  id: string;

  @Column({ name: 'Avatar URL', nullable: true })
  avatarUrl: string;

  @CreateDateColumn({ name: 'Creation Time' })
  creationTime: Date;

  @Column({ name: 'Password' })
  password: string;

  @Column({ name: 'Username', unique: true })
  username: string;

  @Column({ name: 'Email' })
  email: string;

  @Column({ name: 'Notification Token', nullable: true })
  notificationToken: string;

  @OneToOne(() => Preference)
  @JoinColumn()
  preference: Preference;
}
