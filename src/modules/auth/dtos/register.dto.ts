import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MaxLength(120)
  public readonly name!: string;

  @IsEmail()
  @MaxLength(160)
  public readonly email!: string;

  @IsString()
  @MaxLength(30)
  public readonly phone!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(72)
  public readonly password!: string;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly address?: string;

  @IsOptional()
  @IsString()
  public readonly kebeleIdPhotoBase64?: string;
}
