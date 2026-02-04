import { UserRole } from '@/modules/users/enums/user-role.enum';

export interface AuthTokenResponse {
  readonly accessToken: string;
  readonly user: {
    readonly id: string;
    readonly role: UserRole;
    readonly name: string;
    readonly email: string;
    readonly phone: string;
    readonly address: string | null;
    readonly kebeleIdPhotoUrl: string | null;
    readonly licenseNumber: string | null;
  };
}
