# Phase 2B: Action Components Implementation Guide

## Overview

This phase focuses on creating reusable action components that eliminate repetitive button and list item patterns across the codebase. These components provide consistent interaction patterns, haptic feedback, and accessibility.

## Current Problem

**Before (Repetitive Code)**:

```typescript
// Found in 30+ places across screens
<TouchableOpacity
  style={{
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  onPress={() => {
    hapticFeedback.light();
    router.push('/admin/onboard-employee');
  }}
>
  <Ionicons name="person-add" size={20} color="white" />
  <TamaguiText
    color="white"
    fontSize="$4"
    fontWeight="600"
    marginLeft="$xs"
  >
    Add Employee
  </TamaguiText>
</TouchableOpacity>

// List item pattern (50+ instances)
<TouchableOpacity onPress={handlePress}>
  <TamaguiView
    flexDirection="row"
    alignItems="center"
    padding="$md"
    borderBottomWidth={1}
    borderBottomColor="$border"
  >
    <TamaguiView
      width={48}
      height={48}
      borderRadius="$md"
      justifyContent="center"
      alignItems="center"
      marginRight="$md"
      backgroundColor={theme.secondaryBg}
    >
      <Ionicons name="person" size={24} color={theme.secondary} />
    </TamaguiView>
    <TamaguiView flex={1}>
      <TamaguiText fontSize="$4" fontWeight="600" color="$text">
        {employee.name}
      </TamaguiText>
      <TamaguiText fontSize="$3" color="$textSecondary" marginTop="$xs">
        {employee.email}
      </TamaguiText>
    </TamaguiView>
    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
  </TamaguiView>
</TouchableOpacity>
```

**After (Semantic Components)**:

```typescript
<AyskaActionButtonComponent
  icon="person-add"
  label="Add Employee"
  variant="primary"
  onPress={() => router.push('/admin/onboard-employee')}
/>

<AyskaListItemComponent
  avatar={<AyskaIconComponent name="person" size="lg" />}
  title={employee.name}
  subtitle={employee.email}
  trailing={<AyskaIconComponent name="chevron-forward" />}
  onPress={handlePress}
/>
```

## Component Specifications

### 1. AyskaActionButtonComponent

**Purpose**: Unified button component with icon, text, and consistent styling.

**Location**: `src/components/ui/AyskaActionButtonComponent.tsx`

**Props Interface**:

```typescript
interface AyskaActionButtonProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  variant?:
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info'
    | 'ghost'
    | 'outline';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Variant Mapping**:

- `primary`: Blue background, white text
- `secondary`: Teal background, white text
- `success`: Green background, white text
- `warning`: Orange background, white text
- `error`: Red background, white text
- `info`: Cyan background, white text
- `ghost`: Transparent background, colored text
- `outline`: Colored border, colored text

**Size Mapping**:

- `sm`: 32px height, 12px padding
- `md`: 48px height, 16px padding (default)
- `lg`: 56px height, 20px padding

**Usage Examples**:

```typescript
// Primary action button
<AyskaActionButtonComponent
  icon="person-add"
  label="Add Employee"
  variant="primary"
  onPress={handleAddEmployee}
/>

// Secondary button
<AyskaActionButtonComponent
  icon="analytics"
  label="View Analytics"
  variant="secondary"
  onPress={handleViewAnalytics}
/>

// Ghost button
<AyskaActionButtonComponent
  icon="settings"
  label="Settings"
  variant="ghost"
  onPress={handleSettings}
/>

// Loading state
<AyskaActionButtonComponent
  label="Saving..."
  variant="primary"
  loading={true}
  onPress={handleSave}
