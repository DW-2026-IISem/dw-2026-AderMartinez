import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class TicketAlreadyClosedException extends BusinessRuleException {
  constructor(id: number) {
    super(`El ticket ${id} ya está cerrado`);
  }
}
