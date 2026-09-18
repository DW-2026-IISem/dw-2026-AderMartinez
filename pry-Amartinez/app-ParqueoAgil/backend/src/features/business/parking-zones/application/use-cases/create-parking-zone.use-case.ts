import { Inject, Injectable } from '@nestjs/common';
import { VEHICLE_TYPE_REPOSITORY } from '../../../vehicle-types/domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../../vehicle-types/domain/interfaces/vehicle-type.repository.js';
import { VehicleTypeNotFoundException } from '../../../vehicle-types/domain/exceptions/vehicle-type-not-found.exception.js';
import { VehicleTypeInactiveException } from '../../domain/exceptions/vehicle-type-inactive.exception.js';
import { PARKING_ZONE_REPOSITORY } from '../../domain/interfaces/parking-zone.repository.js';
import type { IParkingZoneRepository } from '../../domain/interfaces/parking-zone.repository.js';
import type { ParkingZone } from '../../domain/entities/parking-zone.entity.js';
import { CreateParkingZoneDto } from '../dto/create-parking-zone.dto.js';
import { ParkingZoneMapper } from '../mappers/parking-zone.mapper.js';

@Injectable()
export class CreateParkingZoneUseCase {
  constructor(
    @Inject(PARKING_ZONE_REPOSITORY) private readonly zoneRepo: IParkingZoneRepository,
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly typeRepo: IVehicleTypeRepository,
  ) {}

  async execute(dto: CreateParkingZoneDto): Promise<ParkingZone> {
    const type = await this.typeRepo.findById(dto.vehicleTypeId);
    if (!type) {
      throw new VehicleTypeNotFoundException(dto.vehicleTypeId);
    }
    if (type.status !== 'active') {
      throw new VehicleTypeInactiveException(dto.vehicleTypeId);
    }
    return this.zoneRepo.create(ParkingZoneMapper.toEntity(dto));
  }
}
