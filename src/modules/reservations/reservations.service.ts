import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationStatus } from './enums/reservation-status.enum';
import { CreateReservationDto } from './dtos/create-reservation.dto';
import { VehicleEntity } from '@/modules/vehicles/entities/vehicle.entity';
import { PaymentProofEntity } from '@/modules/payments/entities/payment-proof.entity';
import { PaymentProofStatus } from '@/modules/payments/enums/payment-proof-status.enum';
import { StorageService } from '@/shared/storage/storage.service';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Injectable()
export class ReservationsService {
  public constructor(
    @InjectRepository(ReservationEntity) private readonly reservationsRepository: Repository<ReservationEntity>,
    @InjectRepository(VehicleEntity) private readonly vehiclesRepository: Repository<VehicleEntity>,
    @InjectRepository(PaymentProofEntity) private readonly paymentProofRepository: Repository<PaymentProofEntity>,
    @InjectRepository(UserEntity) private readonly usersRepository: Repository<UserEntity>,
    private readonly storageService: StorageService,
  ) {}

  public async createReservation(customerUserId: string, input: CreateReservationDto): Promise<ReservationEntity> {
    this.validateDateRange(input.startDate, input.endDate);
    const vehicle: VehicleEntity | null = await this.vehiclesRepository.findOne({ where: { id: input.vehicleId } });
    if (!vehicle) {
      throw new NotFoundException('Vehicle not found.');
    }
    const hasOverlap: boolean =
      (await this.reservationsRepository
        .createQueryBuilder('reservation')
        .where('reservation.vehicleId = :vehicleId', { vehicleId: input.vehicleId })
        .andWhere('reservation.status != :cancelled', { cancelled: ReservationStatus.Cancelled })
        .andWhere(':startDate < reservation.endDate AND :endDate > reservation.startDate', {
          startDate: input.startDate,
          endDate: input.endDate,
        })
        .getCount()) > 0;
    if (hasOverlap) {
      throw new ConflictException('Vehicle is not available for the selected dates.');
    }
    const totalDays: number = this.calculateTotalDays(input.startDate, input.endDate);
    const totalPrice: number = totalDays * vehicle.pricePerDay;
    const paymentScreenshotUrl: string = (await this.storageService.uploadBase64Image(input.paymentScreenshotBase64, 'payments/screenshots')).url;
    const reservation: ReservationEntity = this.reservationsRepository.create({
      vehicleId: vehicle.id,
      customerUserId,
      startDate: input.startDate,
      endDate: input.endDate,
      pickupLocation: input.pickupLocation,
      licenseNumberSnapshot: input.licenseNumber,
      totalDays,
      pricePerDaySnapshot: vehicle.pricePerDay,
      totalPrice,
      status: ReservationStatus.Pending,
    });
    const savedReservation: ReservationEntity = await this.reservationsRepository.save(reservation);
    const paymentProof: PaymentProofEntity = this.paymentProofRepository.create({
      reservationId: savedReservation.id,
      transactionId: input.transactionId,
      screenshotUrl: paymentScreenshotUrl,
      status: PaymentProofStatus.Submitted,
      reviewedByAdminId: null,
    });
    await this.paymentProofRepository.save(paymentProof);
    const user: UserEntity | null = await this.usersRepository.findOne({ where: { id: customerUserId } });
    if (user) {
      user.licenseNumber = input.licenseNumber;
      await this.usersRepository.save(user);
    }
    return savedReservation;
  }

  public async listReservations(input: { readonly userId: string; readonly isAdmin: boolean }): Promise<ReservationEntity[]> {
    if (input.isAdmin) {
      return this.reservationsRepository.find({ order: { createdAt: 'DESC' } });
    }
    return this.reservationsRepository.find({ where: { customerUserId: input.userId }, order: { createdAt: 'DESC' } });
  }

  public async getReservationById(reservationId: string): Promise<ReservationEntity> {
    const reservation: ReservationEntity | null = await this.reservationsRepository.findOne({ where: { id: reservationId } });
    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }
    return reservation;
  }

  public async updateReservationStatus(reservationId: string, status: ReservationStatus): Promise<ReservationEntity> {
    const reservation: ReservationEntity = await this.getReservationById(reservationId);
    reservation.status = status;
    return this.reservationsRepository.save(reservation);
  }

  private validateDateRange(startDate: string, endDate: string): void {
    const start: number = new Date(startDate).getTime();
    const end: number = new Date(endDate).getTime();
    if (Number.isNaN(start) || Number.isNaN(end)) {
      throw new BadRequestException('Invalid date range.');
    }
    if (end <= start) {
      throw new BadRequestException('endDate must be after startDate.');
    }
  }

  private calculateTotalDays(startDate: string, endDate: string): number {
    const start: number = new Date(startDate).getTime();
    const end: number = new Date(endDate).getTime();
    const dayMs: number = 1000 * 60 * 60 * 24;
    return Math.max(1, Math.ceil((end - start) / dayMs));
  }
}
