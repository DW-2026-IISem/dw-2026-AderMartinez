import { Inject, Injectable } from '@nestjs/common';
import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';
import { VEHICLE_TYPE_REPOSITORY } from '../../domain/interfaces/vehicle-type.repository.js';
import type { IVehicleTypeRepository } from '../../domain/interfaces/vehicle-type.repository.js';

@Injectable()
export class DeactivateVehicleTypeUseCase {
  constructor(
    @Inject(VEHICLE_TYPE_REPOSITORY)
    private readonly repository: IVehicleTypeRepository,
  ) {}

  async execute(id: number) {
    const vt = await this.repository.findById(id);
    if (!vt) {
      throw new EntityNotFoundException('Tipo de vehículo no encontrado');
    }
    
    // Actualizamos el estado a inactivo
    const updated = await this.repository.update(id, { status: 'inactive' });
    
    // Verificamos que no sea null antes de acceder a sus propiedades
    if (!updated) {
      throw new EntityNotFoundException('Error al desactivar el tipo de vehículo');
    }

    return { message: 'Tipo de vehículo desactivado', id: updated.id };
  }
}