# Phase 1: Base Components Implementation Guide

## Overview

This document provides a comprehensive guide for implementing the foundational base components that wrap Tamagui with consistent styling, theme-aware design, and accessibility features.

## Architecture Principles

### Component Hierarchy

```
┌─────────────────────────────────────────┐
│   SCREENS (Business Logic Only)        │
│   - Data fetching                       │
│   - State management (Redux)            │
│   - User interactions                   │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   BUSINESS COMPONENTS                   │
│   - AyskaNotificationCardComponent      │
│   - AyskaEmployeeCardComponent          │
│   - AyskaActivityCardComponent          │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   BASE COMPONENTS (This Phase)          │
│   - AyskaTextComponent                  │
│   - AyskaTitleComponent                 │
│   - AyskaIconComponent                  │
│   - AyskaBadgeComponent                 │
└─────────────────┬───────────────────────┘
                  │
┌─────────────────▼───────────────────────┐
│   TAMAGUI (Primitive Layer)             │
│   - Theme tokens                        │
│   - Styling engine                      │
└─────────────────────────────────────────┘
```

### Key Design Principles

1. **Single Responsibility**: Each base component handles ONE specific text/UI element type
2. **Theme Consistency**: All components use Tamagui theme tokens (`$primary`, `$text`, `$md`)
3. **Accessibility First**: Built-in a11y props and haptic feedback
4. **Type Safety**: Strict TypeScript interfaces prevent invalid combinations
5. **Composability**: Optional icons and flexible styling without breaking the design system

## Component Specifications

### 1. AyskaTextComponent

**Purpose**: Primary text component for body content, descriptions, and general text.

**Location**: `src/components/ui/AyskaTextComponent.tsx`

**Props Interface**:

```typescript
interface AyskaTextProps {
  children: React.ReactNode;
  variant?: 'body' | 'bodyLarge' | 'bodySmall';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?:
    | 'text'
    | 'textSecondary'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
}
```

**Typography Mapping**:

- `body`: 16px/24px (default)
- `bodyLarge`: 18px/26px
- `bodySmall`: 14px/20px

**Usage Examples**:

```typescript
// Basic text
<AyskaTextComponent>Welcome to Ayska Field App</AyskaTextComponent>

// With variant and weight
<AyskaTextComponent variant="bodyLarge" weight="semibold">
  Important information
</AyskaTextComponent>

// With leading icon
<AyskaTextComponent
  leadingIcon={<AyskaIconComponent name="location" />}
  color="primary"
>
  Current location
</AyskaTextComponent>

// Error text
<AyskaTextComponent color="error" weight="medium">
  This field is required
</AyskaTextComponent>
```

### 2. AyskaTitleComponent

**Purpose**: Headings and titles with semantic hierarchy.

**Location**: `src/components/ui/AyskaTitleComponent.tsx`

**Props Interface**:

```typescript
interface AyskaTitleProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4; // Maps to h1, h2, h3, h4
  weight?: 'semibold' | 'bold';
  color?: 'text' | 'textSecondary' | 'primary' | 'secondary';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
}
```

**Typography Mapping**:

- `level={1}`: 32px/40px (h1 - Page titles)
- `level={2}`: 28px/36px (h2 - Section titles)
- `level={3}`: 24px/32px (h3 - Card titles, default)
- `level={4}`: 20px/28px (h4 - Subsection titles)

**Usage Examples**:

```typescript
// Page title
<AyskaTitleComponent level={1}>Admin Dashboard</AyskaTitleComponent>

// Section title (default)
<AyskaTitleComponent>Quick Actions</AyskaTitleComponent>

// With icon
<AyskaTitleComponent
  level={2}
  leadingIcon={<AyskaIconComponent name="analytics" />}
>
  Analytics Overview
</AyskaTitleComponent>
```

### 3. AyskaHeadingComponent

**Purpose**: Section headings between titles and body text.

**Location**: `src/components/ui/AyskaHeadingComponent.tsx`

**Props Interface**:

```typescript
interface AyskaHeadingProps {
  children: React.ReactNode;
  variant?: 'section' | 'card' | 'list';
  weight?: 'medium' | 'semibold';
  color?: 'text' | 'textSecondary' | 'primary';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  leadingIcon?: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
}
```

**Typography Mapping**:

- `section`: 18px/26px (section headers)
- `card`: 16px/24px (card headers)
- `list`: 14px/20px (list section titles)

### 4. AyskaLabelComponent

**Purpose**: Form labels and metadata labels.

**Location**: `src/components/ui/AyskaLabelComponent.tsx`

**Props Interface**:

