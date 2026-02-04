import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

export class CreateVehicleDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @MaxLength(80)
  public readonly make!: string;

  @ApiProperty({ example: 'Corolla' })
  @IsString()
  @MaxLength(80)
  public readonly model!: string;

  @ApiProperty({ example: 2022 })
  @IsInt()
  @Min(1900)
  @Max(2100)
  public readonly year!: number;

  @ApiProperty({ enum: VehicleType, example: VehicleType.Sedan })
  @IsEnum(VehicleType)
  public readonly type!: VehicleType;

  @ApiProperty({ example: 2500 })
  @IsInt()
  @Min(1)
  public readonly pricePerDay!: number;

  @ApiProperty({ example: 'https://cdn.example.com/vehicles/1.jpg' })
  @IsString()
  public readonly imageUrl!: string;

  @ApiProperty({ enum: VehicleStatus, example: VehicleStatus.Available })
  @IsEnum(VehicleStatus)
  public readonly status!: VehicleStatus;

  @ApiProperty({ example: 'Addis Ababa' })
  @IsString()
  @MaxLength(120)
  public readonly location!: string;

  @ApiProperty({ enum: ['Automatic', 'Manual'], example: 'Automatic' })
  @IsIn(['Automatic', 'Manual'])
  public readonly transmission!: 'Automatic' | 'Manual';

  @ApiProperty({ example: 5 })
  @IsInt()
  @Min(1)
  public readonly seats!: number;

  @ApiProperty({ example: 'Petrol' })
  @IsString()
  @MaxLength(40)
  public readonly fuelType!: string;

  @ApiProperty({ example: 'AA-12345' })
  @IsString()
  @MaxLength(40)
  public readonly licensePlate!: string;

  @ApiPropertyOptional({ example: 'Well maintained vehicle.' })
  @IsOptional()
  @IsString()
  public readonly description?: string;

  @ApiPropertyOptional({ description: 'ISO date string', example: '2026-01-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  public readonly rentedUntil?: string;
}
