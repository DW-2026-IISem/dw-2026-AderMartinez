import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class VehicleTypeInactiveException extends BusinessRuleException {
  constructor(typeId: number) {
    super(`El tipo de vehículo con id ${typeId} está inactivo`);
  }
}
