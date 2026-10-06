import { Module } from '@nestjs/common';
import { ROLE_REPOSITORY } from './domain/interfaces/role.repository.js';
import { RoleRepository } from './infrastructure/persistence/repositories/role.repository.js';
import { RolesSeeder } from './infrastructure/persistence/seeders/roles.seeder.js';
import { RolesService } from './application/use-cases/roles.service.js';
import { RolesController } from './presentation/http/controllers/roles.controller.js';

/**
 * RolesModule — feature Roles completo.
 *
 * Registra controller, service, seeder y liga el token ROLE_REPOSITORY al
 * RoleRepository (DI).
 *
 * Nota ISS-13: los guards de autenticación/autorización se añadirán al
 * controller cuando existan (por ahora las rutas están abiertas).
 */
@Module({
  controllers: [RolesController],
  providers: [
    RolesService,
    RolesSeeder,
    { provide: ROLE_REPOSITORY, useClass: RoleRepository },
  ],
  exports: [ROLE_REPOSITORY, RolesSeeder],
})
export class RolesModule {}
