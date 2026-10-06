import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { ResourcesModule } from './resources/resources.module.js';

/**
 * AuthModule — agrupa todo lo relacionado con autenticación y autorización.
 *
 * Estado en ISS-11: incluye UsersModule, RolesModule y ResourcesModule. En los
 * siguientes ISS se añadirán RoleUsersModule, ResourceRolesModule,
 * RefreshTokensModule, sesión, etc.
 *
 * Las asociaciones RBAC se registran desde `sequelize.factory.ts` (no desde
 * aquí): Sequelize exige que los modelos ya estén registrados antes de
 * declarar `belongsTo` / `hasMany`.
 */
@Module({
  imports: [UsersModule, RolesModule, ResourcesModule],
  exports: [UsersModule, RolesModule, ResourcesModule],
})
export class AuthModule {}
