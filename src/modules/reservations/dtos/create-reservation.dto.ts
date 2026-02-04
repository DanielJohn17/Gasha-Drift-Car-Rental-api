import { IsDateString, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  public readonly vehicleId!: string;

  @ApiProperty({ description: 'ISO date string', example: '2026-01-10T08:00:00.000Z' })
  @IsDateString()
  public readonly startDate!: string;

  @ApiProperty({ description: 'ISO date string', example: '2026-01-12T08:00:00.000Z' })
  @IsDateString()
  public readonly endDate!: string;

  @ApiProperty({ example: 'Bole, Addis Ababa' })
  @IsString()
  @MaxLength(120)
  public readonly pickupLocation!: string;

  @ApiProperty({ example: 'DL-123-456-789' })
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  public readonly licenseNumber!: string;

  @ApiProperty({ example: 'TXN-000001' })
  @IsString()
  @MaxLength(120)
  public readonly transactionId!: string;

  @ApiProperty({ description: 'Base64 data URL: data:image/*;base64,...' })
  @IsString()
  public readonly paymentScreenshotBase64!: string;
}
