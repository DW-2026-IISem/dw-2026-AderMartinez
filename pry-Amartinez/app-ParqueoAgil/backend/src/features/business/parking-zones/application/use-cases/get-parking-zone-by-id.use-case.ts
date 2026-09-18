import { Inject, Injectable } from '@nestjs/common';
import { ParkingZoneNotFoundException } from '../../domain/exceptions/parking-zone-not-found.exception.js';
import { PARKING_ZONE_REPOSITORY } from '../../domain/interfaces/parking-zone.repository.js';
import type { IParkingZoneRepository } from '../../domain/interfaces/parking-zone.repository.js';
import type { ParkingZone } from '../../domain/entities/parking-zone.entity.js';

@Injectable()
export class GetParkingZoneByIdUseCase {
  constructor(
    @Inject(PARKING_ZONE_REPOSITORY) private readonly zoneRepo: IParkingZoneRepository,
  ) {}

  async execute(id: number): Promise<ParkingZone> {
    const zone = await this.zoneRepo.findById(id);
    if (!zone) {
      throw new ParkingZoneNotFoundException(id);
    }
    return zone;
  }
}
