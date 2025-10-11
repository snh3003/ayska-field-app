import {
  IFieldValidator,
  IValidationRule,
  ValidationResult,
} from '../interfaces/validation';

export class FieldValidator implements IFieldValidator {
  validateField(value: any, rules: IValidationRule[]): ValidationResult {
    for (const rule of rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  }
}
