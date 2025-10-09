export interface ValidationRule {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean;
  message?: string;
}

export interface FieldValidation {
  [key: string]: ValidationRule[];
}

export interface ValidationErrors {
  [key: string]: string;
}

export function validateField(value: any, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (rule.required && (!value || value.toString().trim() === '')) {
      return rule.message || 'This field is required';
    }

    if (rule.minLength && value.length < rule.minLength) {
      return rule.message || `Must be at least ${rule.minLength} characters`;
    }

    if (rule.maxLength && value.length > rule.maxLength) {
      return rule.message || `Must be no more than ${rule.maxLength} characters`;
    }

    if (rule.pattern && !rule.pattern.test(value)) {
      return rule.message || 'Invalid format';
    }

    if (rule.custom && !rule.custom(value)) {
      return rule.message || 'Invalid value';
    }
  }

  return null;
}

export function validateForm(
  values: { [key: string]: any },
  validationRules: FieldValidation
): ValidationErrors {
  const errors: ValidationErrors = {};

  Object.keys(validationRules).forEach((field) => {
    const error = validateField(values[field], validationRules[field]);
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}

// Common validation rules
export const commonRules = {
  email: {
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: 'Please enter a valid email address',
  },
  phone: {
    pattern: /^\+?[\d\s-()]+$/,
    message: 'Please enter a valid phone number',
  },
  password: {
    minLength: 6,
    message: 'Password must be at least 6 characters',
  },
};

// Hook for form validation
import { useState } from 'react';

export function useFormValidation<T extends { [key: string]: any }>(
  initialValues: T,
  validationRules: FieldValidation
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  const handleChange = (field: keyof T, value: any) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    
    // Validate field if it has been touched
    if (touched[field as string]) {
      const error = validateField(value, validationRules[field as string] || []);
      setErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
    }
  };

  const handleBlur = (field: keyof T) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    
    const error = validateField(
      values[field],
      validationRules[field as string] || []
    );
    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
  };

  const validateAll = (): boolean => {
    const newErrors = validateForm(values, validationRules);
    setErrors(newErrors);
    
    // Mark all fields as touched
    const allTouched = Object.keys(validationRules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);
    
    return Object.keys(newErrors).length === 0;
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    reset,
    setValues,
  };
}

