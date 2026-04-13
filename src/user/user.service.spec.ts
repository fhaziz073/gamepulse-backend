import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': randomUUID(),
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    expect(user).toBeDefined();
    expect(user?.Username).toBe('john');
  });


});