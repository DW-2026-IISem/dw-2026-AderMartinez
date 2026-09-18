import { Inject, Injectable } from '@nestjs/common';
import { PARKING_ZONE_REPOSITORY } from '../../domain/interfaces/parking-zone.repository.js';
import type { IParkingZoneRepository } from '../../domain/interfaces/parking-zone.repository.js';
import { ParkingZoneMapper } from '../mappers/parking-zone.mapper.js';

@Injectable()
export class ListParkingZonesUseCase {
  constructor(
    @Inject(PARKING_ZONE_REPOSITORY) private readonly zoneRepo: IParkingZoneRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.zoneRepo.findAll(page, limit);
    return {
      items: items.map(ParkingZoneMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
