import { Inject, Injectable, Logger } from '@nestjs/common';
import { VehicleType } from '../../../domain/entities/vehicle-type.entity.js';
import { VEHICLE_TYPE_REPOSITORY } from '../../../domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../../domain/interfaces/vehicle-type.repository.js';

@Injectable()
export class VehicleTypeSeeder {
  private readonly logger = new Logger(VehicleTypeSeeder.name);

  constructor(
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly repo: IVehicleTypeRepository,
  ) {}

  async seed(): Promise<void> {
    const demo = [
      { name: 'Automóvil', hourlyRate: 3000, description: 'Vehículos livianos de 4 ruedas' },
      { name: 'Motocicleta', hourlyRate: 1500, description: 'Vehículos de 2 ruedas' },
      { name: 'Camioneta', hourlyRate: 5000, description: 'Vehículos utilitarios y camionetas' },
    ];
    for (const d of demo) {
      const existing = await this.repo.findByName(d.name);
      if (existing) {
        this.logger.log(`Seeder vehicle-types: ya existía "${d.name}" (idempotente)`);
        continue;
      }
      await this.repo.create(
        new VehicleType({
          name: d.name,
          hourlyRate: d.hourlyRate,
          description: d.description,
          status: 'active',
        }),
      );
      this.logger.log(`Seeder vehicle-types: "${d.name}" creado`);
    }
  }
}
