import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { PaymentProofStatus } from '../enums/payment-proof-status.enum';

@Entity({ name: 'payment_proofs' })
export class PaymentProofEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Index({ unique: true })
  @Column({ type: 'uuid' })
  public reservationId!: string;

  @Column({ type: 'varchar', length: 120 })
  public transactionId!: string;

  @Column({ type: 'text' })
  public screenshotUrl!: string;

  @Column({ type: 'enum', enum: PaymentProofStatus })
  public status!: PaymentProofStatus;

  @Column({ type: 'uuid', nullable: true })
  public reviewedByAdminId!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;
}
