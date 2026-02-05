import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { mockUser } from '../../../test/fixtures';

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            findOne: jest.fn(),
            createQueryBuilder: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createCustomer', () => {
    it('should create a customer user', async () => {
      const input = {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '+251900000001',
        address: '123 Main St',
        passwordHash: 'hashedpassword',
        kebeleIdPhotoUrl: 'http://example.com/photo.jpg',
      };

      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);

      const result = await service.createCustomer(input);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRole.Customer,
          ...input,
        }),
      );
      expect(repository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });
  });

  describe('createAdmin', () => {
    it('should create an admin user', async () => {
      const input = {
        name: 'Admin User',
        email: 'admin@example.com',
        phone: '+251900000000',
        passwordHash: 'hashedpassword',
      };

      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);

      await service.createAdmin(input);

      expect(repository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          role: UserRole.Admin,
          name: input.name,
          email: input.email,
          phone: input.phone,
          passwordHash: input.passwordHash,
          address: null,
          kebeleIdPhotoUrl: null,
          licenseNumber: null,
        }),
      );
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('john@example.com');

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      repository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById(mockUser.id);

      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: mockUser.id },
      });
      expect(result).toEqual(mockUser);
    });
  });
});
