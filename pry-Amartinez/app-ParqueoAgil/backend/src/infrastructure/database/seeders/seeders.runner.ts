import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientSeeder } from '../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { VehicleTypeSeeder } from '../../../features/business/vehicle-types/infrastructure/persistence/seeders/vehicle-type.seeder.js';
import { ParkingZoneSeeder } from '../../../features/business/parking-zones/infrastructure/persistence/seeders/parking-zone.seeder.js';
import { UsersSeeder } from '../../../features/auth/users/infrastructure/persistence/seeders/users.seeder.js';

/**
 * Orquestador de seeders. Se ejecuta tras el bootstrap de Nest.
 *
 * Orden de ejecución:
 *   - Business: clients → vehicle-types → parking-zones
 *   - Auth:     users
 *
 * Todos los seeders son idempotentes: reejecutarlos no duplica datos.
 */
@Injectable()
export class SeedersRunner implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedersRunner.name);

  constructor(
    private readonly clientSeeder: ClientSeeder,
    private readonly vehicleTypeSeeder: VehicleTypeSeeder,
    private readonly parkingZoneSeeder: ParkingZoneSeeder,
    private readonly usersSeeder: UsersSeeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(
      'Ejecutando seeders (idempotentes) en orden: clients → vehicle-types → parking-zones → users',
    );

    // ── Business ─────────────────────────────
    await this.clientSeeder.seed();
    await this.vehicleTypeSeeder.seed();
    await this.parkingZoneSeeder.seed();

    // ── Auth ─────────────────────────────────
    await this.usersSeeder.seed();

    this.logger.log('Seeders ejecutados correctamente');
  }
}
