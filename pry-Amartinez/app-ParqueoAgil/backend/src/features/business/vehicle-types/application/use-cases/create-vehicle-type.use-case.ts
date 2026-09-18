import { Inject, Injectable } from '@nestjs/common';
import { VehicleTypeNameAlreadyExistsException } from '../../domain/exceptions/vehicle-type-name-already-exists.exception.js';
import { VEHICLE_TYPE_REPOSITORY } from '../../domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../domain/interfaces/vehicle-type.repository.js';
import type { VehicleType } from '../../domain/entities/vehicle-type.entity.js';
import { CreateVehicleTypeDto } from '../dto/create-vehicle-type.dto.js';
import { VehicleTypeMapper } from '../mappers/vehicle-type.mapper.js';

@Injectable()
export class CreateVehicleTypeUseCase {
  constructor(
    @Inject(VEHICLE_TYPE_REPOSITORY) private readonly repo: IVehicleTypeRepository,
  ) {}

  async execute(dto: CreateVehicleTypeDto): Promise<VehicleType> {
    const existing = await this.repo.findByName(dto.name);
    if (existing) {
      throw new VehicleTypeNameAlreadyExistsException(dto.name);
    }
    return this.repo.create(VehicleTypeMapper.toEntity(dto));
  }
}
