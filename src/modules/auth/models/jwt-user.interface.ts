import { UserRole } from '@/modules/users/enums/user-role.enum';

export interface JwtUser {
  readonly userId: string;
  readonly role: UserRole;
}
