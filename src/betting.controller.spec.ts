import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [UserService],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });


  describe('root', () => {
    it('should create a user', () => {
    const user = userController.createUser({
      username: 'john',
      email: 'john@test.com',
      avatarUrl: 'avatar.png',
    });

    expect(user.username).toBe('john');
  });

  it('should get a user', () => {
    const user = userService.createUser('john', 'john@test.com', 'avatar.png');
    const found = userController.getUser(user.id);
    expect(found?.id).toBe(user.id);
  });
  });
});

