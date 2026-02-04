import { SetMetadata } from '@nestjs/common';
import { UserRole } from '@/modules/users/enums/user-role.enum';
import { rolesMetadataKey } from '../constants/roles-metadata-key.constant';

export const Roles = (...roles: UserRole[]): ReturnType<typeof SetMetadata> => SetMetadata(rolesMetadataKey, roles);
