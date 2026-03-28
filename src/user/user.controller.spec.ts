import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        // Add this provider to "satisfy" the UserService
        {
          provide: 'PG_CONNECTION',
          useValue: {
            query: jest.fn(), // Mock the database query method
          },
        },
      ],
    }).compile();

    userController = module.get<UserController>(UserController);
  });

  describe('root', () => {
    it('should create and get a user', async () => {
      await userController.createUser({
        username: 'john',
        email: 'john@test.com',
        avatarUrl: 'avatar.png',
      });
      const user = await userController.getUser('john');
      expect(user?.Username).toBe('john');
    });
  });
});
