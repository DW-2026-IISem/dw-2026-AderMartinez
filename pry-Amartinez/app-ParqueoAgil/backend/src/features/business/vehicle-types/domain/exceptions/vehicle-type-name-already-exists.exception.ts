import { BusinessRuleException } from '../../../../../common/exceptions/business-rule.exception.js';

export class VehicleTypeNameAlreadyExistsException extends BusinessRuleException {
  constructor(name: string) {
    super(`Ya existe un tipo de vehículo con el nombre ${name}`);
  }
}
