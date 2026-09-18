import { Inject, Injectable } from '@nestjs/common';
import { VehicleTypeNotFoundException } from '../../domain/exceptions/vehicle-type-not-found.exception.js';
import { VEHICLE_TYPE_REPOSITORY } from '../../domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../domain/interfaces/vehicle-type.repository.js';
import type { VehicleType } from '../../domain/entities/vehicle-type.entity.js';

@Injectable()
export class GetVehicleTypeByIdUseCase {
  constructor(
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly repo: IVehicleTypeRepository,
  ) {}

  async execute(id: number): Promise<VehicleType> {
    const vt = await this.repo.findById(id);
    if (!vt) {
      throw new VehicleTypeNotFoundException(id);
    }
    return vt;
  }
}
