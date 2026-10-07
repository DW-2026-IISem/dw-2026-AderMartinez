import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { ResourcesModule } from './resources/resources.module.js';
import { RoleUsersModule } from './role-users/role-users.module.js';
import { ResourceRolesModule } from './resource-roles/resource-roles.module.js';

/**
 * AuthModule — agrupa todo lo relacionado con autenticación y autorización.
 *
 * Estado en ISS-12: incluye UsersModule, RolesModule, ResourcesModule,
 * RoleUsersModule y ResourceRolesModule. La matriz RBAC está completa a nivel
 * de datos; el guard que la consumirá llega en ISS-13.
 */
@Module({
  imports: [
    UsersModule,
    RolesModule,
    ResourcesModule,
    RoleUsersModule,
    ResourceRolesModule,
  ],
  exports: [
    UsersModule,
    RolesModule,
    ResourcesModule,
    RoleUsersModule,
    ResourceRolesModule,
  ],
})
export class AuthModule {}
