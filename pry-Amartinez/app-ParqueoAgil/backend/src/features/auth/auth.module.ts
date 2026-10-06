import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module.js';

/**
 * AuthModule — agrupa todo lo relacionado con autenticación y autorización.
 *
 * Estado en ISS-10: incluye UsersModule (feature Users completo). En los
 * siguientes ISS se añadirán RolesModule, ResourcesModule, RoleUsersModule,
 * ResourceRolesModule, RefreshTokensModule, sesión, etc.
 *
 * Las asociaciones RBAC se registran desde `sequelize.factory.ts` (no desde
 * aquí): Sequelize exige que los modelos ya estén registrados antes de
 * declarar `belongsTo` / `hasMany`.
 */
@Module({
  imports: [UsersModule],
  exports: [UsersModule],
})
export class AuthModule {}
