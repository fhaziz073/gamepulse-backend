import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: Date;
  showA: boolean;
  showM: boolean;
  showR: boolean;
  showP: boolean;
}

@Injectable()
export class UserService {
    private users: User[] = [];

  createUser(username: string, email: string, avatarUrl: string): User {
    const user: User = {
      id: randomUUID(),
      username,
      email,
      avatarUrl,
      createdAt: new Date(),
      showA: true,
      showM: true,
      showR: true,
      showP: true
    };

    this.users.push(user);
    return user;
  }

  getUser(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }

  setUsername(id: string, newUsername: string): void {
    const user = this.getUser(id);
    if (user) user.username = newUsername;
  }

  setEmail(id: string, newEmail: string): void {
    const user = this.getUser(id);
    if (user) user.email = newEmail;
  }

  setAvatarUrl(id: string, newUrl: string): void {
    const user = this.getUser(id);
    if (user) user.avatarUrl = newUrl;
  }

  changePreferences(id: string, a: boolean, m: boolean, r: boolean, p: boolean): void {
    const user = this.getUser(id);
    if (user) user.showA = a, user.showM = m, user.showP = p, user.showR = r;
    if (user && user.showA) 
    if (user && user.showM)
    if (user && user.showP)
    if (user && user.showR) 
  }





  
}
