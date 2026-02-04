import { ReservationStatus } from '../enums/reservation-status.enum';

export interface ReservationListResponse {
  readonly id: string;
  readonly vehicleId: string;
  readonly customerUserId: string;
  readonly startDate: string;
  readonly endDate: string;
  readonly pickupLocation: string;
  readonly licenseNumberSnapshot: string;
  readonly totalDays: number;
  readonly pricePerDaySnapshot: number;
  readonly totalPrice: number;
  readonly status: ReservationStatus;
  readonly createdAt: Date;
}
