import { Inject, Injectable, Logger } from '@nestjs/common';
import { VEHICLE_TYPE_REPOSITORY } from '../../../../vehicle-types/domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../../../vehicle-types/domain/interfaces/vehicle-type.repository.js';
import { ParkingZone } from '../../../domain/entities/parking-zone.entity.js';
import { PARKING_ZONE_REPOSITORY } from '../../../domain/interfaces/parking-zone.repository.js';
import type { IParkingZoneRepository } from '../../../domain/interfaces/parking-zone.repository.js';

@Injectable()
export class ParkingZoneSeeder {
  private readonly logger = new Logger(ParkingZoneSeeder.name);

  constructor(
    @Inject(PARKING_ZONE_REPOSITORY) private readonly zoneRepo: IParkingZoneRepository,
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly typeRepo: IVehicleTypeRepository,
  ) {}

  async seed(): Promise<void> {
    const { items: types } = await this.typeRepo.findAll(1, 100);
    const autoType = types.find((t) => t.name === 'Automóvil' && t.status === 'active');
    if (!autoType || autoType.id === null) {
      this.logger.warn('Seeder parking-zones: sin tipo de vehículo activo; no se siembra');
      return;
    }
    const { items: zones } = await this.zoneRepo.findAll(1, 100);
    if (zones.some((z) => z.name === 'Zona A - Piso 1')) {
      this.logger.log('Seeder parking-zones: ya existía la zona demo (idempotente)');
      return;
    }
    await this.zoneRepo.create(
      new ParkingZone({
        name: 'Zona A - Piso 1',
        vehicleTypeId: autoType.id,
        capacity: 20,
        availableSpots: 20,
        hourlyRate: 3000,
        status: 'active',
      }),
    );
    this.logger.log('Seeder parking-zones: zona demo creada');
  }
}
