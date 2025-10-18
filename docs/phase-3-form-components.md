# Phase 3: Form Components Implementation Guide

## Overview

This phase focuses on creating smart form components that integrate with the existing validation system, provide consistent error handling, and eliminate repetitive form field patterns across the codebase.

## Current Problem

**Before (Repetitive Code)**:

```typescript
// Found in 20+ form implementations
<TamaguiView marginBottom="$md">
  <TamaguiText fontSize="$3" color="$text" marginBottom="$xs">
    Email Address
  </TamaguiText>
  <TextInput
    style={{
      borderWidth: 1,
      borderColor: errors.email ? theme.error : theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    }}
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
    onBlur={() => setTouched({ ...touched, email: true })}
    keyboardType="email-address"
    autoCapitalize="none"
  />
  {errors.email && touched.email && (
    <TamaguiText fontSize="$2" color="$error" marginTop="$xs">
      {errors.email}
    </TamaguiText>
  )}
</TamaguiView>

// Password field with show/hide toggle
<TamaguiView marginBottom="$md">
  <TamaguiText fontSize="$3" color="$text" marginBottom="$xs">
    Password
  </TamaguiText>
  <TamaguiView
    flexDirection="row"
    alignItems="center"
    borderWidth={1}
    borderColor={errors.password ? theme.error : theme.border}
    borderRadius={8}
  >
    <TextInput
      style={{
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: theme.text,
      }}
      placeholder="Enter your password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
      onBlur={() => setTouched({ ...touched, password: true })}
    />
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={{ padding: 12 }}
    >
      <Ionicons
        name={showPassword ? 'eye-off' : 'eye'}
        size={20}
        color={theme.textSecondary}
      />
    </TouchableOpacity>
  </TamaguiView>
  {errors.password && touched.password && (
    <TamaguiText fontSize="$2" color="$error" marginTop="$xs">
      {errors.password}
    </TamaguiText>
  )}
</TamaguiView>
```

**After (Smart Form Components)**:

```typescript
<AyskaFormFieldComponent
  label="Email Address"
  value={email}
  onChange={setEmail}
  validator={CommonValidators.email}
  error={errors.email}
  touched={touched.email}
  keyboardType="email-address"
  autoCapitalize="none"
/>

<AyskaFormFieldComponent
  label="Password"
  value={password}
  onChange={setPassword}
  validator={CommonValidators.password}
  error={errors.password}
  touched={touched.password}
  secureTextEntry={true}
  showPasswordToggle={true}
/>
```

## Component Specifications

### 1. AyskaFormFieldComponent

**Purpose**: Universal form field with built-in validation, error handling, and consistent styling.

**Location**: `src/components/ui/AyskaFormFieldComponent.tsx`

**Props Interface**:

```typescript
interface AyskaFormFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  validator?: IValidationStrategy | IValidationStrategy[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad' | 'url';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  showPasswordToggle?: boolean;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Features**:

- Built-in validation using existing validation system
- Automatic error display
- Password visibility toggle
- Icon support (left/right)
- Accessibility support
- Consistent styling

**Usage Examples**:

```typescript
// Basic text field
<AyskaFormFieldComponent
  label="Full Name"
  value={fullName}
  onChange={setFullName}
  validator={CommonValidators.required('Name is required')}
  error={errors.fullName}
  touched={touched.fullName}
/>

// Email field with validation
<AyskaFormFieldComponent
  label="Email Address"
  value={email}
  onChange={setEmail}
  validator={[
    CommonValidators.required('Email is required'),
    CommonValidators.email
  ]}
  error={errors.email}
  touched={touched.email}
  keyboardType="email-address"
  autoCapitalize="none"
/>

// Password field with toggle
<AyskaFormFieldComponent
  label="Password"
  value={password}
  onChange={setPassword}
  validator={[
    CommonValidators.required('Password is required'),
    CommonValidators.password
  ]}
  error={errors.password}
  touched={touched.password}
  secureTextEntry={true}
  showPasswordToggle={true}
