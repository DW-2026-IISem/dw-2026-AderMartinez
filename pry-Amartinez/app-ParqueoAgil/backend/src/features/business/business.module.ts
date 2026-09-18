import { Module } from '@nestjs/common';
import { ClientsModule } from './clients/clients.module.js';
import { VehicleTypesModule } from './vehicle-types/vehicle-types.module.js';
import { ParkingZonesModule } from './parking-zones/parking-zones.module.js';
import { TicketsModule } from './tickets/tickets.module.js';

@Module({
  imports: [ClientsModule, VehicleTypesModule, ParkingZonesModule, TicketsModule],
  exports: [ClientsModule, VehicleTypesModule, ParkingZonesModule, TicketsModule],
})
export class BusinessModule {}
