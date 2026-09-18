import { EntityNotFoundException } from '../../../../../common/exceptions/entity-not-found.exception.js';

export class TicketNotFoundException extends EntityNotFoundException {
  constructor(id: number) {
    super(`Ticket con id ${id} no encontrado`);
  }
}
