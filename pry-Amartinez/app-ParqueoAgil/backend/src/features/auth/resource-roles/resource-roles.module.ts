import { Module } from '@nestjs/common';
import { RESOURCE_ROLE_REPOSITORY } from './domain/interfaces/resource-role.repository.js';
import { ResourceRoleRepository } from './infrastructure/persistence/repositories/resource-role.repository.js';
import { ResourceRolesSeeder } from './infrastructure/persistence/seeders/resource-roles.seeder.js';
import { ResourceRolesService } from './application/use-cases/resource-roles.service.js';
import { ResourceRolesController } from './presentation/http/controllers/resource-roles.controller.js';
import { RolesModule } from '../roles/roles.module.js';
import { ResourcesModule } from '../resources/resources.module.js';

/**
 * ResourceRolesModule — feature ResourceRoles completo.
 *
 * Importa RolesModule y ResourcesModule para poder inyectar ROLE_REPOSITORY y
 * RESOURCE_REPOSITORY en el service y el seeder.
 */
@Module({
  imports: [RolesModule, ResourcesModule],
  controllers: [ResourceRolesController],
  providers: [
    ResourceRolesService,
    ResourceRolesSeeder,
    { provide: RESOURCE_ROLE_REPOSITORY, useClass: ResourceRoleRepository },
  ],
  exports: [RESOURCE_ROLE_REPOSITORY, ResourceRolesService, ResourceRolesSeeder],
})
export class ResourceRolesModule {}
