import { IFormValidator, IValidationRule } from '../interfaces/validation';
import { FieldValidator } from './FieldValidator';

export class FormValidator implements IFormValidator {
  private fieldValidator: FieldValidator;

  constructor() {
    this.fieldValidator = new FieldValidator();
  }

  validateForm(
    values: Record<string, any>,
    rules: Record<string, IValidationRule[]>
  ): Record<string, string> {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach(field => {
      const result = this.fieldValidator.validateField(
        values[field],
        rules[field] || []
      );
      if (!result.isValid && result.error) {
        errors[field] = result.error;
      }
    });

    return errors;
  }
}
