import { IsString, MaxLength, MinLength } from 'class-validator';

export class LoginDto {
  @IsString()
  @MaxLength(160)
  public readonly identifier!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(72)
  public readonly password!: string;
}
