import { RequiredValidator } from './strategies/RequiredValidator';
import { MinLengthValidator } from './strategies/MinLengthValidator';
import { PatternValidator } from './strategies/PatternValidator';

import { AgeValidator } from './strategies/AgeValidator';

export const CommonValidators = {
  email: new PatternValidator(
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    'Please enter a valid email address'
  ),

  phone: new PatternValidator(
    /^\+?[\d\s-()]+$/,
    'Please enter a valid phone number'
  ),

  password: new MinLengthValidator(6, 'Password must be at least 6 characters'),

  required: (message?: string) => new RequiredValidator(message),

  minLength: (length: number, message?: string) =>
    new MinLengthValidator(length, message),

  pattern: (pattern: RegExp, message?: string) =>
    new PatternValidator(pattern, message),

  age: new AgeValidator(),

  areaOfOperation: new RequiredValidator('Area of operation is required'),
};
