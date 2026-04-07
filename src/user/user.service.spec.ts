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

  it('should create a user', () => {
    const user = service.createUser('john', 'john@test.com', 'avatar.png');
    expect(user).toBeDefined();
    expect(user.username).toBe('john');
  });
});