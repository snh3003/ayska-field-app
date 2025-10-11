import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/validation';

export class RequiredValidator implements IValidationStrategy {
  private message: string;

  constructor(message: string = 'This field is required') {
    this.message = message;
  }

  validate(value: any): ValidationResult {
    if (!value || value.toString().trim() === '') {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}
