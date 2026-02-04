import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { VehicleStatus } from '../enums/vehicle-status.enum';
import { VehicleType } from '../enums/vehicle-type.enum';

@Entity({ name: 'vehicles' })
export class VehicleEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'varchar', length: 80 })
  public make!: string;

  @Column({ type: 'varchar', length: 80 })
  public model!: string;

  @Column({ type: 'int' })
  public year!: number;

  @Column({ type: 'enum', enum: VehicleType })
  public type!: VehicleType;

  @Column({ type: 'int' })
  public pricePerDay!: number;

  @Column({ type: 'text' })
  public imageUrl!: string;

  @Column({ type: 'enum', enum: VehicleStatus })
  public status!: VehicleStatus;

  @Column({ type: 'varchar', length: 120 })
  public location!: string;

  @Column({ type: 'varchar', length: 20 })
  public transmission!: 'Automatic' | 'Manual';

  @Column({ type: 'int' })
  public seats!: number;

  @Column({ type: 'varchar', length: 40 })
  public fuelType!: string;

  @Index({ unique: true })
  @Column({ type: 'varchar', length: 40 })
  public licensePlate!: string;

  @Column({ type: 'text', nullable: true })
  public description!: string | null;

  @Column({ type: 'date', nullable: true })
  public rentedUntil!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;
}
