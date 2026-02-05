import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AuthService } from './auth.service';
import { UsersService } from '@/modules/users/users.service';
import { StorageService } from '@/shared/storage/storage.service';
import { mockUser } from '../../../test/fixtures';
import { UserRole } from '@/modules/users/enums/user-role.enum';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: jest.Mocked<UsersService>;
  let jwtService: jest.Mocked<JwtService>;
  let storageService: jest.Mocked<StorageService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            findByIdentifier: jest.fn(),
            findById: jest.fn(),
            createCustomer: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
        {
          provide: StorageService,
          useValue: {
            uploadBase64Image: jest.fn().mockResolvedValue({ url: 'http://example.com/photo.jpg' }),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get(UsersService);
    jwtService = module.get(JwtService);
    storageService = module.get(StorageService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    const registerDto = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+251900000001',
      password: 'password123',
      address: '123 Main St',
      kebeleIdPhotoBase64: 'base64encodedstring',
    };

    it('should successfully register a new user', async () => {
      usersService.findByEmail.mockResolvedValue(null);
      usersService.createCustomer.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(usersService.findByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(storageService.uploadBase64Image).toHaveBeenCalledWith(registerDto.kebeleIdPhotoBase64, 'users/kebele');
      expect(usersService.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          name: registerDto.name,
          email: registerDto.email,
          phone: registerDto.phone,
          address: registerDto.address,
          passwordHash: expect.any(String),
          kebeleIdPhotoUrl: 'http://example.com/photo.jpg',
        }),
      );
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
          name: mockUser.name,
        }),
      });
    });

    it('should throw ConflictException if email already exists', async () => {
      usersService.findByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(new ConflictException('Email already in use.'));
    });

    it('should register without photo if kebeleIdPhotoBase64 is not provided', async () => {
      const dtoWithoutPhoto = { ...registerDto, kebeleIdPhotoBase64: undefined };
      usersService.findByEmail.mockResolvedValue(null);
      usersService.createCustomer.mockResolvedValue(mockUser);

      await service.register(dtoWithoutPhoto as any);

      expect(storageService.uploadBase64Image).not.toHaveBeenCalled();
      expect(usersService.createCustomer).toHaveBeenCalledWith(
        expect.objectContaining({
          kebeleIdPhotoUrl: null,
        }),
      );
    });
  });

  describe('login', () => {
    const loginDto = {
      identifier: 'john@example.com',
      password: 'password123',
    };

    it('should successfully login with valid credentials', async () => {
      usersService.findByIdentifier.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(true));

      const result = await service.login(loginDto);

      expect(usersService.findByIdentifier).toHaveBeenCalledWith(loginDto.identifier.toLowerCase());
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        user: expect.objectContaining({
          id: mockUser.id,
          email: mockUser.email,
        }),
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findByIdentifier.mockResolvedValue(null);

      await expect(service.login(loginDto)).rejects.toThrow(new UnauthorizedException('Invalid credentials.'));
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      usersService.findByIdentifier.mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, 'compare').mockImplementation(() => Promise.resolve(false));

      await expect(service.login(loginDto)).rejects.toThrow(new UnauthorizedException('Invalid credentials.'));
    });
  });

  describe('getProfile', () => {
    it('should return user profile', async () => {
      usersService.findById.mockResolvedValue(mockUser);

      const result = await service.getProfile(mockUser.id);

      expect(usersService.findById).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({
        id: mockUser.id,
        role: mockUser.role,
        name: mockUser.name,
        email: mockUser.email,
        phone: mockUser.phone,
        address: mockUser.address,
        kebeleIdPhotoUrl: mockUser.kebeleIdPhotoUrl,
        licenseNumber: mockUser.licenseNumber,
      });
    });

    it('should throw UnauthorizedException if user not found', async () => {
      usersService.findById.mockResolvedValue(null);

      await expect(service.getProfile('non-existent-id')).rejects.toThrow(new UnauthorizedException('Invalid token.'));
    });
  });
});
