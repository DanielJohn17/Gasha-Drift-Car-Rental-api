import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ReservationStatus } from '../enums/reservation-status.enum';
import { VehicleEntity } from '@/modules/vehicles/entities/vehicle.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';

@Entity({ name: 'reservations' })
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Index()
  @Column({ type: 'uuid' })
  public vehicleId!: string;

  @ManyToOne(() => VehicleEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'vehicleId' })
  public vehicle!: VehicleEntity;

  @Index()
  @Column({ type: 'uuid' })
  public customerUserId!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'customerUserId' })
  public customer!: UserEntity;

  @Column({ type: 'date' })
  public startDate!: string;

  @Column({ type: 'date' })
  public endDate!: string;

  @Column({ type: 'varchar', length: 120 })
  public pickupLocation!: string;

  @Column({ type: 'varchar', length: 80 })
  public licenseNumberSnapshot!: string;

  @Column({ type: 'int' })
  public totalDays!: number;

  @Column({ type: 'int' })
  public pricePerDaySnapshot!: number;

  @Column({ type: 'int' })
  public totalPrice!: number;

  @Column({ type: 'enum', enum: ReservationStatus })
  public status!: ReservationStatus;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;
}