```typescript
interface AyskaLabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'uppercase' | 'small';
  required?: boolean;
  color?: 'text' | 'textSecondary' | 'primary' | 'error';
  htmlFor?: string;
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Required field indicator (red asterisk)
- Associated with form inputs via `htmlFor`
- Uppercase variant for form sections

### 5. AyskaCaptionComponent

**Purpose**: Helper text, timestamps, and metadata.

**Location**: `src/components/ui/AyskaCaptionComponent.tsx`

**Props Interface**:

```typescript
interface AyskaCaptionProps {
  children: React.ReactNode;
  variant?: 'default' | 'timestamp' | 'helper';
  color?: 'textSecondary' | 'primary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: any;
  accessibilityLabel?: string;
}
```

**Typography Mapping**:

- All variants: 12px/16px (Typography.caption)

### 6. AyskaIconComponent

**Purpose**: Themed icons with consistent sizing and colors.

**Location**: `src/components/ui/AyskaIconComponent.tsx`

**Props Interface**:

```typescript
interface AyskaIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  color?:
    | 'text'
    | 'textSecondary'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info';
  backgroundColor?:
    | 'primaryBg'
    | 'secondaryBg'
    | 'successBg'
    | 'warningBg'
    | 'errorBg'
    | 'infoBg'
    | 'iconBg';
  rounded?: boolean;
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Size Mapping**:

- `sm`: 16px
- `md`: 20px (default)
- `lg`: 24px
- `xl`: 32px

**Features**:

- Haptic feedback on press
- Optional background container
- Theme-aware colors

### 7. AyskaBadgeComponent

**Purpose**: Status badges, counts, and labels.

**Location**: `src/components/ui/AyskaBadgeComponent.tsx`

**Props Interface**:

```typescript
interface AyskaBadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: any;
  accessibilityLabel?: string;
}
```

**Size Mapping**:

- `sm`: 8px padding, 10px font
- `md`: 12px padding, 12px font (default)
- `lg`: 16px padding, 14px font

## Implementation Guidelines

### 1. Theme Integration

All components MUST use Tamagui theme tokens:

```typescript
// ✅ Correct - uses theme tokens
color="$text"
fontSize="$4"
padding="$md"

// ❌ Wrong - hardcoded values
color="#1E293B"
fontSize={16}
padding={16}
```

### 2. Accessibility Implementation

Every interactive component MUST include:

```typescript
// For pressable components
onPress={() => {
  hapticFeedback.light();
  onPress?.();
}}

// Accessibility props
{...(getButtonA11yProps(
  accessibilityLabel,
  accessibilityHint,
  disabled
) as any)}
```

### 3. Icon Integration

Icons should be optional and properly spaced:

```typescript
// Leading icon with proper spacing
{leadingIcon && (
  <TamaguiView marginRight="$xs">
    {leadingIcon}
  </TamaguiView>
)}

// Trailing icon with proper spacing
{trailingIcon && (
  <TamaguiView marginLeft="$xs">
    {trailingIcon}
  </TamaguiView>
)}
```

### 4. Type Safety

All props must be strictly typed:

```typescript
// ✅ Correct - strict union types
variant?: 'body' | 'bodyLarge' | 'bodySmall';

// ❌ Wrong - loose typing
variant?: string;
```

## Migration Strategy

### Phase 1A: Create Base Components (Week 1)

1. Create all 7 base components
2. Add TypeScript interfaces
3. Update exports
4. Test components in isolation

### Phase 1B: Migrate Components (Week 2)

1. Migrate business components (10 files)
2. Migrate UI components (16 files)
3. Migrate feedback components (4 files)
4. Migrate navigation/layout/form components (6 files)

### Phase 1C: Migrate Screens (Week 3)

1. Migrate admin screens (10+ files)
2. Migrate employee screens (7 files)
3. Migrate root screens (3 files)
4. Cleanup and testing

## Quality Assurance

### Testing Checklist

- [ ] All components render correctly in light mode
- [ ] All components render correctly in dark mode
- [ ] Icons display with proper spacing
- [ ] Haptic feedback works on interactive elements
- [ ] Accessibility labels are properly set
- [ ] TypeScript compilation passes
- [ ] Linting passes without errors

### Performance Considerations

- Use `React.memo` for components that don't change often
- Avoid creating functions in render (use `useCallback`)
- Minimize re-renders by using stable props

## Unit Testing with Jest

### Test Coverage Goals

- 95%+ line coverage
- 100% branch coverage for critical paths
- All variants tested
- Accessibility compliance verified
- Theme switching tested

### Testing Infrastructure

- Jest + React Native Testing Library
- Custom renderWithProviders utility
- Mock Tamagui theme context
- Haptic feedback mocking

### Test Examples

#### AyskaTextComponent Tests

