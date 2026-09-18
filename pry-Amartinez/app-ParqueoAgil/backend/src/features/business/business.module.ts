import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module.js';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module.js';

@Module({
  imports: [ClientsModule, VehicleTypesModule],
  exports: [ClientsModule, VehicleTypesModule],
})
export class BusinessModule {}
