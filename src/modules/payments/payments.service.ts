import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentProofEntity } from './entities/payment-proof.entity';
import { PaymentProofStatus } from './enums/payment-proof-status.enum';
import { ReservationEntity } from '@/modules/reservations/entities/reservation.entity';
import { ReservationStatus } from '@/modules/reservations/enums/reservation-status.enum';

@Injectable()
export class PaymentsService {
  public constructor(
    @InjectRepository(PaymentProofEntity) private readonly paymentProofRepository: Repository<PaymentProofEntity>,
    @InjectRepository(ReservationEntity) private readonly reservationsRepository: Repository<ReservationEntity>,
  ) {}

  public async listPaymentProofs(): Promise<PaymentProofEntity[]> {
    return this.paymentProofRepository.find({ order: { createdAt: 'DESC' } });
  }

  public async verifyPaymentProof(
    paymentProofId: string,
    input: { readonly adminUserId: string; readonly status: PaymentProofStatus },
  ): Promise<PaymentProofEntity> {
    const proof: PaymentProofEntity | null = await this.paymentProofRepository.findOne({
      where: { id: paymentProofId },
    });
    if (!proof) {
      throw new NotFoundException('Payment proof not found.');
    }
    proof.status = input.status;
    proof.reviewedByAdminId = input.adminUserId;
    const savedProof: PaymentProofEntity = await this.paymentProofRepository.save(proof);
    const reservation: ReservationEntity | null = await this.reservationsRepository.findOne({
      where: { id: proof.reservationId },
    });
    if (reservation) {
      reservation.status =
        input.status === PaymentProofStatus.Verified ? ReservationStatus.Confirmed : ReservationStatus.Cancelled;
      await this.reservationsRepository.save(reservation);
    }
    return savedProof;
  }
}