/>
```

### 2. AyskaListItemComponent

**Purpose**: Standardized list item with avatar, content, and actions.

**Location**: `src/components/ui/AyskaListItemComponent.tsx`

**Props Interface**:

```typescript
interface AyskaListItemProps {
  avatar?: React.ReactNode;
  title: string;
  subtitle?: string;
  caption?: string;
  trailing?: React.ReactNode;
  leading?: React.ReactNode;
  variant?: 'default' | 'compact' | 'detailed';
  onPress?: () => void;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Variant Mapping**:

- `default`: Standard height with title and subtitle
- `compact`: Reduced height, title only
- `detailed`: Extra height with caption

**Usage Examples**:

```typescript
// Basic list item
<AyskaListItemComponent
  avatar={<AyskaIconComponent name="person" size="lg" />}
  title="John Doe"
  subtitle="john@example.com"
  onPress={handlePress}
/>

// With trailing action
<AyskaListItemComponent
  avatar={<AyskaIconComponent name="person" size="lg" />}
  title="Jane Smith"
  subtitle="jane@example.com"
  trailing={<AyskaBadgeComponent>Active</AyskaBadgeComponent>}
  onPress={handlePress}
/>

// Detailed variant
<AyskaListItemComponent
  avatar={<AyskaIconComponent name="location" size="lg" />}
  title="Visit Location"
  subtitle="123 Main St, City"
  caption="2 hours ago"
  variant="detailed"
  onPress={handlePress}
/>
```

### 3. AyskaFloatingActionButtonComponent

**Purpose**: Floating action button for primary actions.

**Location**: `src/components/ui/AyskaFloatingActionButtonComponent.tsx`

**Props Interface**:

```typescript
interface AyskaFloatingActionButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onPress: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Primary FAB
<AyskaFloatingActionButtonComponent
  icon="add"
  variant="primary"
  position="bottom-right"
  onPress={handleAdd}
/>

// Secondary FAB
<AyskaFloatingActionButtonComponent
  icon="camera"
  variant="secondary"
  position="bottom-left"
  onPress={handleCamera}
/>
```

### 4. AyskaToggleButtonComponent

**Purpose**: Toggle button for on/off states.

**Location**: `src/components/ui/AyskaToggleButtonComponent.tsx`

**Props Interface**:

```typescript
interface AyskaToggleButtonProps {
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
  checked: boolean;
  onToggle: (checked: boolean) => void;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Basic toggle
<AyskaToggleButtonComponent
  label="Notifications"
  icon="notifications"
  checked={notificationsEnabled}
  onToggle={setNotificationsEnabled}
/>

// Without icon
<AyskaToggleButtonComponent
  label="Dark Mode"
  checked={isDarkMode}
  onToggle={setIsDarkMode}
/>
```

### 5. AyskaIconButtonComponent

**Purpose**: Icon-only button for compact actions.

**Location**: `src/components/ui/AyskaIconButtonComponent.tsx`

**Props Interface**:

```typescript
interface AyskaIconButtonProps {
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onPress: () => void;
  disabled?: boolean;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
```

**Usage Examples**:

```typescript
// Header action
<AyskaIconButtonComponent
  icon="settings"
  variant="ghost"
  onPress={handleSettings}
/>

// Delete action
<AyskaIconButtonComponent
  icon="trash"
  variant="error"
  onPress={handleDelete}
/>
```

## Implementation Guidelines

### 1. Haptic Feedback

All interactive components MUST include haptic feedback:

```typescript
const handlePress = () => {
  hapticFeedback.light(); // or .medium() for destructive actions
  onPress?.();
};
```

### 2. Loading States

Action buttons should support loading states:

```typescript
{loading ? (
  <ActivityIndicator
    color={variant === 'ghost' ? theme.primary : 'white'}
    size="small"
  />
) : (
  <>
    {icon && <AyskaIconComponent name={icon} size="md" color="white" />}
    <AyskaTextComponent color="white" weight="semibold">
      {label}
    </AyskaTextComponent>
  </>
)}
```

### 3. Accessibility

Ensure proper accessibility for all interactive components:

```typescript
{...(getButtonA11yProps(
  accessibilityLabel || label,
  accessibilityHint,
  disabled || loading
) as any)}
```

### 4. Theme Integration

Use theme tokens for consistent styling:

```typescript
const getVariantStyles = (variant: string) => {
  switch (variant) {
    case 'primary':
      return {
        backgroundColor: '$primary',
        color: 'white',
      };
    case 'secondary':
      return {
        backgroundColor: '$secondary',
        color: 'white',
      };
    // ... other variants
  }
};
```

## Migration Strategy

### Phase 2B.1: Create Action Components (Week 1)

1. Create AyskaActionButtonComponent
2. Create AyskaListItemComponent
3. Create AyskaFloatingActionButtonComponent
4. Create AyskaToggleButtonComponent
5. Create AyskaIconButtonComponent

### Phase 2B.2: Update Type Definitions (Week 1)

1. Add interfaces to AyskaComponentsType.ts
2. Update exports in index.ts
3. Create comprehensive tests

### Phase 2B.3: Migrate High-Impact Areas (Week 2)

1. **Admin Dashboard**: Replace all TouchableOpacity buttons
2. **List Screens**: Replace repetitive list item patterns
3. **Form Actions**: Use AyskaActionButtonComponent
4. **Header Actions**: Use AyskaIconButtonComponent

### Phase 2B.4: Full Migration (Week 3)

1. Migrate all remaining screens
2. Update business components
3. Performance testing
4. Documentation updates

## Files to Migrate

### High Priority (Immediate Impact)

- `src/screens/Admin/AyskaAdminDashboardScreen.tsx` (30+ TouchableOpacity instances)
- `src/screens/Admin/AyskaEmployeeListScreen.tsx` (list item patterns)
- `src/screens/Employee/AyskaEmployeeHomeScreen.tsx` (action buttons)
- `src/components/business/AyskaNotificationCardComponent.tsx` (interactive elements)

### Medium Priority

- All admin screens (10+ files)
- All employee screens (7 files)
- Business components (10 files)

### Low Priority

- Simple screens with minimal interactions

## Success Metrics

| Metric                     | Before           | After           | Improvement |
| -------------------------- | ---------------- | --------------- | ----------- |
| TouchableOpacity instances | 100+             | 0               | **-100%**   |
| Button styling code        | ~50 lines/button | ~5 lines/button | **-90%**    |
| List item patterns         | 50+ variations   | 0 variations    | **-100%**   |
| Haptic feedback coverage   | 20%              | 100%            | **+400%**   |

## Common Patterns to Replace

### 1. Quick Action Buttons

**Before**:

```typescript
<TouchableOpacity
  style={{
    flex: 1,
    backgroundColor: theme.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  }}
  onPress={() => {
    hapticFeedback.light();
    router.push('/admin/onboard-employee');
  }}
>
  <Ionicons name="person-add" size={20} color="white" />
  <TamaguiText
    color="white"
    fontSize="$4"
    fontWeight="600"
    marginLeft="$xs"
  >
    Add Employee
  </TamaguiText>
</TouchableOpacity>
```

**After**:

```typescript
<AyskaActionButtonComponent
  icon="person-add"
  label="Add Employee"
  variant="primary"
  onPress={() => router.push('/admin/onboard-employee')}
/>
```

### 2. Employee List Items

**Before**:

```typescript
<TouchableOpacity onPress={() => handleEmployeePress(employee.id)}>
  <TamaguiView
    flexDirection="row"
    alignItems="center"
    padding="$md"
    borderBottomWidth={1}
    borderBottomColor="$border"
  >
    <TamaguiView
      width={48}
      height={48}
      borderRadius="$md"
      justifyContent="center"
      alignItems="center"
      marginRight="$md"
      backgroundColor={theme.secondaryBg}
    >
      <Ionicons name="person" size={24} color={theme.secondary} />
    </TamaguiView>
    <TamaguiView flex={1}>
      <TamaguiText fontSize="$4" fontWeight="600" color="$text">
        {employee.name}
      </TamaguiText>
      <TamaguiText fontSize="$3" color="$textSecondary" marginTop="$xs">
        {employee.email}
      </TamaguiText>
    </TamaguiView>
    <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
  </TamaguiView>
</TouchableOpacity>
```

**After**:

```typescript
<AyskaListItemComponent
  avatar={<AyskaIconComponent name="person" size="lg" />}
  title={employee.name}
  subtitle={employee.email}
  trailing={<AyskaIconComponent name="chevron-forward" />}
  onPress={() => handleEmployeePress(employee.id)}
/>
```

### 3. Header Actions

**Before**:

```typescript
<TouchableOpacity
  onPress={handleLogoutPress}
  style={{
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.card,
  }}
>
  <Ionicons
    name="log-out-outline"
    size={20}
    color={theme.error}
  />
</TouchableOpacity>
```

**After**:

```typescript
<AyskaIconButtonComponent
  icon="log-out-outline"
  variant="ghost"
  onPress={handleLogoutPress}
/>
```

## Next Steps

After completing Phase 2B:

1. **Phase 3**: Form Components (Smart form fields with validation)
2. **Phase 4**: Feedback Components (Status indicators, animations)

## Unit Testing

### Test Coverage Goals

- 90%+ line coverage
- All interaction patterns tested
- Haptic feedback verified
- Loading states validated
- Disabled states tested

### AyskaActionButtonComponent Tests

- Press handlers
- Haptic feedback
- Loading state
- Disabled state
- Icon variants
- Accessibility

### AyskaListItemComponent Tests

- Press handlers
- Chevron rendering
- Leading/trailing content
- Divider rendering
- Accessibility

### Test Examples

#### AyskaActionButtonComponent Tests

```typescript
describe('AyskaActionButtonComponent', () => {
  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent onPress={mockOnPress}>
          Press Me
        </AyskaActionButtonComponent>
      );

      fireEvent.press(getByRole('button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on press', () => {
      const mockHaptic = jest.fn();
      jest.mock('@/utils/haptics', () => ({
        hapticFeedback: { light: mockHaptic }
      }));

      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent onPress={() => {}}>
          Press Me
        </AyskaActionButtonComponent>
      );

      fireEvent.press(getByRole('button'));
      expect(mockHaptic).toHaveBeenCalled();
    });
  });

  describe('States', () => {
    it('should show loading state', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaActionButtonComponent loading>
          Loading
        </AyskaActionButtonComponent>
      );
      expect(getByTestId('loading-indicator')).toBeTruthy();
    });

    it('should be disabled when disabled prop is true', () => {
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent disabled>
          Disabled
        </AyskaActionButtonComponent>
      );
      expect(getByRole('button')).toBeDisabled();
    });

    it('should not call onPress when disabled', () => {
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent disabled onPress={mockOnPress}>
          Disabled
        </AyskaActionButtonComponent>
      );

      fireEvent.press(getByRole('button'));
      expect(mockOnPress).not.toHaveBeenCalled();
    });
  });

  describe('Variants', () => {
    it('should apply primary variant styles', () => {
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent variant="primary">
          Primary
        </AyskaActionButtonComponent>
      );
      expect(getByRole('button')).toHaveStyle({
        backgroundColor: '$primary'
      });
    });

    it('should apply secondary variant styles', () => {
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent variant="secondary">
          Secondary
        </AyskaActionButtonComponent>
      );
      expect(getByRole('button')).toHaveStyle({
        backgroundColor: '$secondary'
      });
    });
  });

  describe('Accessibility', () => {
    it('should have correct accessibility role', () => {
      const { getByRole } = renderWithProviders(
        <AyskaActionButtonComponent>Button</AyskaActionButtonComponent>
      );
      expect(getByRole('button')).toBeTruthy();
    });

    it('should use custom accessibilityLabel', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaActionButtonComponent accessibilityLabel="Custom Label">
          Button
        </AyskaActionButtonComponent>
      );
      expect(getByLabelText('Custom Label')).toBeTruthy();
    });
  });
});
```

#### AyskaListItemComponent Tests

```typescript
describe('AyskaListItemComponent', () => {
  describe('Rendering', () => {
    it('should render title and subtitle', () => {
      const { getByText } = renderWithProviders(
        <AyskaListItemComponent
          title="List Item"
          subtitle="Subtitle"
        />
      );
      expect(getByText('List Item')).toBeTruthy();
      expect(getByText('Subtitle')).toBeTruthy();
    });

    it('should render chevron by default', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaListItemComponent title="Item" testID="list-item" />
      );
      expect(getByTestId('chevron')).toBeTruthy();
    });

    it('should not render chevron when showChevron is false', () => {
      const { queryByTestId } = renderWithProviders(
        <AyskaListItemComponent
          title="Item"
          showChevron={false}
          testID="list-item"
        />
      );
      expect(queryByTestId('chevron')).toBeNull();
    });
  });

  describe('Interactions', () => {
    it('should call onPress when pressed', () => {
      const mockOnPress = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaListItemComponent title="Item" onPress={mockOnPress} />
      );

      fireEvent.press(getByRole('button'));
      expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('should trigger haptic feedback on press', () => {
      const mockHaptic = jest.fn();
      jest.mock('@/utils/haptics', () => ({
        hapticFeedback: { light: mockHaptic }
      }));

      const { getByRole } = renderWithProviders(
        <AyskaListItemComponent title="Item" onPress={() => {}} />
      );

      fireEvent.press(getByRole('button'));
      expect(mockHaptic).toHaveBeenCalled();
    });
  });

  describe('Leading/Trailing Content', () => {
    it('should render leading content', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaListItemComponent
          title="Item"
          leadingContent={<AyskaIconComponent name="star" testID="leading-icon" />}
        />
      );
      expect(getByTestId('leading-icon')).toBeTruthy();
    });

    it('should render trailing content', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaListItemComponent
          title="Item"
          trailingContent={<AyskaBadgeComponent testID="trailing-badge">New</AyskaBadgeComponent>}
        />
      );
      expect(getByTestId('trailing-badge')).toBeTruthy();
    });
  });
});
```

### Coverage Report

Expected coverage after Phase 2B:

- Action components: 90%+
- Test count: ~100 tests
- All interaction patterns tested
- All state variations tested
- All variant styles tested
- Haptic feedback verified
- Accessibility compliance confirmed

## Troubleshooting

### Common Issues

1. **Haptic feedback not working**: Ensure hapticFeedback utility is properly imported
2. **Loading states not showing**: Check ActivityIndicator import and styling
3. **Accessibility warnings**: Add proper accessibility labels and hints
4. **Theme colors not applying**: Verify Tamagui theme tokens are configured

### Best Practices

1. **Consistent haptic feedback**: Use light for normal actions, medium for destructive actions
2. **Loading states**: Always show loading indicator for async operations
3. **Accessibility**: Include descriptive labels and hints for screen readers
4. **Performance**: Use React.memo for action components that don't change often
