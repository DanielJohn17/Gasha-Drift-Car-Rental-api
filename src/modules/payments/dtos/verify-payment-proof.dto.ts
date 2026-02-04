import { IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PaymentProofStatus } from '../enums/payment-proof-status.enum';

export class VerifyPaymentProofDto {
  @ApiProperty({ enum: [PaymentProofStatus.Verified, PaymentProofStatus.Rejected] })
  @IsIn([PaymentProofStatus.Verified, PaymentProofStatus.Rejected])
  public readonly status!: PaymentProofStatus.Verified | PaymentProofStatus.Rejected;
}
