import { IsDateString, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

export class CreateReservationDto {
  @IsUUID()
  public readonly vehicleId!: string;

  @IsDateString()
  public readonly startDate!: string;

  @IsDateString()
  public readonly endDate!: string;

  @IsString()
  @MaxLength(120)
  public readonly pickupLocation!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(80)
  public readonly licenseNumber!: string;

  @IsString()
  @MaxLength(120)
  public readonly transactionId!: string;

  @IsString()
  public readonly paymentScreenshotBase64!: string;
}
