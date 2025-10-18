# Phase 4: Feedback Components Implementation Guide

## Overview

This phase focuses on creating comprehensive feedback components that provide consistent user feedback, status indicators, animations, and error handling across the application. These components enhance user experience and provide clear communication about system state.

## Current Problem

**Before (Inconsistent Feedback)**:

```typescript
// Found in 20+ places with different implementations
{error && (
  <TamaguiView
    backgroundColor={theme.errorBg}
    padding="$md"
    borderRadius="$md"
    marginBottom="$md"
  >
    <TamaguiText color={theme.error} fontSize="$3">
      {error}
    </TamaguiText>
  </TamaguiView>
)}

// Toast notifications (inconsistent styling)
{showToast && (
  <TamaguiView
    position="absolute"
    top={50}
    left={20}
    right={20}
    backgroundColor={theme.card}
    padding="$md"
    borderRadius="$md"
    shadowColor="#000"
    shadowOffset={{ width: 0, height: 2 }}
    shadowOpacity={0.25}
    shadowRadius={3.84}
    elevation={5}
  >
    <TamaguiText color={theme.text} fontSize="$4">
      {toastMessage}
    </TamaguiText>
  </TamaguiView>
)}

// Loading states (repetitive)
{loading && (
  <TamaguiView
    flex={1}
    justifyContent="center"
    alignItems="center"
    padding="$lg"
  >
    <ActivityIndicator size="large" color={theme.primary} />
    <TamaguiText color={theme.textSecondary} marginTop="$md">
      Loading...
    </TamaguiText>
  </TamaguiView>
)}
```

**After (Consistent Feedback Components)**:

```typescript
<AyskaStatusIndicatorComponent
  status="error"
  message={error}
  dismissible
  onDismiss={clearError}
/>

<AyskaToastComponent
  message={toastMessage}
  type="success"
  visible={showToast}
  onDismiss={hideToast}
/>

<AyskaLoadingStateComponent
  message="Loading data..."
  variant="fullscreen"
/>
```

## Component Specifications

### 1. AyskaStatusIndicatorComponent

**Purpose**: Unified status indicator for errors, warnings, success messages, and info.

**Location**: `src/components/ui/AyskaStatusIndicatorComponent.tsx`

**Props Interface**:

```typescript
interface AyskaStatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  variant?: 'banner' | 'inline' | 'toast';
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Consistent styling for all status types
- Optional dismiss functionality
- Multiple variants (banner, inline, toast)
- Built-in icons and colors
- Accessibility support

**Usage Examples**:

```typescript
// Error banner
<AyskaStatusIndicatorComponent
  status="error"
  message="Failed to save data. Please try again."
  dismissible
  onDismiss={clearError}
/>

// Success message
<AyskaStatusIndicatorComponent
  status="success"
  title="Success!"
  message="Your changes have been saved."
  variant="inline"
/>

// Warning toast
<AyskaStatusIndicatorComponent
  status="warning"
  message="This action cannot be undone."
  variant="toast"
  dismissible
  onDismiss={hideWarning}
/>
```

### 2. AyskaToastComponent

**Purpose**: Toast notifications with consistent positioning and animations.

**Location**: `src/components/ui/AyskaToastComponent.tsx`

**Props Interface**:

```typescript
interface AyskaToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  visible: boolean;
  onDismiss: () => void;
  duration?: number;
  position?: 'top' | 'bottom';
  action?: {
    label: string;
    onPress: () => void;
  };
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Smooth slide-in/out animations
- Auto-dismiss with configurable duration
- Optional action button
- Consistent positioning
- Haptic feedback

**Usage Examples**:

```typescript
// Basic toast
<AyskaToastComponent
  message="Settings saved successfully"
  type="success"
  visible={showToast}
  onDismiss={hideToast}
/>

// Toast with action
<AyskaToastComponent
  message="File deleted"
  type="info"
  visible={showToast}
  onDismiss={hideToast}
  action={{
    label: "Undo",
    onPress: handleUndo
  }}
/>

// Error toast
<AyskaToastComponent
  message="Network error. Please check your connection."
  type="error"
  visible={showError}
  onDismiss={hideError}
  duration={5000}
/>
```

