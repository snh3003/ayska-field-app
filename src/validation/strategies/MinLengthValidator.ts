import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/validation';

export class MinLengthValidator implements IValidationStrategy {
  private minLength: number;
  private message: string;

  constructor(minLength: number, message?: string) {
    this.minLength = minLength;
    this.message = message || `Must be at least ${minLength} characters`;
  }

  validate(value: any): ValidationResult {
    if (value && value.length < this.minLength) {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}
