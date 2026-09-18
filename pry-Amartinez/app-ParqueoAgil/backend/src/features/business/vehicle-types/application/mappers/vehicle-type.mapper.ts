import { VehicleType } from '../../domain/entities/vehicle-type.entity.js';
import { CreateVehicleTypeDto } from '../dto/create-vehicle-type.dto.js';

export class VehicleTypeMapper {
  static toEntity(dto: CreateVehicleTypeDto): VehicleType {
    return new VehicleType({
      name: dto.name,
      hourlyRate: dto.hourlyRate,
      description: dto.description ?? null,
      status: 'active',
    });
  }

  static toResponse(vt: VehicleType) {
    return {
      id: vt.id,
      name: vt.name,
      hourlyRate: vt.hourlyRate,
      description: vt.description,
      status: vt.status,
    };
  }
}
