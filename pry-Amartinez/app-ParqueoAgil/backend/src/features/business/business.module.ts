import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module.js';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module.js';
import { ParkingZonesModule } from './parking-zones/parking-zones.module.js';

@Module({
  imports: [ClientsModule, VehicleTypesModule, ParkingZonesModule],
  exports: [ClientsModule, VehicleTypesModule, ParkingZonesModule],
})
export class BusinessModule {}