/>

// Field with icon
<AyskaFormFieldComponent
  label="Phone Number"
  value={phone}
  onChange={setPhone}
  leftIcon="call"
  keyboardType="phone-pad"
  placeholder="+1 (555) 123-4567"
/>
```

### 2. AyskaSelectFieldComponent

**Purpose**: Dropdown/select field with consistent styling and validation.

**Location**: `src/components/ui/AyskaSelectFieldComponent.tsx`

**Props Interface**:

```typescript
interface AyskaSelectFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  placeholder?: string;
  validator?: IValidationStrategy | IValidationStrategy[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Basic select
<AyskaSelectFieldComponent
  label="Department"
  value={department}
  onChange={setDepartment}
  options={[
    { label: 'Sales', value: 'sales' },
    { label: 'Marketing', value: 'marketing' },
    { label: 'Engineering', value: 'engineering' },
  ]}
  validator={CommonValidators.required('Department is required')}
  error={errors.department}
  touched={touched.department}
/>

// Searchable select
<AyskaSelectFieldComponent
  label="Employee"
  value={employeeId}
  onChange={setEmployeeId}
  options={employeeOptions}
  searchable={true}
  placeholder="Search employees..."
/>
```

### 3. AyskaDateFieldComponent

**Purpose**: Date picker field with consistent styling and validation.

**Location**: `src/components/ui/AyskaDateFieldComponent.tsx`

**Props Interface**:

```typescript
interface AyskaDateFieldProps {
  label: string;
  value: string;
  onChange: (date: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  validator?: IValidationStrategy | IValidationStrategy[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  maxDate?: string;
  mode?: 'date' | 'time' | 'datetime';
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Date picker
<AyskaDateFieldComponent
  label="Start Date"
  value={startDate}
  onChange={setStartDate}
  validator={CommonValidators.required('Start date is required')}
  error={errors.startDate}
  touched={touched.startDate}
  minDate={new Date().toISOString().split('T')[0]}
/>

// Time picker
<AyskaDateFieldComponent
  label="Meeting Time"
  value={meetingTime}
  onChange={setMeetingTime}
  mode="time"
  placeholder="Select time"
/>
```

### 4. AyskaCheckboxFieldComponent

**Purpose**: Checkbox field with consistent styling and validation.

**Location**: `src/components/ui/AyskaCheckboxFieldComponent.tsx`

**Props Interface**:

```typescript
interface AyskaCheckboxFieldProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  validator?: IValidationStrategy | IValidationStrategy[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Basic checkbox
<AyskaCheckboxFieldComponent
  label="I agree to the terms and conditions"
  checked={agreedToTerms}
  onChange={setAgreedToTerms}
  validator={CommonValidators.required('You must agree to the terms')}
  error={errors.agreedToTerms}
  touched={touched.agreedToTerms}
/>

// Optional checkbox
<AyskaCheckboxFieldComponent
  label="Subscribe to newsletter"
  checked={subscribeNewsletter}
  onChange={setSubscribeNewsletter}
/>
```

### 5. AyskaRadioGroupComponent

**Purpose**: Radio button group with consistent styling and validation.

**Location**: `src/components/ui/AyskaRadioGroupComponent.tsx`

**Props Interface**:

```typescript
interface AyskaRadioGroupProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ label: string; value: string; disabled?: boolean }>;
  validator?: IValidationStrategy | IValidationStrategy[];
  error?: string;
  touched?: boolean;
  required?: boolean;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Radio group
<AyskaRadioGroupComponent
  label="User Role"
  value={userRole}
  onChange={setUserRole}
  options={[
    { label: 'Admin', value: 'admin' },
    { label: 'Employee', value: 'employee' },
    { label: 'Manager', value: 'manager' },
  ]}
  validator={CommonValidators.required('User role is required')}
  error={errors.userRole}
  touched={touched.userRole}
/>
```

### 6. AyskaFormSectionComponent

**Purpose**: Form section with title and consistent spacing.

**Location**: `src/components/ui/AyskaFormSectionComponent.tsx`

**Props Interface**:

```typescript
interface AyskaFormSectionProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  style?: any;
}
```

**Usage Examples**:

```typescript
// Basic form section
<AyskaFormSectionComponent title="Personal Information">
  <AyskaFormFieldComponent label="First Name" value={firstName} onChange={setFirstName} />
  <AyskaFormFieldComponent label="Last Name" value={lastName} onChange={setLastName} />
  <AyskaFormFieldComponent label="Email" value={email} onChange={setEmail} />
</AyskaFormSectionComponent>

// Collapsible section
<AyskaFormSectionComponent
  title="Advanced Settings"
  subtitle="Optional configuration"
  collapsible={true}
  defaultExpanded={false}
>
  <AyskaFormFieldComponent label="API Key" value={apiKey} onChange={setApiKey} />
  <AyskaSelectFieldComponent label="Environment" value={environment} onChange={setEnvironment} options={envOptions} />
</AyskaFormSectionComponent>
```

## Implementation Guidelines

### 1. Validation Integration

All form components MUST integrate with the existing validation system:

```typescript
const validateField = (
  value: string,
  validator?: IValidationStrategy | IValidationStrategy[]
) => {
  if (!validator) return { isValid: true, error: '' };

  if (Array.isArray(validator)) {
    for (const rule of validator) {
      const result = rule.validate(value);
      if (!result.isValid) return result;
    }
    return { isValid: true, error: '' };
  }

  return validator.validate(value);
};
```

### 2. Error Handling

Consistent error display pattern:

```typescript
{error && touched && (
  <AyskaCaptionComponent color="error" marginTop="$xs">
    {error}
  </AyskaCaptionComponent>
)}
```

### 3. Accessibility

Ensure proper accessibility for all form components:

```typescript
// For form fields
<TamaguiView
  accessible={true}
  accessibilityLabel={accessibilityLabel || label}
  accessibilityHint={accessibilityHint}
  accessibilityRole="text"
>
  {/* Field content */}
</TamaguiView>

// For checkboxes/radio buttons
<TamaguiView
  accessible={true}
  accessibilityLabel={accessibilityLabel || label}
  accessibilityHint={accessibilityHint}
  accessibilityRole="checkbox" // or "radio"
  accessibilityState={{ checked }}
>
  {/* Field content */}
</TamaguiView>
```

### 4. Theme Integration

Use theme tokens for consistent styling:

```typescript
const getFieldStyles = (hasError: boolean, isFocused: boolean) => ({
  borderColor: hasError ? '$error' : isFocused ? '$primary' : '$border',
  backgroundColor: '$card',
  borderRadius: '$md',
  padding: '$md',
});
```

## Migration Strategy

### Phase 3.1: Create Form Components (Week 1)

1. Create AyskaFormFieldComponent
2. Create AyskaSelectFieldComponent
3. Create AyskaDateFieldComponent
4. Create AyskaCheckboxFieldComponent
5. Create AyskaRadioGroupComponent
6. Create AyskaFormSectionComponent

### Phase 3.2: Update Type Definitions (Week 1)

1. Add interfaces to AyskaComponentsType.ts
2. Update exports in index.ts
3. Create comprehensive tests

### Phase 3.3: Migrate High-Impact Areas (Week 2)

1. **Onboarding Forms**: Replace repetitive form field patterns
2. **Settings Forms**: Use AyskaFormFieldComponent
3. **Search Forms**: Use AyskaSelectFieldComponent
4. **Filter Forms**: Use AyskaCheckboxFieldComponent and AyskaRadioGroupComponent

### Phase 3.4: Full Migration (Week 3)

1. Migrate all remaining forms
2. Update business components
3. Performance testing
4. Documentation updates

## Files to Migrate

### High Priority (Immediate Impact)

- `src/components/forms/AyskaOnboardEmployeeFormComponent.tsx`
- `src/screens/Admin/AyskaOnboardEmployeeScreen.tsx`
- `src/screens/Admin/AyskaOnboardDoctorScreen.tsx`
- `src/components/forms/AyskaSearchBarComponent.tsx`

### Medium Priority

- All admin screens with forms (5+ files)
- Settings screens (2 files)
- Filter/search components (3 files)

### Low Priority

- Simple forms with minimal fields

## Success Metrics

| Metric                  | Before          | After          | Improvement |
| ----------------------- | --------------- | -------------- | ----------- |
| Form field code         | ~30 lines/field | ~5 lines/field | **-83%**    |
| Validation boilerplate  | 100+ instances  | 0 instances    | **-100%**   |
| Error handling patterns | 50+ variations  | 0 variations   | **-100%**   |
| Form accessibility      | 30%             | 100%           | **+233%**   |

## Common Patterns to Replace

### 1. Text Input Fields

**Before**:

```typescript
<TamaguiView marginBottom="$md">
  <TamaguiText fontSize="$3" color="$text" marginBottom="$xs">
    Email Address
  </TamaguiText>
  <TextInput
    style={{
      borderWidth: 1,
      borderColor: errors.email ? theme.error : theme.border,
      borderRadius: 8,
      padding: 12,
      fontSize: 16,
      color: theme.text,
    }}
    placeholder="Enter your email"
    value={email}
    onChangeText={setEmail}
    onBlur={() => setTouched({ ...touched, email: true })}
    keyboardType="email-address"
    autoCapitalize="none"
  />
  {errors.email && touched.email && (
    <TamaguiText fontSize="$2" color="$error" marginTop="$xs">
      {errors.email}
    </TamaguiText>
  )}
</TamaguiView>
```

**After**:

```typescript
<AyskaFormFieldComponent
  label="Email Address"
  value={email}
  onChange={setEmail}
  validator={[
    CommonValidators.required('Email is required'),
    CommonValidators.email
  ]}
  error={errors.email}
  touched={touched.email}
  keyboardType="email-address"
  autoCapitalize="none"
/>
```

### 2. Password Fields

**Before**:

```typescript
<TamaguiView marginBottom="$md">
  <TamaguiText fontSize="$3" color="$text" marginBottom="$xs">
    Password
  </TamaguiText>
  <TamaguiView
    flexDirection="row"
    alignItems="center"
    borderWidth={1}
    borderColor={errors.password ? theme.error : theme.border}
    borderRadius={8}
  >
    <TextInput
      style={{
        flex: 1,
        padding: 12,
        fontSize: 16,
        color: theme.text,
      }}
      placeholder="Enter your password"
      value={password}
      onChangeText={setPassword}
      secureTextEntry={!showPassword}
      onBlur={() => setTouched({ ...touched, password: true })}
    />
    <TouchableOpacity
      onPress={() => setShowPassword(!showPassword)}
      style={{ padding: 12 }}
    >
      <Ionicons
        name={showPassword ? 'eye-off' : 'eye'}
        size={20}
        color={theme.textSecondary}
      />
    </TouchableOpacity>
  </TamaguiView>
  {errors.password && touched.password && (
    <TamaguiText fontSize="$2" color="$error" marginTop="$xs">
      {errors.password}
    </TamaguiText>
  )}
</TamaguiView>
```

**After**:

```typescript
<AyskaFormFieldComponent
  label="Password"
  value={password}
  onChange={setPassword}
  validator={[
    CommonValidators.required('Password is required'),
    CommonValidators.password
  ]}
  error={errors.password}
  touched={touched.password}
  secureTextEntry={true}
  showPasswordToggle={true}
/>
```

### 3. Form Sections

**Before**:

```typescript
<TamaguiView marginBottom="$lg">
  <TamaguiText fontSize="$5" fontWeight="600" color="$text" marginBottom="$md">
    Personal Information
  </TamaguiText>
  <TamaguiView marginBottom="$md">
    {/* First Name field */}
  </TamaguiView>
  <TamaguiView marginBottom="$md">
    {/* Last Name field */}
  </TamaguiView>
  <TamaguiView marginBottom="$md">
    {/* Email field */}
  </TamaguiView>
</TamaguiView>
```

**After**:

```typescript
<AyskaFormSectionComponent title="Personal Information">
  <AyskaFormFieldComponent label="First Name" value={firstName} onChange={setFirstName} />
  <AyskaFormFieldComponent label="Last Name" value={lastName} onChange={setLastName} />
  <AyskaFormFieldComponent label="Email" value={email} onChange={setEmail} />
</AyskaFormSectionComponent>
```

## Next Steps

After completing Phase 3:

1. **Phase 4**: Feedback Components (Status indicators, animations)

## Unit Testing

### Test Coverage Goals

- 90%+ line coverage
- All validation scenarios tested
- Form state management verified
- Error display tested
- Accessibility compliance

### AyskaFormFieldComponent Tests

- Input validation
- Error display
- Required field indicator
- Label association
- Accessibility

### Form Integration Tests

- Multi-field validation
- Form submission
- Error aggregation
- Reset functionality

### Validation Testing

- RequiredValidator tests
- EmailValidator tests
- PatternValidator tests
- Custom validator tests

### Test Examples

#### AyskaFormFieldComponent Tests

```typescript
describe('AyskaFormFieldComponent', () => {
  describe('Rendering', () => {
    it('should render with label', () => {
      const { getByText } = renderWithProviders(
        <AyskaFormFieldComponent label="Test Field" />
      );
      expect(getByText('Test Field')).toBeTruthy();
    });

    it('should show required indicator when required', () => {
      const { getByText } = renderWithProviders(
        <AyskaFormFieldComponent label="Required Field" required />
      );
      expect(getByText('*')).toBeTruthy();
    });

    it('should display error message when error is provided', () => {
      const { getByText } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Test Field"
          error="This field is required"
          touched
        />
      );
      expect(getByText('This field is required')).toBeTruthy();
    });
  });

  describe('Validation', () => {
    it('should validate required field', () => {
      const mockValidator = jest.fn().mockReturnValue({
        isValid: false,
        error: 'Required'
      });

      const { getByDisplayValue } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Test Field"
          value=""
          validator={[mockValidator]}
        />
      );

      expect(mockValidator).toHaveBeenCalledWith('');
    });

    it('should validate email format', () => {
      const emailValidator = new EmailValidator();

      const { getByDisplayValue } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Email"
          value="invalid-email"
          validator={[emailValidator]}
        />
      );

      // Test email validation logic
    });
  });

  describe('User Input', () => {
    it('should call onChange when text changes', () => {
      const mockOnChange = jest.fn();
      const { getByDisplayValue } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Test Field"
          value=""
          onChange={mockOnChange}
        />
      );

      fireEvent.changeText(getByDisplayValue(''), 'new value');
      expect(mockOnChange).toHaveBeenCalledWith('new value');
    });

    it('should call onBlur when field loses focus', () => {
      const mockOnBlur = jest.fn();
      const { getByDisplayValue } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Test Field"
          value=""
          onBlur={mockOnBlur}
        />
      );

      fireEvent(getByDisplayValue(''), 'blur');
      expect(mockOnBlur).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should link label to input', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaFormFieldComponent label="Test Field" />
      );
      expect(getByLabelText('Test Field')).toBeTruthy();
    });

    it('should announce errors to screen readers', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaFormFieldComponent
          label="Test Field"
          error="Error message"
          touched
        />
      );
      expect(getByLabelText('Error message')).toBeTruthy();
    });
  });
});
```

#### Form Integration Tests

```typescript
describe('Form Integration', () => {
  describe('Multi-field Validation', () => {
    it('should validate all fields on submit', () => {
      const { getByRole, getByDisplayValue } = renderWithProviders(
        <TestForm />
      );

      fireEvent.changeText(getByDisplayValue(''), 'invalid-email');
      fireEvent.press(getByRole('button', { name: 'Submit' }));

      // Verify all validation errors are shown
    });

    it('should clear errors when fields are corrected', () => {
      const { getByRole, getByDisplayValue } = renderWithProviders(
        <TestForm />
      );

      // Enter invalid data
      fireEvent.changeText(getByDisplayValue(''), 'invalid-email');
      fireEvent.press(getByRole('button', { name: 'Submit' }));

      // Correct the data
      fireEvent.changeText(getByDisplayValue('invalid-email'), 'valid@email.com');

      // Verify error is cleared
    });
  });

  describe('Form Submission', () => {
    it('should submit form with valid data', () => {
      const mockOnSubmit = jest.fn();
      const { getByRole, getByDisplayValue } = renderWithProviders(
        <TestForm onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByDisplayValue(''), 'valid@email.com');
      fireEvent.changeText(getByDisplayValue(''), 'password123');
      fireEvent.press(getByRole('button', { name: 'Submit' }));

      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'valid@email.com',
        password: 'password123'
      });
    });

    it('should not submit form with invalid data', () => {
      const mockOnSubmit = jest.fn();
      const { getByRole, getByDisplayValue } = renderWithProviders(
        <TestForm onSubmit={mockOnSubmit} />
      );

      fireEvent.changeText(getByDisplayValue(''), 'invalid-email');
      fireEvent.press(getByRole('button', { name: 'Submit' }));

      expect(mockOnSubmit).not.toHaveBeenCalled();
    });
  });
});
```

#### Validation Testing

```typescript
describe('RequiredValidator', () => {
  let validator: RequiredValidator;

  beforeEach(() => {
    validator = new RequiredValidator('Field is required');
  });

  describe('validate', () => {
    it('should pass for non-empty string', () => {
      const result = validator.validate('test');
      expect(result.isValid).toBe(true);
      expect(result.error).toBe('');
    });

    it('should fail for empty string', () => {
      const result = validator.validate('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should fail for null', () => {
      const result = validator.validate(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should fail for undefined', () => {
      const result = validator.validate(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });

    it('should fail for whitespace-only string', () => {
      const result = validator.validate('   ');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Field is required');
    });
  });
});

describe('EmailValidator', () => {
  let validator: EmailValidator;

  beforeEach(() => {
    validator = new EmailValidator('Invalid email format');
  });

  describe('validate', () => {
    it('should pass for valid email', () => {
      const result = validator.validate('test@example.com');
      expect(result.isValid).toBe(true);
    });

    it('should fail for invalid email', () => {
      const result = validator.validate('invalid-email');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    it('should pass for empty string (handled by RequiredValidator)', () => {
      const result = validator.validate('');
      expect(result.isValid).toBe(true);
    });
  });
});
```

### Coverage Report

Expected coverage after Phase 3:

- Form components: 90%+
- Validators: 90%+
- Test count: ~200 tests
- All validation scenarios tested
- All form states tested
- All error conditions tested
- Accessibility compliance verified

## Troubleshooting

### Common Issues

1. **Validation not working**: Ensure CommonValidators are properly imported
2. **Error display issues**: Check touched state management
3. **Accessibility warnings**: Add proper accessibility labels and hints
4. **Theme styling conflicts**: Use Tamagui theme tokens consistently

### Best Practices

1. **Consistent validation**: Use CommonValidators for standard validation rules
2. **Error handling**: Always check touched state before showing errors
3. **Accessibility**: Include descriptive labels and hints for screen readers
4. **Performance**: Use React.memo for form components that don't change often
