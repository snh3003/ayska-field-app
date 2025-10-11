// Validation interfaces following Strategy Pattern and Interface Segregation

export interface IValidationRule {
  validate(_value: any): ValidationResult;
}

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export interface IValidator<T> {
  validate(_value: T): ValidationResult;
}

export interface IValidationStrategy {
  validate(_value: any): ValidationResult;
}

export interface IValidationContext {
  addRule(_rule: IValidationRule): IValidationContext;
  validate(_value: any): ValidationResult;
}

export interface IFieldValidator {
  validateField(_value: any, _rules: IValidationRule[]): ValidationResult;
}

export interface IFormValidator {
  validateForm(
    _values: Record<string, any>,
    _rules: Record<string, IValidationRule[]>
  ): Record<string, string>;
}

// Common validation rule types
export interface RequiredRule extends IValidationRule {
  message?: string;
}

export interface MinLengthRule extends IValidationRule {
  minLength: number;
  message?: string;
}

export interface MaxLengthRule extends IValidationRule {
  maxLength: number;
  message?: string;
}

export interface PatternRule extends IValidationRule {
  pattern: RegExp;
  message?: string;
}

export interface CustomRule extends IValidationRule {
  validator: (_value: any) => boolean;
  message?: string;
}
