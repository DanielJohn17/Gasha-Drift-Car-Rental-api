import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { UserRole } from '../enums/user-role.enum';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column({ type: 'enum', enum: UserRole })
  public role!: UserRole;

  @Column({ type: 'varchar', length: 120 })
  public name!: string;

  @Column({ type: 'varchar', length: 160, unique: true })
  public email!: string;

  @Column({ type: 'varchar', length: 30 })
  public phone!: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  public address!: string | null;

  @Column({ type: 'varchar', length: 255 })
  public passwordHash!: string;

  @Column({ type: 'text', nullable: true })
  public kebeleIdPhotoUrl!: string | null;

  @Column({ type: 'varchar', length: 80, nullable: true })
  public licenseNumber!: string | null;

  @CreateDateColumn({ type: 'timestamptz' })
  public createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  public updatedAt!: Date;
}
