import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VehicleEntity } from './entities/vehicle.entity';
import { CreateVehicleDto } from './dtos/create-vehicle.dto';
import { UpdateVehicleDto } from './dtos/update-vehicle.dto';
import { ReservationEntity } from '@/modules/reservations/entities/reservation.entity';
import { ReservationStatus } from '@/modules/reservations/enums/reservation-status.enum';
import { VehicleStatus } from './enums/vehicle-status.enum';

@Injectable()
export class VehiclesService {
  public constructor(@InjectRepository(VehicleEntity) private readonly vehiclesRepository: Repository<VehicleEntity>) {}

  public async createVehicle(input: CreateVehicleDto): Promise<VehicleEntity> {
    const existing: VehicleEntity | null = await this.vehiclesRepository.findOne({
      where: { licensePlate: input.licensePlate },
    });
    if (existing) {
      throw new ConflictException('License plate already exists.');
    }
    const vehicle: VehicleEntity = this.vehiclesRepository.create({
      ...input,
      description: input.description ?? null,
      rentedUntil: input.rentedUntil ?? null,
    });
    return this.vehiclesRepository.save(vehicle);
  }

  public async getVehicleById(vehicleId: string): Promise<VehicleEntity> {
    const vehicle: VehicleEntity | null = await this.vehiclesRepository.findOne({ where: { id: vehicleId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }
    return vehicle;
  }

  public async updateVehicle(vehicleId: string, input: UpdateVehicleDto): Promise<VehicleEntity> {
    const vehicle: VehicleEntity = await this.getVehicleById(vehicleId);
    if (input.licensePlate && input.licensePlate !== vehicle.licensePlate) {
      const existing: VehicleEntity | null = await this.vehiclesRepository.findOne({
        where: { licensePlate: input.licensePlate },
      });
      if (existing) {
        throw new ConflictException('License plate already exists.');
      }
    }
    const updated: VehicleEntity = this.vehiclesRepository.merge(vehicle, {
      ...input,
      description: input.description ?? vehicle.description,
      rentedUntil: input.rentedUntil ?? vehicle.rentedUntil,
    });
    return this.vehiclesRepository.save(updated);
  }

  public async deleteVehicle(vehicleId: string): Promise<void> {
    const vehicle: VehicleEntity = await this.getVehicleById(vehicleId);
    await this.vehiclesRepository.remove(vehicle);
  }

  public async listVehicles(input: {
    readonly location?: string;
    readonly type?: string;
    readonly status?: string;
    readonly startDate?: string;
    readonly endDate?: string;
  }): Promise<VehicleEntity[]> {
    if (input.startDate && input.endDate) {
      return this.listAvailableVehicles({
        location: input.location,
        type: input.type,
        status: input.status,
        startDate: input.startDate,
        endDate: input.endDate,
      });
    }
    const query = this.vehiclesRepository.createQueryBuilder('vehicle');
    if (input.location) {
      query.andWhere('vehicle.location = :location', { location: input.location });
    }
    if (input.type) {
      query.andWhere('vehicle.type = :type', { type: input.type });
    }
    if (input.status) {
      query.andWhere('vehicle.status = :status', { status: input.status });
    }
    return query.orderBy('vehicle.createdAt', 'DESC').getMany();
  }

  private async listAvailableVehicles(input: {
    readonly location?: string;
    readonly type?: string;
    readonly status?: string;
    readonly startDate: string;
    readonly endDate: string;
  }): Promise<VehicleEntity[]> {
    const query = this.vehiclesRepository.createQueryBuilder('vehicle');
    if (input.location) {
      query.andWhere('vehicle.location = :location', { location: input.location });
    }
    if (input.type) {
      query.andWhere('vehicle.type = :type', { type: input.type });
    }
    if (input.status) {
      query.andWhere('vehicle.status = :status', { status: input.status });
    } else {
      query.andWhere('vehicle.status IN (:...statuses)', {
        statuses: [VehicleStatus.Available, VehicleStatus.Reserved],
      });
    }
    query.andWhere(qb => {
      const subQuery = qb
        .subQuery()
        .select('1')
        .from(ReservationEntity, 'reservation')
        .where('reservation.vehicleId = vehicle.id')
        .andWhere('reservation.status != :cancelled', { cancelled: ReservationStatus.Cancelled })
        .andWhere(':startDate < reservation.endDate AND :endDate > reservation.startDate', {
          startDate: input.startDate,
          endDate: input.endDate,
        })
        .getQuery();
      return `NOT EXISTS (${subQuery})`;
    });
    return query.orderBy('vehicle.createdAt', 'DESC').getMany();
  }
}
