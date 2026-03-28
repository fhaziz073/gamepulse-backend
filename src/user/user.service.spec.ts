import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { randomUUID } from 'node:crypto';
describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService, // Add this provider to "satisfy" the UserService
        {
          provide: 'PG_CONNECTION',
          useValue: {
            query: jest.fn(), // Mock the database query method
          },
        },
      ],
    }).compile();
    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': randomUUID(),
      'Creation Time': new Date(),
    });
    const user = await service.logIn('john', '');
    expect(user).toBeDefined();
    expect(user?.Username).toBe('john');
  });
});
