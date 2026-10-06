import { Module } from '@nestjs/common';
import { USER_REPOSITORY } from './domain/interfaces/user.repository.js';
import { UserRepository } from './infrastructure/persistence/repositories/user.repository.js';
import { UsersSeeder } from './infrastructure/persistence/seeders/users.seeder.js';
import { UsersService } from './application/use-cases/users.service.js';
import { UsersController } from './presentation/http/controllers/users.controller.js';

/**
 * UsersModule — feature Users completo.
 *
 * Registra:
 *  - Controller: UsersController (rutas /api/usuarios/*).
 *  - Service: UsersService (reglas de negocio).
 *  - Repository: UserRepository ligado al token USER_REPOSITORY (DI).
 *  - Seeder: UsersSeeder (admin + seller).
 *
 * Exporta USER_REPOSITORY y UsersSeeder para que otros módulos puedan inyectarlos.
 *
 * Nota ISS-13: los guards de autenticación/autorización se añadirán al
 * controller cuando existan (por ahora las rutas están abiertas).
 */
@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    UsersSeeder,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [USER_REPOSITORY, UsersSeeder],
})
export class UsersModule {}
