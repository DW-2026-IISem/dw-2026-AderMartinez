import { Module } from '@nestjs/common';
import { CreateVehicleTypeUseCase } from './application/use-cases/create-vehicle-type.use-case.js';
import { GetVehicleTypeByIdUseCase } from './application/use-cases/get-vehicle-type-by-id.use-case.js';
import { ListVehicleTypesUseCase } from './application/use-cases/list-vehicle-types.use-case.js';
import { VEHICLE_TYPE_REPOSITORY } from './domain/interfaces/vehicle-type.repository.js';
import { VehicleTypeRepository } from './infrastructure/persistence/repositories/vehicle-type.repository.js';
import { VehicleTypeSeeder } from './infrastructure/persistence/seeders/vehicle-type.seeder.js';
import { VehicleTypesController } from './presentation/http/controllers/vehicle-types.controller.js';

@Module({
  controllers: [VehicleTypesController],
  providers: [
    CreateVehicleTypeUseCase,
    ListVehicleTypesUseCase,
    GetVehicleTypeByIdUseCase,
    VehicleTypeSeeder,
    { provide: VEHICLE_TYPE_REPOSITORY, useClass: VehicleTypeRepository },
  ],
  exports: [VEHICLE_TYPE_REPOSITORY, VehicleTypeSeeder],
})
export class VehicleTypesModule {}