```typescript
describe('AyskaTextComponent', () => {
  describe('Rendering', () => {
    it('should render children text correctly', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent>Test Text</AyskaTextComponent>
      );
      expect(getByText('Test Text')).toBeTruthy();
    });

    it('should render with default props', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent>Default Text</AyskaTextComponent>
      );
      const text = getByText('Default Text');
      expect(text).toHaveStyle({ fontSize: 16 });
    });
  });

  describe('Variants', () => {
    it('should apply body variant styles', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent variant="body">Body Text</AyskaTextComponent>
      );
      expect(getByText('Body Text')).toHaveStyle({ fontSize: 16 });
    });

    it('should apply bodyLarge variant styles', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent variant="bodyLarge">Large Text</AyskaTextComponent>
      );
      expect(getByText('Large Text')).toHaveStyle({ fontSize: 18 });
    });

    it('should apply bodySmall variant styles', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent variant="bodySmall">Small Text</AyskaTextComponent>
      );
      expect(getByText('Small Text')).toHaveStyle({ fontSize: 14 });
    });
  });

  describe('Colors', () => {
    it('should apply text color', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent color="text">Text</AyskaTextComponent>
      );
      expect(getByText('Text')).toHaveStyle({ color: '$text' });
    });

    it('should apply error color', () => {
      const { getByText } = renderWithProviders(
        <AyskaTextComponent color="error">Error</AyskaTextComponent>
      );
      expect(getByText('Error')).toHaveStyle({ color: '$error' });
    });
  });

  describe('Icons', () => {
    it('should render with leading icon', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaTextComponent
          leadingIcon={<AyskaIconComponent name="location" testID="icon" />}
        >
          With Icon
        </AyskaTextComponent>
      );
      expect(getByTestId('icon')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      const { getByRole } = renderWithProviders(
        <AyskaTextComponent>Accessible Text</AyskaTextComponent>
      );
      expect(getByRole('text')).toBeTruthy();
    });

    it('should use custom accessibilityLabel when provided', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaTextComponent accessibilityLabel="Custom Label">
          Text
        </AyskaTextComponent>
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });
  });
});
```

#### AyskaTitleComponent Tests

```typescript
describe('AyskaTitleComponent', () => {
  describe('Levels', () => {
    it('should render level 1 title', () => {
      const { getByText } = renderWithProviders(
        <AyskaTitleComponent level={1}>H1 Title</AyskaTitleComponent>
      );
      expect(getByText('H1 Title')).toHaveStyle({ fontSize: 32 });
    });

    it('should render level 3 title by default', () => {
      const { getByText } = renderWithProviders(
        <AyskaTitleComponent>Default Title</AyskaTitleComponent>
      );
      expect(getByText('Default Title')).toHaveStyle({ fontSize: 24 });
    });
  });

  describe('Weights', () => {
    it('should apply semibold weight', () => {
      const { getByText } = renderWithProviders(
        <AyskaTitleComponent weight="semibold">Semibold</AyskaTitleComponent>
      );
      expect(getByText('Semibold')).toHaveStyle({ fontWeight: '600' });
    });
  });
});
```

#### AyskaIconComponent Tests

```typescript
describe('AyskaIconComponent', () => {
  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaIconComponent name="location" size="sm" testID="icon" />
      );
      expect(getByTestId('icon')).toHaveStyle({ fontSize: 16 });
    });

    it('should render medium size by default', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaIconComponent name="location" testID="icon" />
      );
      expect(getByTestId('icon')).toHaveStyle({ fontSize: 20 });
    });
  });

  describe('Interactions', () => {
    it('should trigger haptic feedback on press', () => {
      const mockHaptic = jest.fn();
      jest.mock('@/utils/haptics', () => ({
        hapticFeedback: { light: mockHaptic }
      }));

      const { getByTestId } = renderWithProviders(
        <AyskaIconComponent
          name="location"
          onPress={() => {}}
          testID="icon"
        />
      );

      fireEvent.press(getByTestId('icon'));
      expect(mockHaptic).toHaveBeenCalled();
    });
  });
});
```

### Running Tests

```bash
# Run all tests
npm test

# Run specific component tests
npm test -- AyskaTextComponent

# Run with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Coverage Report

Expected coverage after Phase 1 completion:

- Base components: 95%+
- Test count: ~150 tests
- All variants tested
- All color combinations tested
- All accessibility scenarios covered

## Success Metrics

After implementation, you should see:

| Metric                    | Before         | After        | Improvement |
| ------------------------- | -------------- | ------------ | ----------- |
| Lines of code (screens)   | ~500/screen    | ~350/screen  | **-30%**    |
| Repetitive styling props  | 500+ instances | 0 instances  | **-100%**   |
| Theme inconsistencies     | 20+ variations | 0 variations | **-100%**   |
| Time to add new screen    | 3-4 hours      | 1-2 hours    | **-50%**    |
| Onboarding time (new dev) | 2 weeks        | 3-5 days     | **-60%**    |

## Next Steps

After completing Phase 1:

1. **Phase 2A**: Layout Components (Stack, Grid, Container)
2. **Phase 2B**: Action Components (ActionButton, ListItem)
3. **Phase 3**: Form Components (Smart form fields)
4. **Phase 4**: Feedback Components (Status indicators, animations)

## Troubleshooting

### Common Issues

1. **Theme tokens not working**: Ensure Tamagui provider is properly configured
2. **Icons not displaying**: Check Ionicons import and name spelling
3. **TypeScript errors**: Verify all prop interfaces are properly exported
4. **Styling conflicts**: Remove redundant style props when using variants

### Getting Help

- Check existing component implementations for patterns
- Refer to Tamagui documentation for theme tokens
- Use TypeScript strict mode to catch prop errors early
