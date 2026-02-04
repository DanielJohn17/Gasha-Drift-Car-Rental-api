import { IsIn } from 'class-validator';
import { PaymentProofStatus } from '../enums/payment-proof-status.enum';

export class VerifyPaymentProofDto {
  @IsIn([PaymentProofStatus.Verified, PaymentProofStatus.Rejected])
  public readonly status!: PaymentProofStatus.Verified | PaymentProofStatus.Rejected;
}
