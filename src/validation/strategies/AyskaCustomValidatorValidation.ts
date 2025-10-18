import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/AyskaValidationInterface';

export class CustomValidator implements IValidationStrategy {
  private validator: (_value: any) => boolean;
  private message: string;

  constructor(
    validator: (_value: any) => boolean,
    message: string = 'Invalid value'
  ) {
    this.validator = validator;
    this.message = message;
  }

  validate(_value: any): ValidationResult {
    if (_value && !this.validator(_value)) {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}
