import { Module } from '@nestjs/common';
import { RESOURCE_REPOSITORY } from './domain/interfaces/resource.repository.js';
import { ResourceRepository } from './infrastructure/persistence/repositories/resource.repository.js';
import { ResourcesSeeder } from './infrastructure/persistence/seeders/resources.seeder.js';
import { ResourcesService } from './application/use-cases/resources.service.js';
import { ResourcesController } from './presentation/http/controllers/resources.controller.js';

/**
 * ResourcesModule — feature Resources completo.
 *
 * Nota ISS-13: los guards de autenticación/autorización se añadirán al
 * controller cuando existan (por ahora las rutas están abiertas).
 */
@Module({
  controllers: [ResourcesController],
  providers: [
    ResourcesService,
    ResourcesSeeder,
    { provide: RESOURCE_REPOSITORY, useClass: ResourceRepository },
  ],
  exports: [RESOURCE_REPOSITORY, ResourcesSeeder],
})
export class ResourcesModule {}
