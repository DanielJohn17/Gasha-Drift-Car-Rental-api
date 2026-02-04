import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReservationEntity } from './entities/reservation.entity';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';
import { VehicleEntity } from '@/modules/vehicles/entities/vehicle.entity';
import { PaymentProofEntity } from '@/modules/payments/entities/payment-proof.entity';
import { UserEntity } from '@/modules/users/entities/user.entity';
import { StorageModule } from '@/shared/storage/storage.module';
import { AuthModule } from '@/modules/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ReservationEntity, VehicleEntity, PaymentProofEntity, UserEntity]),
    StorageModule,
    AuthModule,
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService, TypeOrmModule],
})
export class ReservationsModule {}
