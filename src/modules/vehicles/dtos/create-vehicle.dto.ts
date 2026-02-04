import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateVehicleDto {
  @IsString()
  @MaxLength(80)
  public readonly make!: string;

  @IsString()
  @MaxLength(80)
  public readonly model!: string;

  @IsInt()
  @Min(1900)
  @Max(2100)
  public readonly year!: number;

  @IsEnum(VehicleType)
  public readonly type!: VehicleType;

  @IsInt()
  @Min(1)
  public readonly pricePerDay!: number;

  @IsString()
  public readonly imageUrl!: string;

  @IsEnum(VehicleStatus)
  public readonly status!: VehicleStatus;

  @IsString()
  @MaxLength(120)
  public readonly location!: string;

  @IsIn(['Automatic', 'Manual'])
  public readonly transmission!: 'Automatic' | 'Manual';

  @IsInt()
  @Min(1)
  public readonly seats!: number;

  @IsString()
  @MaxLength(40)
  public readonly fuelType!: string;

  @IsString()
  @MaxLength(40)
  public readonly licensePlate!: string;

  @IsOptional()
  @IsString()
  public readonly description?: string;

  @IsOptional()
  @IsString()
  public readonly rentedUntil?: string;
}
