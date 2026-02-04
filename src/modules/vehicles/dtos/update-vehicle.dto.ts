import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

export class UpdateVehicleDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  public readonly make?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  public readonly model?: string;

  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  public readonly year?: number;

  @IsOptional()
  @IsEnum(VehicleType)
  public readonly type?: VehicleType;

  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly pricePerDay?: number;

  @IsOptional()
  @IsString()
  public readonly imageUrl?: string;

  @IsOptional()
  @IsEnum(VehicleStatus)
  public readonly status?: VehicleStatus;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  public readonly location?: string;

  @IsOptional()
  @IsIn(['Automatic', 'Manual'])
  public readonly transmission?: 'Automatic' | 'Manual';

  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly seats?: number;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  public readonly fuelType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  public readonly licensePlate?: string;

  @IsOptional()
  @IsString()
  public readonly description?: string;

  @IsOptional()
  @IsString()
  public readonly rentedUntil?: string;
}
