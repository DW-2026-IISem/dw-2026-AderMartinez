import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientSeeder } from '../../../features/business/clients/infrastructure/persistence/seeders/client.seeder.js';
import { VehicleTypeSeeder } from '../../../features/business/vehicle-types/infrastructure/persistence/seeders/vehicle-type.seeder.js';
import { ParkingZoneSeeder } from '../../../features/business/parking-zones/infrastructure/persistence/seeders/parking-zone.seeder.js';
import { UsersSeeder } from '../../../features/auth/users/infrastructure/persistence/seeders/users.seeder.js';
import { RolesSeeder } from '../../../features/auth/roles/infrastructure/persistence/seeders/roles.seeder.js';
import { ResourcesSeeder } from '../../../features/auth/resources/infrastructure/persistence/seeders/resources.seeder.js';
import { RoleUsersSeeder } from '../../../features/auth/role-users/infrastructure/persistence/seeders/role-users.seeder.js';
import { ResourceRolesSeeder } from '../../../features/auth/resource-roles/infrastructure/persistence/seeders/resource-roles.seeder.js';

/**
 * Orquestador de seeders. Se ejecuta tras el bootstrap de Nest.
 *
 * Orden de ejecución (el orden importa: cada eslabón depende del anterior):
 *   - Business: clients → vehicle-types → parking-zones
 *   - Auth:     users → roles → resources → role-users → resource-roles
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
    private readonly roleUsersSeeder: RoleUsersSeeder,
    private readonly resourceRolesSeeder: ResourceRolesSeeder,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    this.logger.log(
      'Ejecutando seeders (idempotentes) en orden: clients → vehicle-types → parking-zones → users → roles → resources → role-users → resource-roles',
    );

    // ── Business ─────────────────────────────
    await this.clientSeeder.seed();
    await this.vehicleTypeSeeder.seed();
    await this.parkingZoneSeeder.seed();

    // ── Auth: catálogos ──────────────────────
    await this.usersSeeder.seed();
    await this.rolesSeeder.seed();
    await this.resourcesSeeder.seed();

    // ── Auth: matriz RBAC ────────────────────
    await this.roleUsersSeeder.seed();
    await this.resourceRolesSeeder.seed();

    this.logger.log('Seeders ejecutados correctamente');
  }
}
