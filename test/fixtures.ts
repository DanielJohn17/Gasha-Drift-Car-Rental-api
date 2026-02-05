import { UserRole } from '../src/modules/users/enums/user-role.enum';
import { UserEntity } from '../src/modules/users/entities/user.entity';
import { VehicleStatus } from '../src/modules/vehicles/enums/vehicle-status.enum';
import { VehicleType } from '../src/modules/vehicles/enums/vehicle-type.enum';
import { VehicleEntity } from '../src/modules/vehicles/entities/vehicle.entity';
import { ReservationStatus } from '../src/modules/reservations/enums/reservation-status.enum';
import { ReservationEntity } from '../src/modules/reservations/entities/reservation.entity';
import { PaymentProofStatus } from '../src/modules/payments/enums/payment-proof-status.enum';
import { PaymentProofEntity } from '../src/modules/payments/entities/payment-proof.entity';

export const mockUser: UserEntity = {
  id: 'user-123',
  role: UserRole.Customer,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+251900000001',
  address: '123 Main St',
  passwordHash: '$2b$10$hashedpassword',
  kebeleIdPhotoUrl: 'http://example.com/kebele.jpg',
  licenseNumber: 'DL123456',
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockAdmin: UserEntity = {
  ...mockUser,
  id: 'admin-123',
  role: UserRole.Admin,
  email: 'admin@example.com',
  name: 'Admin User',
};

export const mockVehicle: VehicleEntity = {
  id: 'vehicle-123',
  make: 'Toyota',
  model: 'Camry',
  year: 2023,
  type: VehicleType.Sedan,
  pricePerDay: 1500,
  imageUrl: 'http://example.com/car.jpg',
  status: VehicleStatus.Available,
  location: 'Addis Ababa',
  transmission: 'Automatic',
  seats: 5,
  fuelType: 'Petrol',
  licensePlate: 'A12345',
  description: 'A comfortable sedan',
  rentedUntil: null,
  createdAt: new Date('2024-01-01'),
  updatedAt: new Date('2024-01-01'),
};

export const mockReservation: ReservationEntity = {
  id: 'reservation-123',
  vehicleId: mockVehicle.id,
  customerUserId: mockUser.id,
  startDate: '2024-02-01',
  endDate: '2024-02-05',
  pickupLocation: 'Addis Ababa Airport',
  licenseNumberSnapshot: 'DL123456',
  totalDays: 5,
  pricePerDaySnapshot: 1500,
  totalPrice: 7500,
  status: ReservationStatus.Pending,
  vehicle: mockVehicle,
  customer: mockUser,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};

export const mockPaymentProof: PaymentProofEntity = {
  id: 'payment-123',
  reservationId: mockReservation.id,
  transactionId: 'TXN123456',
  screenshotUrl: 'http://example.com/payment.jpg',
  status: PaymentProofStatus.Submitted,
  reviewedByAdminId: null,
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-01-15'),
};
