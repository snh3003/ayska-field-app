import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/AyskaValidationInterface';

export class PatternValidator implements IValidationStrategy {
  private pattern: RegExp;
  private message: string;

  constructor(pattern: RegExp, message: string = 'Invalid format') {
    this.pattern = pattern;
    this.message = message;
  }

  validate(value: any): ValidationResult {
    if (value && !this.pattern.test(value)) {
      return { isValid: false, error: this.message };
    }
    return { isValid: true };
  }
}
