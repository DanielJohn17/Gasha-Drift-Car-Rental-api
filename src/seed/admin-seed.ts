import { NestFactory } from '@nestjs/core';
import * as bcrypt from 'bcrypt';
import { AppModule } from '@/app.module';
import { UsersService } from '@/modules/users/users.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

const passwordSaltRounds: number = 10;

const executeSeed = async (): Promise<void> => {
  const appContext = await NestFactory.createApplicationContext(AppModule, { logger: ['error', 'warn'] });
  try {
    const usersService: UsersService = appContext.get(UsersService);
    const name: string | undefined = process.env.ADMIN_SEED_NAME;
    const email: string | undefined = process.env.ADMIN_SEED_EMAIL;
    const phone: string | undefined = process.env.ADMIN_SEED_PHONE;
    const password: string | undefined = process.env.ADMIN_SEED_PASSWORD;
    if (!name || !email || !phone || !password) {
      throw new Error('Missing ADMIN_SEED_* environment variables.');
    }
    const existing: UserEntity | null = await usersService.findByEmail(email);
    if (existing) {
      process.stdout.write(`Admin already exists: ${email}\n`);
      return;
    }
    const passwordHash: string = await bcrypt.hash(password, passwordSaltRounds);
    await usersService.createAdmin({ name, email, phone, passwordHash });
    process.stdout.write(`Admin created: ${email}\n`);
  } finally {
    await appContext.close();
  }
};

void executeSeed();