### 3. AyskaLoadingStateComponent

**Purpose**: Consistent loading states with different variants.

**Location**: `src/components/ui/AyskaLoadingStateComponent.tsx`

**Props Interface**:

```typescript
interface AyskaLoadingStateProps {
  message?: string;
  variant?: 'fullscreen' | 'inline' | 'overlay' | 'skeleton';
  size?: 'small' | 'medium' | 'large';
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Multiple loading variants
- Consistent spinner styling
- Optional loading message
- Accessibility support

**Usage Examples**:

```typescript
// Fullscreen loading
<AyskaLoadingStateComponent
  message="Loading dashboard..."
  variant="fullscreen"
/>

// Inline loading
<AyskaLoadingStateComponent
  message="Saving..."
  variant="inline"
  size="small"
/>

// Overlay loading
<AyskaLoadingStateComponent
  variant="overlay"
  message="Processing request..."
/>

// Skeleton loading
<AyskaLoadingStateComponent variant="skeleton" />
```

### 4. AyskaSkeletonComponent

**Purpose**: Skeleton loading placeholders for different content types.

**Location**: `src/components/ui/AyskaSkeletonComponent.tsx`

**Props Interface**:

```typescript
interface AyskaSkeletonProps {
  variant?: 'text' | 'avatar' | 'card' | 'list' | 'custom';
  width?: number | string;
  height?: number;
  borderRadius?: number;
  lines?: number;
  style?: any;
}
```

**Features**:

- Multiple skeleton variants
- Configurable dimensions
- Smooth shimmer animation
- Consistent styling

**Usage Examples**:

```typescript
// Text skeleton
<AyskaSkeletonComponent variant="text" width="80%" height={20} />

// Avatar skeleton
<AyskaSkeletonComponent variant="avatar" width={48} height={48} />

// Card skeleton
<AyskaSkeletonComponent variant="card" width="100%" height={120} />

// List skeleton
<AyskaSkeletonComponent variant="list" lines={5} />

// Custom skeleton
<AyskaSkeletonComponent
  variant="custom"
  width="100%"
  height={60}
  borderRadius={8}
