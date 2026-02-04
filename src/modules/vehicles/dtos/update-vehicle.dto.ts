import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

export class UpdateVehicleDto {
  @ApiPropertyOptional({ example: 'Toyota' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  public readonly make?: string;

  @ApiPropertyOptional({ example: 'Corolla' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  public readonly model?: string;

  @ApiPropertyOptional({ example: 2022 })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2100)
  public readonly year?: number;

  @ApiPropertyOptional({ enum: VehicleType, example: VehicleType.Sedan })
  @IsOptional()
  @IsEnum(VehicleType)
  public readonly type?: VehicleType;

  @ApiPropertyOptional({ example: 2500 })
  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly pricePerDay?: number;

  @ApiPropertyOptional({ example: 'https://cdn.example.com/vehicles/1.jpg' })
  @IsOptional()
  @IsString()
  public readonly imageUrl?: string;

  @ApiPropertyOptional({ enum: VehicleStatus, example: VehicleStatus.Available })
  @IsOptional()
  @IsEnum(VehicleStatus)
  public readonly status?: VehicleStatus;

  @ApiPropertyOptional({ example: 'Addis Ababa' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  public readonly location?: string;

  @ApiPropertyOptional({ enum: ['Automatic', 'Manual'], example: 'Automatic' })
  @IsOptional()
  @IsIn(['Automatic', 'Manual'])
  public readonly transmission?: 'Automatic' | 'Manual';

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  public readonly seats?: number;

  @ApiPropertyOptional({ example: 'Petrol' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  public readonly fuelType?: string;

  @ApiPropertyOptional({ example: 'AA-12345' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  public readonly licensePlate?: string;

  @ApiPropertyOptional({ example: 'Well maintained vehicle.' })
  @IsOptional()
  @IsString()
  public readonly description?: string;

  @ApiPropertyOptional({ description: 'ISO date string', example: '2026-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  public readonly rentedUntil?: string;
}
