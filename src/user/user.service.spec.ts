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
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    expect(user).toBeDefined();
    expect(user?.Username).toBe('john');
  });

  it('should set email', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    await service.setEmail("1001", 'john@stevens.edu');
    expect(user).toBeDefined();
    expect(user?.Email).toBe('john@stevens.edu');
  });

  it('should set password', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    await service.setPassword("1001", 'password2');
    expect(user).toBeDefined();
    expect(user?.Password).toBe('password2');
  });

  it('should set username', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    await service.setUsername("1001", 'jane');
    expect(user).toBeDefined();
    expect(user?.Username).toBe('jane');
  });

  it('should set avatar', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const user = await service.logIn('john', '');
    await service.setAvatarUrl("1001", 'aangkorra.png');
    expect(user).toBeDefined();
    expect(user?.['Avatar URL']).toBe('aangkorra.png');
  });

  it('should create a preference table', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001-2020-3434-4545-5656",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const table = await service.upsertPreferenceTable("1001-2020-3434-4545-5656", false, false, ["2020-2020-3434-4545-5656"], ["2021-2020-3434-4545-5656"]);
    expect(table).toBeDefined();
  });

  it('should change gs', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001-2020-3434-4545-5656",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const table = await service.upsertPreferenceTable("1001-2020-3434-4545-5656", false, false, ["2020-2020-3434-4545-5656"], ["2021-2020-3434-4545-5656"]);
    await service.changeGS("1001-2020-3434-4545-5656", true);
    expect(table).toBeDefined();
  });

  it('should change ogs', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
    await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001-2020-3434-4545-5656",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const table = await service.upsertPreferenceTable("1001-2020-3434-4545-5656", false, false, ["2020-2020-3434-4545-5656"], ["2021-2020-3434-4545-5656"]);
    await service.changeOGC("1001-2020-3434-4545-5656", true);
    expect(table).toBeDefined();
  });

  it('should update favorite teams', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
        await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001-2020-3434-4545-5656",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const table = await service.upsertPreferenceTable("1001-2020-3434-4545-5656", false, false, ["2020-2020-3434-4545-5656"], ["2021-2020-3434-4545-5656"]);
    await service.updateFavoriteTeams("1001-2020-3434-4545-5656", ["2020-2020-3434-4545-5657"]);
    expect(table).toBeDefined();
  });

  it('should get update favorite players', async () => {
    // const user = service.createUser('john', 'john@test.com', 'avatar.png');
        await service.upsertUser({
      Username: 'john',
      Email: 'john@test.com',
      'Avatar URL': 'avatar.png',
      'User ID': "1001-2020-3434-4545-5656",
      'Creation Time': new Date(),
      Password: 'password1',
      'Notification Token': 'token1',
    });
    const table = await service.upsertPreferenceTable("1001-2020-3434-4545-5656", false, false, ["2020-2020-3434-4545-5656"], ["2021-2020-3434-4545-5656"]);
    await service.updateFavoritePlayers("1001-2020-3434-4545-5656", ["2021-2020-3434-4545-5657"]);
    expect(table).toBeDefined();
  });

}); 
