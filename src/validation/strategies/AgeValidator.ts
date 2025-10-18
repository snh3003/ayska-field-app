import {
  IValidationStrategy,
  ValidationResult,
} from '../../interfaces/validation';

export class AgeValidator implements IValidationStrategy {
  validate(value: any): ValidationResult {
    const age = Number(value);
    if (isNaN(age) || age < 18 || age > 100) {
      return { isValid: false, error: 'Age must be between 18-100' };
    }
    return { isValid: true };
  }
}