/>
```

### 5. AyskaProgressComponent

**Purpose**: Progress indicators for long-running operations.

**Location**: `src/components/ui/AyskaProgressComponent.tsx`

**Props Interface**:

```typescript
interface AyskaProgressProps {
  progress: number; // 0-100
  variant?: 'linear' | 'circular';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  showPercentage?: boolean;
  message?: string;
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Linear and circular progress variants
- Configurable colors and sizes
- Optional percentage display
- Accessibility support

**Usage Examples**:

```typescript
// Linear progress
<AyskaProgressComponent
  progress={75}
  variant="linear"
  message="Uploading file..."
  showPercentage
/>

// Circular progress
<AyskaProgressComponent
  progress={60}
  variant="circular"
  size="large"
  color="success"
/>

// Simple progress bar
<AyskaProgressComponent
  progress={45}
  variant="linear"
  size="small"
/>
```

### 6. AyskaEmptyStateComponent

**Purpose**: Empty state illustrations with consistent messaging.

**Location**: `src/components/ui/AyskaEmptyStateComponent.tsx`

**Props Interface**:

```typescript
interface AyskaEmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'search' | 'error' | 'offline';
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Predefined variants for common empty states
- Optional action button
- Consistent iconography
- Accessibility support

**Usage Examples**:

```typescript
// Default empty state
<AyskaEmptyStateComponent
  icon="document-outline"
  title="No documents found"
  message="Start by creating your first document"
  actionLabel="Create Document"
  onAction={handleCreate}
/>

// Search empty state
<AyskaEmptyStateComponent
  variant="search"
  title="No results found"
  message="Try adjusting your search criteria"
/>

// Error empty state
<AyskaEmptyStateComponent
  variant="error"
  title="Something went wrong"
  message="We couldn't load your data. Please try again."
  actionLabel="Retry"
  onAction={handleRetry}
/>
```

### 7. AyskaConfirmationDialogComponent

**Purpose**: Consistent confirmation dialogs for destructive actions.

**Location**: `src/components/ui/AyskaConfirmationDialogComponent.tsx`

**Props Interface**:

```typescript
interface AyskaConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  variant?: 'default' | 'destructive';
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Consistent dialog styling
- Destructive action variant
- Accessibility support
- Haptic feedback

**Usage Examples**:

```typescript
// Default confirmation
<AyskaConfirmationDialogComponent
  visible={showConfirm}
  title="Delete Item"
  message="Are you sure you want to delete this item? This action cannot be undone."
  confirmLabel="Delete"
  cancelLabel="Cancel"
  onConfirm={handleDelete}
  onCancel={handleCancel}
/>

// Destructive confirmation
<AyskaConfirmationDialogComponent
  visible={showConfirm}
  title="Delete Account"
  message="This will permanently delete your account and all associated data."
  confirmLabel="Delete Account"
  cancelLabel="Cancel"
  variant="destructive"
  onConfirm={handleDeleteAccount}
  onCancel={handleCancel}
/>
```

## Implementation Guidelines

### 1. Animation Integration

All feedback components should include smooth animations:

```typescript
import { Animated } from 'react-native';

const fadeIn = new Animated.Value(0);
const slideIn = new Animated.Value(-100);

useEffect(() => {
  if (visible) {
    Animated.parallel([
      Animated.timing(fadeIn, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideIn, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }
}, [visible]);
```

### 2. Haptic Feedback

Interactive feedback components should include haptic feedback:

```typescript
import { hapticFeedback } from '@/utils/haptics';

const handleAction = () => {
  hapticFeedback.medium(); // For destructive actions
  // or hapticFeedback.light(); // For normal actions
  onAction?.();
};
```

### 3. Accessibility

Ensure proper accessibility for all feedback components:

```typescript
<TamaguiView
  accessible={true}
  accessibilityLabel={accessibilityLabel || message}
  accessibilityRole="alert" // For error messages
  accessibilityLiveRegion="polite" // For dynamic content
>
  {/* Component content */}
</TamaguiView>
```

### 4. Theme Integration

Use theme tokens for consistent styling:

```typescript
const getStatusStyles = (status: string) => {
  switch (status) {
    case 'success':
      return {
        backgroundColor: '$successBg',
        borderColor: '$success',
        iconColor: '$success',
      };
    case 'error':
      return {
        backgroundColor: '$errorBg',
        borderColor: '$error',
        iconColor: '$error',
      };
    // ... other statuses
  }
};
```

## Migration Strategy

### Phase 4.1: Create Feedback Components (Week 1)

1. Create AyskaStatusIndicatorComponent
2. Create AyskaToastComponent
3. Create AyskaLoadingStateComponent
4. Create AyskaSkeletonComponent
5. Create AyskaProgressComponent
6. Create AyskaEmptyStateComponent
7. Create AyskaConfirmationDialogComponent

### Phase 4.2: Update Type Definitions (Week 1)

1. Add interfaces to AyskaComponentsType.ts
2. Update exports in index.ts
3. Create comprehensive tests

### Phase 4.3: Migrate High-Impact Areas (Week 2)

1. **Error Handling**: Replace custom error displays
2. **Loading States**: Replace repetitive loading patterns
3. **Empty States**: Use AyskaEmptyStateComponent
4. **Confirmations**: Use AyskaConfirmationDialogComponent

### Phase 4.4: Full Migration (Week 3)

1. Migrate all remaining feedback patterns
2. Update business components
3. Performance testing
4. Documentation updates

## Files to Migrate

### High Priority (Immediate Impact)

- `src/components/feedback/AyskaErrorBoundaryComponent.tsx`
- `src/components/feedback/AyskaEmptyStateComponent.tsx`
- `src/components/feedback/AyskaToastComponent.tsx`
- `src/components/feedback/AyskaSkeletonLoaderComponent.tsx`

### Medium Priority

- All screens with error handling (20+ files)
- Loading states across screens (15+ files)
- Confirmation dialogs (10+ files)

### Low Priority

- Simple feedback patterns with minimal styling

## Success Metrics

| Metric                  | Before             | After             | Improvement |
| ----------------------- | ------------------ | ----------------- | ----------- |
| Error display patterns  | 30+ variations     | 0 variations      | **-100%**   |
| Loading state code      | ~20 lines/instance | ~3 lines/instance | **-85%**    |
| Toast notification code | ~40 lines/instance | ~5 lines/instance | **-87%**    |
| Feedback accessibility  | 40%                | 100%              | **+150%**   |

## Common Patterns to Replace

### 1. Error Messages

**Before**:

```typescript
{error && (
  <TamaguiView
    backgroundColor={theme.errorBg}
    padding="$md"
    borderRadius="$md"
    marginBottom="$md"
  >
    <TamaguiText color={theme.error} fontSize="$3">
      {error}
    </TamaguiText>
  </TamaguiView>
)}
```

**After**:

```typescript
<AyskaStatusIndicatorComponent
  status="error"
  message={error}
  dismissible
  onDismiss={clearError}
/>
```

### 2. Loading States

**Before**:

```typescript
{loading && (
  <TamaguiView
    flex={1}
    justifyContent="center"
    alignItems="center"
    padding="$lg"
  >
    <ActivityIndicator size="large" color={theme.primary} />
    <TamaguiText color={theme.textSecondary} marginTop="$md">
      Loading...
    </TamaguiText>
  </TamaguiView>
)}
```

**After**:

```typescript
<AyskaLoadingStateComponent
  message="Loading data..."
  variant="fullscreen"
/>
```

### 3. Empty States

**Before**:

```typescript
{items.length === 0 && (
  <TamaguiView
    flex={1}
    justifyContent="center"
    alignItems="center"
    padding="$lg"
  >
    <Ionicons name="document-outline" size={64} color={theme.textSecondary} />
    <TamaguiText fontSize="$5" fontWeight="600" color="$text" marginTop="$md">
      No documents found
    </TamaguiText>
    <TamaguiText fontSize="$3" color="$textSecondary" marginTop="$sm" textAlign="center">
      Start by creating your first document
    </TamaguiText>
    <TouchableOpacity
      style={{
        backgroundColor: theme.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 24,
      }}
      onPress={handleCreate}
    >
      <TamaguiText color="white" fontSize="$4" fontWeight="600">
        Create Document
      </TamaguiText>
    </TouchableOpacity>
  </TamaguiView>
)}
```

**After**:

```typescript
<AyskaEmptyStateComponent
  icon="document-outline"
  title="No documents found"
  message="Start by creating your first document"
  actionLabel="Create Document"
  onAction={handleCreate}
/>
```

## Next Steps

After completing Phase 4, the component system will be complete with:

1. **Base Components** (Phase 1): Text, Title, Icon, Badge
2. **Layout Components** (Phase 2A): Stack, Grid, Container
3. **Action Components** (Phase 2B): ActionButton, ListItem
4. **Form Components** (Phase 3): FormField, Select, Date
5. **Feedback Components** (Phase 4): Status, Toast, Loading

## Unit Testing

### Test Coverage Goals

- 90%+ line coverage
- All feedback scenarios tested
- Animation states verified
- Timing behavior tested
- Accessibility compliance

### AyskaToastComponent Tests

- Display/dismiss
- Timeout behavior
- Multiple toasts
- Position variants
- Accessibility

### AyskaStatusComponent Tests

- Status variants
- Color coding
- Icon display
- Accessibility

### AyskaLoadingComponent Tests

- Loading states
- Spinner variants
- Overlay behavior
- Accessibility

### AyskaEmptyStateComponent Tests

- Message display
- Icon rendering
- Action button
- Accessibility

### Test Examples

#### AyskaToastComponent Tests

```typescript
describe('AyskaToastComponent', () => {
  describe('Display', () => {
    it('should show toast message', () => {
      const { getByText } = renderWithProviders(
        <AyskaToastComponent message="Test message" visible />
      );
      expect(getByText('Test message')).toBeTruthy();
    });

    it('should show success toast with correct styling', () => {
      const { getByText } = renderWithProviders(
        <AyskaToastComponent
          message="Success!"
          type="success"
          visible
        />
      );
      const toast = getByText('Success!');
      expect(toast).toHaveStyle({ backgroundColor: '$success' });
    });

    it('should show error toast with correct styling', () => {
      const { getByText } = renderWithProviders(
        <AyskaToastComponent
          message="Error!"
          type="error"
          visible
        />
      );
      const toast = getByText('Error!');
      expect(toast).toHaveStyle({ backgroundColor: '$error' });
    });
  });

  describe('Dismissal', () => {
    it('should auto-dismiss after timeout', async () => {
      jest.useFakeTimers();

      const { getByText, queryByText } = renderWithProviders(
        <AyskaToastComponent
          message="Auto dismiss"
          visible
          duration={3000}
        />
      );

      expect(getByText('Auto dismiss')).toBeTruthy();

      jest.advanceTimersByTime(3000);

      await waitFor(() => {
        expect(queryByText('Auto dismiss')).toBeNull();
      });

      jest.useRealTimers();
    });

    it('should dismiss when close button is pressed', () => {
      const mockOnDismiss = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaToastComponent
          message="Dismissible"
          visible
          onDismiss={mockOnDismiss}
        />
      );

      fireEvent.press(getByRole('button', { name: 'Close' }));
      expect(mockOnDismiss).toHaveBeenCalled();
    });
  });

  describe('Position', () => {
    it('should position toast at top', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaToastComponent
          message="Top toast"
          visible
          position="top"
          testID="toast"
        />
      );
      expect(getByTestId('toast')).toHaveStyle({ top: 50 });
    });

    it('should position toast at bottom', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaToastComponent
          message="Bottom toast"
          visible
          position="bottom"
          testID="toast"
        />
      );
      expect(getByTestId('toast')).toHaveStyle({ bottom: 50 });
    });
  });

  describe('Accessibility', () => {
    it('should announce toast to screen readers', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaToastComponent
          message="Accessible toast"
          visible
          accessibilityLabel="Success message"
        />
      );
      expect(getByLabelText('Success message')).toBeTruthy();
    });
  });
});
```

#### AyskaStatusComponent Tests

```typescript
describe('AyskaStatusComponent', () => {
  describe('Status Variants', () => {
    it('should render success status', () => {
      const { getByText } = renderWithProviders(
        <AyskaStatusComponent status="success" message="Success" />
      );
      expect(getByText('Success')).toBeTruthy();
    });

    it('should render error status', () => {
      const { getByText } = renderWithProviders(
        <AyskaStatusComponent status="error" message="Error" />
      );
      expect(getByText('Error')).toBeTruthy();
    });

    it('should render warning status', () => {
      const { getByText } = renderWithProviders(
        <AyskaStatusComponent status="warning" message="Warning" />
      );
      expect(getByText('Warning')).toBeTruthy();
    });

    it('should render info status', () => {
      const { getByText } = renderWithProviders(
        <AyskaStatusComponent status="info" message="Info" />
      );
      expect(getByText('Info')).toBeTruthy();
    });
  });

  describe('Icon Display', () => {
    it('should show success icon', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStatusComponent
          status="success"
          message="Success"
          testID="status"
        />
      );
      expect(getByTestId('success-icon')).toBeTruthy();
    });

    it('should show error icon', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStatusComponent
          status="error"
          message="Error"
          testID="status"
        />
      );
      expect(getByTestId('error-icon')).toBeTruthy();
    });
  });

  describe('Color Coding', () => {
    it('should apply success colors', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStatusComponent
          status="success"
          message="Success"
          testID="status"
        />
      );
      expect(getByTestId('status')).toHaveStyle({
        backgroundColor: '$successBg',
        borderColor: '$success'
      });
    });

    it('should apply error colors', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStatusComponent
          status="error"
          message="Error"
          testID="status"
        />
      );
      expect(getByTestId('status')).toHaveStyle({
        backgroundColor: '$errorBg',
        borderColor: '$error'
      });
    });
  });
});
```

#### AyskaLoadingComponent Tests

```typescript
describe('AyskaLoadingComponent', () => {
  describe('Loading States', () => {
    it('should show loading spinner', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaLoadingComponent testID="loading" />
      );
      expect(getByTestId('loading')).toBeTruthy();
    });

    it('should show loading message', () => {
      const { getByText } = renderWithProviders(
        <AyskaLoadingComponent message="Loading data..." />
      );
      expect(getByText('Loading data...')).toBeTruthy();
    });

    it('should show overlay when overlay prop is true', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaLoadingComponent overlay testID="overlay" />
      );
      expect(getByTestId('overlay')).toHaveStyle({
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.5)'
      });
    });
  });

  describe('Spinner Variants', () => {
    it('should show small spinner', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaLoadingComponent size="small" testID="spinner" />
      );
      expect(getByTestId('spinner')).toHaveStyle({ width: 20, height: 20 });
    });

    it('should show large spinner', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaLoadingComponent size="large" testID="spinner" />
      );
      expect(getByTestId('spinner')).toHaveStyle({ width: 40, height: 40 });
    });
  });

  describe('Accessibility', () => {
    it('should announce loading state to screen readers', () => {
      const { getByLabelText } = renderWithProviders(
        <AyskaLoadingComponent
          message="Loading data..."
          accessibilityLabel="Loading data, please wait"
        />
      );
      expect(getByLabelText('Loading data, please wait')).toBeTruthy();
    });
  });
});
```

#### AyskaEmptyStateComponent Tests

```typescript
describe('AyskaEmptyStateComponent', () => {
  describe('Message Display', () => {
    it('should show empty state message', () => {
      const { getByText } = renderWithProviders(
        <AyskaEmptyStateComponent message="No data available" />
      );
      expect(getByText('No data available')).toBeTruthy();
    });

    it('should show subtitle when provided', () => {
      const { getByText } = renderWithProviders(
        <AyskaEmptyStateComponent
          message="No data"
          subtitle="Try refreshing the page"
        />
      );
      expect(getByText('Try refreshing the page')).toBeTruthy();
    });
  });

  describe('Icon Rendering', () => {
    it('should show default empty icon', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaEmptyStateComponent
          message="Empty"
          testID="empty-state"
        />
      );
      expect(getByTestId('empty-icon')).toBeTruthy();
    });

    it('should show custom icon when provided', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaEmptyStateComponent
          message="Empty"
          icon={<AyskaIconComponent name="search" testID="custom-icon" />}
        />
      );
      expect(getByTestId('custom-icon')).toBeTruthy();
    });
  });

  describe('Action Button', () => {
    it('should show action button when provided', () => {
      const mockOnAction = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaEmptyStateComponent
          message="Empty"
          actionButton={{
            title: 'Refresh',
            onPress: mockOnAction
          }}
        />
      );
      expect(getByRole('button', { name: 'Refresh' })).toBeTruthy();
    });

    it('should call action when button is pressed', () => {
      const mockOnAction = jest.fn();
      const { getByRole } = renderWithProviders(
        <AyskaEmptyStateComponent
          message="Empty"
          actionButton={{
            title: 'Refresh',
            onPress: mockOnAction
          }}
        />
      );

      fireEvent.press(getByRole('button', { name: 'Refresh' }));
      expect(mockOnAction).toHaveBeenCalled();
    });
  });
});
```

### Coverage Report

Expected coverage after Phase 4:

- Feedback components: 90%+
- Test count: ~120 tests
- All status variants tested
- All animation states tested
- All timing behaviors tested
- All accessibility scenarios covered

## Troubleshooting

### Common Issues

1. **Animations not working**: Ensure Animated API is properly imported
2. **Haptic feedback not working**: Check hapticFeedback utility import
3. **Accessibility warnings**: Add proper accessibility labels and roles
4. **Theme styling conflicts**: Use Tamagui theme tokens consistently

### Best Practices

1. **Consistent animations**: Use standard duration and easing for all components
2. **Haptic feedback**: Use appropriate haptic intensity for different actions
3. **Accessibility**: Include descriptive labels and live regions for dynamic content
4. **Performance**: Use React.memo for feedback components that don't change often
