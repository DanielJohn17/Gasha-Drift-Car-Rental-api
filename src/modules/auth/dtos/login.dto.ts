import { IsString, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ description: 'Email or phone number.', example: 'john.doe@example.com' })
  @IsString()
  @MaxLength(160)
  public readonly identifier!: string;

  @ApiProperty({ example: 'ChangeMe123!' })
  @IsString()
  @MinLength(1)
  @MaxLength(72)
  public readonly password!: string;
}
