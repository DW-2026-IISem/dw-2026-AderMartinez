import { Inject, Injectable } from '@nestjs/common';
import { VEHICLE_TYPE_REPOSITORY } from '../../domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../domain/interfaces/vehicle-type.repository.js';
import { VehicleTypeMapper } from '../mappers/vehicle-type.mapper.js';

@Injectable()
export class ListVehicleTypesUseCase {
  constructor(
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly repo: IVehicleTypeRepository,
  ) {}

  async execute(page: number, limit: number) {
    const { items, total } = await this.repo.findAll(page, limit);
    return {
      items: items.map(VehicleTypeMapper.toResponse),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }
}
