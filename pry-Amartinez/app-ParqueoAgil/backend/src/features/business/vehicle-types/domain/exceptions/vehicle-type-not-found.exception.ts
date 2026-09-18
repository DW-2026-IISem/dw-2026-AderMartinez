import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class VehicleTypeNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Tipo de vehículo con id ${id} no encontrado`);
  }
}
