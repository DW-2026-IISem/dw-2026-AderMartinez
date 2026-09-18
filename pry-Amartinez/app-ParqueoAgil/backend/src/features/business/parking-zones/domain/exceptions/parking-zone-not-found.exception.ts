import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class ParkingZoneNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Zona de parqueo con id ${id} no encontrada`);
  }
}
