import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class NoAvailableSpotsException extends BusinessRuleException {
  constructor(zoneId: number | null, available: number, requested: number) {
    super(
      `Sin cupos disponibles en la zona ${zoneId ?? '(nueva)'}: disponibles ${available}, solicitados ${requested}`,
    );
  }
}
