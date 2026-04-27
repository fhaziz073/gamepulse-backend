import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { User } from 'src/entity/user.entity';
import { Preference } from 'src/entity/preference.entity';

describe('UserService', () => {
  let service: UserService;

  let userRepo: jest.Mocked<any>;
  let prefRepo: jest.Mocked<any>;

  beforeEach(async () => {
    userRepo = {
      findOneBy: jest.fn(),
      findOne: jest.fn(),
      find: jest.fn(),
      save: jest.fn(),
      update: jest.fn(),
    };

    prefRepo = {
      save: jest.fn(),
      update: jest.fn(),
      upsert: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: userRepo,
        },
        {
          provide: getRepositoryToken(Preference),
          useValue: prefRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create user', async () => {
    prefRepo.save.mockResolvedValue({ id: 'pref1' });

    userRepo.save.mockResolvedValue({
      id: 'user1',
      preference: { id: 'pref1' },
    });

    const result = await service.createUser({
      username: 'john',
      email: 'john@mail.com',
      avatarUrl: 'url',
      password: 'pass',
      notificationToken: 'token',
    });

    expect(prefRepo.save).toHaveBeenCalledTimes(1);
    expect(userRepo.save).toHaveBeenCalledTimes(1);
    expect(result.preference.id).toBe('pref1');
  });

  it('should return users', async () => {
    userRepo.find.mockResolvedValue([{ username: 'john' }]);

    const result = await service.getUsers();

    expect(result).toEqual([{ username: 'john' }]);
    expect(userRepo.find).toHaveBeenCalledWith({
      select: { username: true },
    });
  });

  it('should update email', async () => {
    userRepo.update.mockResolvedValue({ affected: 1 });

    await service.setEmail('id', 'test@mail.com');

    expect(userRepo.update).toHaveBeenCalledWith(
      { id: 'id' },
      { email: 'test@mail.com' },
    );
  });

  it('should login user', async () => {
    userRepo.findOneBy.mockResolvedValue({
      username: 'john',
      password: 'pass',
    });

    const result = await service.logIn('john', 'pass');

    expect(result.username).toBe('john');
    expect(userRepo.findOneBy).toHaveBeenCalledWith({ username: 'john' });
  });

  it('should get preference id', async () => {
    userRepo.findOne.mockResolvedValue({
      preference: { id: 'pref1' },
    });

    const result = await service.getPrefID('user1');

    expect(result).toBe('pref1');
  });

  it('should change game start notif', async () => {
    userRepo.findOne.mockResolvedValue({
      preference: { id: 'pref1' },
    });

    prefRepo.update.mockResolvedValue({ affected: 1 });

    await service.changeGS('user1', true);

    expect(prefRepo.update).toHaveBeenCalledWith(
      { id: 'pref1' },
      { gameStartNotifPref: true },
    );
  });

  it('should update favorite teams', async () => {
    userRepo.findOne.mockResolvedValue({
      preference: { id: 'pref1' },
    });

    prefRepo.update.mockResolvedValue({ affected: 1 });

    await service.updateFavoriteTeams('user1', ['teamA']);

    expect(prefRepo.update).toHaveBeenCalledWith(
      { id: 'pref1' },
      { favTeams: ['teamA'] },
    );
  });
});