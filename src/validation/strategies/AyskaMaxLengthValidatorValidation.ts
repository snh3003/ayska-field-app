import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/AyskaValidationInterface';

export class MaxLengthValidator implements IValidationStrategy {
  private maxLength: number;
  private message: string;

  constructor(maxLength: number, message?: string) {
    this.maxLength = maxLength;
    this.message = message || `Must be no more than ${maxLength} characters`;
  }

  validate(value: any): ValidationResult {
    if (value && value.length > this.maxLength) {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}
