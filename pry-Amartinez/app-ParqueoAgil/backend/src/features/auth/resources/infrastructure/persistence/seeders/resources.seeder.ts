import { Inject, Injectable, Logger } from '@nestjs/common';
import { RESOURCE_REPOSITORY } from '../../../domain/interfaces/resource.repository.js';
import type { IResourceRepository } from '../../../domain/interfaces/resource.repository.js';
import { RESOURCE_CATALOG } from '../resource-catalog.js';

/**
 * Seeder del catálogo de recursos.
 *
 * A diferencia de los seeders de business, este **no usa datos aleatorios**:
 * los 58 recursos son un catálogo determinista definido en `resource-catalog.ts`.
 *
 * Es idempotente: `findByOperation` + `create` + reactivación si estaba inactivo.
 * Reejecutarlo reconcilia el catálogo sin duplicar ni perder concesiones.
 */
@Injectable()
export class ResourcesSeeder {
  private readonly logger = new Logger(ResourcesSeeder.name);

  constructor(
    @Inject(RESOURCE_REPOSITORY)
    private readonly repository: IResourceRepository,
  ) {}

  async seed(): Promise<void> {
    let created = 0;
    let reactivated = 0;

    for (const item of RESOURCE_CATALOG) {
      const existing = await this.repository.findByOperation(item.method, item.path);

      if (!existing) {
        await this.repository.create({
          method: item.method,
          path: item.path,
          description: item.description,
          status: 'active',
        });
        created++;
        continue;
      }

      if (existing.status !== 'active') {
        await this.repository.update(existing, { status: 'active' });
        reactivated++;
      }
    }

    this.logger.log(
      `Seeder resources: catálogo reconciliado (${RESOURCE_CATALOG.length} recursos, ${created} creados, ${reactivated} reactivados)`,
    );
  }
}
