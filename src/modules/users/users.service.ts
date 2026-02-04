import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';

@Injectable()
export class UsersService {
  public constructor(@InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>) {}

  public async createCustomer(input: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly address: string | null;
    readonly passwordHash: string;
    readonly kebeleIdPhotoUrl: string | null;
  }): Promise<UserEntity> {
    const user: UserEntity = this.usersRepository.create({
      role: UserRole.Customer,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: input.address,
      passwordHash: input.passwordHash,
      kebeleIdPhotoUrl: input.kebeleIdPhotoUrl,
      licenseNumber: null,
    });
    return this.usersRepository.save(user);
  }

  public async createAdmin(input: {
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly passwordHash: string;
  }): Promise<UserEntity> {
    const user: UserEntity = this.usersRepository.create({
      role: UserRole.Admin,
      name: input.name,
      email: input.email,
      phone: input.phone,
      address: null,
      passwordHash: input.passwordHash,
      kebeleIdPhotoUrl: null,
      licenseNumber: null,
    });
    return this.usersRepository.save(user);
  }

  public async findByEmail(email: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  public async findByIdentifier(identifier: string): Promise<UserEntity | null> {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('LOWER(user.email) = LOWER(:identifier)', { identifier })
      .orWhere('LOWER(user.name) = LOWER(:identifier)', { identifier })
      .getOne();
  }

  public async findById(userId: string): Promise<UserEntity | null> {
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  public async saveUser(user: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(user);
  }
}
