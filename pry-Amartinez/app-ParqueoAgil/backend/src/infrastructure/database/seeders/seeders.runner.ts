import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientSeeder } from '../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { VehicleTypeSeeder } from '../../../features/business/vehicle-types/infrastructure/persistence/seeders/vehicle-type.seeder.js';
import { ParkingZoneSeeder } from '../../../features/business/parking-zones/infrastructure/persistence/seeders/parking-zone.seeder.js';
import { UsersSeeder } from '../../../features/auth/users/infrastructure/persistence/seeders/users.seeder.js';
import { RolesSeeder } from '../../../features/auth/roles/infrastructure/persistence/seeders/roles.seeder.js';
import { ResourcesSeeder } from '../../../features/auth/resources/infrastructure/persistence/seeders/resources.seeder.js';

/**
 * Orquestador de seeders. Se ejecuta tras el bootstrap de Nest.
 *
 * Orden de ejecución:
 *   - Business: clients → vehicle-types → parking-zones
 *   - Auth:     users → roles → resources
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
    private readonly rolesSeeder: RolesSeeder,
    private readonly resourcesSeeder: ResourcesSeeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(
      'Ejecutando seeders (idempotentes) en orden: clients → vehicle-types → parking-zones → users → roles → resources',
    );

    // ── Business ─────────────────────────────
    await this.clientSeeder.seed();
    await this.vehicleTypeSeeder.seed();
    await this.parkingZoneSeeder.seed();

    // ── Auth ─────────────────────────────────
    await this.usersSeeder.seed();
    await this.rolesSeeder.seed();
    await this.resourcesSeeder.seed();

    this.logger.log('Seeders ejecutados correctamente');
  }
}
