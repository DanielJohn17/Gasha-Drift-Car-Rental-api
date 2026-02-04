import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(120)
  public readonly name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  @IsEmail()
  @MaxLength(160)
  public readonly email!: string;

  @ApiProperty({ example: '+251900000000' })
  @IsString()
  @MaxLength(30)
  public readonly phone!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  public readonly password!: string;

  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  public readonly address?: string;

  @ApiPropertyOptional({ description: 'Base64 data URL: data:image/*;base64,...' })
  @IsOptional()
  @IsString()
  public readonly kebeleIdPhotoBase64?: string;
}
