import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '@/modules/users/users.service';
import { StorageService } from '@/shared/storage/storage.service';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { AuthTokenResponse } from './models/auth-token-response.interface';
import { UserEntity } from '@/modules/users/entities/user.entity';

const passwordSaltRounds: number = 10;

@Injectable()
export class AuthService {
  public constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly storageService: StorageService,
  ) {}

  public async register(input: RegisterDto): Promise<AuthTokenResponse> {
    const existingUser: UserEntity | null = await this.usersService.findByEmail(input.email);
    if (existingUser) {
      throw new ConflictException('Email already in use.');
    }
    const passwordHash: string = await bcrypt.hash(input.password, passwordSaltRounds);
    const kebeleIdPhotoUrl: string | null = input.kebeleIdPhotoBase64
      ? (await this.storageService.uploadBase64Image(input.kebeleIdPhotoBase64, 'users/kebele')).url
      : null;
    const user: UserEntity = await this.usersService.createCustomer({
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address ?? null,
      passwordHash,
      kebeleIdPhotoUrl,
    });
    return this.createTokenResponse(user);
  }

  public async login(input: LoginDto): Promise<AuthTokenResponse> {
    const user: UserEntity | null = await this.usersService.findByIdentifier(input.identifier.toLowerCase());
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    const isPasswordValid: boolean = await bcrypt.compare(input.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }
    return this.createTokenResponse(user);
  }

  public async getProfile(userId: string): Promise<AuthTokenResponse['user']> {
    const user: UserEntity | null = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Invalid token.');
    }
    return this.mapUser(user);
  }

  private createTokenResponse(user: UserEntity): AuthTokenResponse {
    const accessToken: string = this.jwtService.sign({ sub: user.id, role: user.role });
    return { accessToken, user: this.mapUser(user) };
  }

  private mapUser(user: UserEntity): AuthTokenResponse['user'] {
    return {
      id: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      kebeleIdPhotoUrl: user.kebeleIdPhotoUrl,
      licenseNumber: user.licenseNumber,
    };
  }
}
