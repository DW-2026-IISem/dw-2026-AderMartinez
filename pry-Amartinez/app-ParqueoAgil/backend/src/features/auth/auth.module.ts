import { Module } from '@nestjs/common';

/**
 * AuthModule — agrupa todo lo relacionado con autenticación y autorización.
 *
 * Estado en ISS-09: solo declara el módulo. Las asociaciones RBAC se registran
 * desde `sequelize.factory.ts` (después de crear la instancia Sequelize), NO
 * desde aquí: Sequelize exige que los modelos ya estén registrados antes de
 * declarar `belongsTo` / `hasMany`.
 *
 * Los servicios (JwtService, PassportModule, etc.), los providers (repositorios,
 * use-cases) y los controllers (login, refresh, logout) llegan en ISS-10 a ISS-15.
 */
@Module({})
export class AuthModule {}
