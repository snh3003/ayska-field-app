import {
  IValidationContext,
  IValidationRule,
  ValidationResult,
} from '../interfaces/validation';

export class ValidationContext implements IValidationContext {
  private rules: IValidationRule[] = [];

  addRule(rule: IValidationRule): IValidationContext {
    this.rules.push(rule);
    return this;
  }

  validate(value: any): ValidationResult {
    for (const rule of this.rules) {
      const result = rule.validate(value);
      if (!result.isValid) {
        return result;
      }
    }
    return { isValid: true };
  }
}
