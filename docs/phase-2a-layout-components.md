# Phase 2A: Layout Components Implementation Guide

## Overview

This phase focuses on creating semantic layout components that eliminate repetitive flexbox and spacing code across the codebase. These components provide consistent spacing, alignment, and responsive behavior.

## Current Problem

**Before (Repetitive Code)**:

```typescript
// Found in 200+ places across the codebase
<TamaguiView
  flexDirection="row"
  gap="$md"
  alignItems="center"
  justifyContent="space-between"
>
  <TamaguiText>Title</TamaguiText>
  <AyskaIconComponent name="chevron-forward" />
</TamaguiView>

<TamaguiView
  flexDirection="column"
  gap="$sm"
  padding="$lg"
>
  <AyskaTextComponent>Item 1</AyskaTextComponent>
  <AyskaTextComponent>Item 2</AyskaTextComponent>
</TamaguiView>
```

**After (Semantic Components)**:

```typescript
<AyskaStackComponent direction="horizontal" spacing="md" align="center" justify="space-between">
  <AyskaTextComponent>Title</AyskaTextComponent>
  <AyskaIconComponent name="chevron-forward" />
</AyskaStackComponent>

<AyskaStackComponent direction="vertical" spacing="sm" padding="lg">
  <AyskaTextComponent>Item 1</AyskaTextComponent>
  <AyskaTextComponent>Item 2</AyskaTextComponent>
</AyskaStackComponent>
```

## Component Specifications

### 1. AyskaStackComponent

**Purpose**: Primary layout component for arranging children in rows or columns with consistent spacing.

**Location**: `src/components/ui/AyskaStackComponent.tsx`

**Props Interface**:

```typescript
interface AyskaStackProps {
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?:
    | 'start'
    | 'center'
    | 'end'
    | 'space-between'
    | 'space-around'
    | 'space-evenly';
  wrap?: boolean;
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  backgroundColor?:
    | 'transparent'
    | 'card'
    | 'background'
    | 'primaryBg'
    | 'secondaryBg';
  borderRadius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  style?: any;
  accessibilityLabel?: string;
}
```

**Spacing Mapping**:

- `xs`: 4px
- `sm`: 8px
- `md`: 16px (default)
- `lg`: 24px
- `xl`: 32px
- `xxl`: 48px

**Usage Examples**:

```typescript
// Basic vertical stack
<AyskaStackComponent direction="vertical" spacing="md">
  <AyskaTextComponent>Item 1</AyskaTextComponent>
  <AyskaTextComponent>Item 2</AyskaTextComponent>
</AyskaStackComponent>

// Horizontal stack with alignment
<AyskaStackComponent
  direction="horizontal"
  spacing="sm"
  align="center"
  justify="space-between"
>
  <AyskaTitleComponent>Section Title</AyskaTitleComponent>
  <AyskaIconComponent name="chevron-forward" />
</AyskaStackComponent>

// Card-like container
<AyskaStackComponent
  direction="vertical"
  spacing="md"
  padding="lg"
  backgroundColor="card"
  borderRadius="md"
>
  <AyskaTitleComponent>Card Title</AyskaTitleComponent>
  <AyskaTextComponent>Card content goes here</AyskaTextComponent>
</AyskaStackComponent>
```

### 2. AyskaGridComponent

**Purpose**: Grid layout for responsive card layouts and form fields.

**Location**: `src/components/ui/AyskaGridComponent.tsx`

**Props Interface**:

```typescript
interface AyskaGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  style?: any;
  accessibilityLabel?: string;
}
```

**Usage Examples**:

```typescript
// Stats cards grid
<AyskaGridComponent columns={2} gap="md">
  <StatsCard title="Total" value="100" />
  <StatsCard title="Active" value="75" />
  <StatsCard title="Pending" value="15" />
  <StatsCard title="Completed" value="10" />
</AyskaGridComponent>

// Form fields grid
<AyskaGridComponent columns={2} gap="sm">
  <AyskaFormFieldComponent label="First Name" />
  <AyskaFormFieldComponent label="Last Name" />
</AyskaGridComponent>
```

### 3. AyskaContainerComponent

**Purpose**: Page-level container with consistent padding and max-width constraints.

**Location**: `src/components/ui/AyskaContainerComponent.tsx`

**Props Interface**:

```typescript
interface AyskaContainerProps {
  children: React.ReactNode;
  variant?: 'page' | 'section' | 'card' | 'modal';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  centerContent?: boolean;
  backgroundColor?: 'transparent' | 'background' | 'card';
  style?: any;
  accessibilityLabel?: string;
}
```

**Variant Mapping**:

- `page`: Full screen with safe area padding
- `section`: Section container with medium padding
- `card`: Card-like container with border radius
- `modal`: Modal container with specific padding

**Usage Examples**:

```typescript
// Page container
<AyskaContainerComponent variant="page" padding="lg">
  <AyskaTitleComponent level={1}>Dashboard</AyskaTitleComponent>
  <AyskaStackComponent direction="vertical" spacing="lg">
    {/* Page content */}
  </AyskaStackComponent>
</AyskaContainerComponent>

// Section container
<AyskaContainerComponent variant="section" padding="md">
  <AyskaTitleComponent>Recent Activity</AyskaTitleComponent>
  {/* Section content */}
</AyskaContainerComponent>
```

### 4. AyskaSpacerComponent

**Purpose**: Consistent spacing between elements without wrapping containers.

**Location**: `src/components/ui/AyskaSpacerComponent.tsx`

**Props Interface**:

```typescript
interface AyskaSpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  direction?: 'horizontal' | 'vertical';
  style?: any;
}
```

**Usage Examples**:

```typescript
// Vertical spacing
<AyskaTextComponent>First item</AyskaTextComponent>
<AyskaSpacerComponent size="md" />
<AyskaTextComponent>Second item</AyskaTextComponent>

// Horizontal spacing
<AyskaIconComponent name="location" />
<AyskaSpacerComponent size="sm" direction="horizontal" />
<AyskaTextComponent>Current location</AyskaTextComponent>
```

### 5. AyskaDividerComponent

**Purpose**: Visual separators between sections.

**Location**: `src/components/ui/AyskaDividerComponent.tsx`

**Props Interface**:

```typescript
interface AyskaDividerProps {
  variant?: 'horizontal' | 'vertical';
  thickness?: 'thin' | 'medium' | 'thick';
  color?: 'border' | 'textSecondary' | 'primary';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'none';
  style?: any;
}
```

**Usage Examples**:

```typescript
// Section divider
<AyskaTitleComponent>Section 1</AyskaTitleComponent>
<AyskaDividerComponent margin="md" />
<AyskaTitleComponent>Section 2</AyskaTitleComponent>

// Vertical divider
<AyskaStackComponent direction="horizontal" align="center">
  <AyskaTextComponent>Left</AyskaTextComponent>
  <AyskaDividerComponent variant="vertical" />
  <AyskaTextComponent>Right</AyskaTextComponent>
</AyskaStackComponent>
```

## Implementation Guidelines

### 1. Responsive Behavior

Components should adapt to screen size:

```typescript
// Responsive grid columns
const getResponsiveColumns = (screenWidth: number) => {
  if (screenWidth >= 768) return 3; // Tablet
  if (screenWidth >= 480) return 2; // Large phone
  return 1; // Small phone
};
```

### 2. Performance Optimization

Use `React.memo` for layout components:

```typescript
export const AyskaStackComponent = React.memo<AyskaStackProps>(
  ({
    children,
    direction = 'vertical',
    spacing = 'md',
    // ... other props
  }) => {
    // Component implementation
  }
);
```

### 3. Accessibility

Ensure proper accessibility for layout components:

```typescript
// For containers that group related content
<TamaguiView
  role="group"
  accessibilityLabel={accessibilityLabel}
  // ... other props
>
  {children}
</TamaguiView>
```

## Migration Strategy

### Phase 2A.1: Create Layout Components (Week 1)

1. Create AyskaStackComponent
2. Create AyskaGridComponent
3. Create AyskaContainerComponent
4. Create AyskaSpacerComponent
5. Create AyskaDividerComponent

### Phase 2A.2: Update Type Definitions (Week 1)

1. Add interfaces to AyskaComponentsType.ts
2. Update exports in index.ts
3. Create comprehensive tests

### Phase 2A.3: Migrate High-Impact Areas (Week 2)

1. **Admin Dashboard**: Replace repetitive flex layouts
2. **Card Components**: Use AyskaStackComponent for content
3. **Form Layouts**: Use AyskaGridComponent for field arrangements
4. **Screen Containers**: Use AyskaContainerComponent

### Phase 2A.4: Full Migration (Week 3)

1. Migrate all remaining screens
2. Update business components
3. Performance testing
4. Documentation updates

## Files to Migrate

### High Priority (Immediate Impact)

- `src/screens/Admin/AyskaAdminDashboardScreen.tsx` (200+ lines of layout code)
- `src/components/business/AyskaNotificationCardComponent.tsx`
- `src/components/business/AyskaEmployeeCardComponent.tsx`
- `src/components/ui/AyskaStatsCardComponent.tsx`

### Medium Priority

- All admin screens (10+ files)
- All employee screens (7 files)
- Form components (2 files)

### Low Priority

- Simple screens with minimal layout complexity

## Success Metrics

| Metric                  | Before         | After        | Improvement |
| ----------------------- | -------------- | ------------ | ----------- |
| Layout code lines       | ~200/screen    | ~50/screen   | **-75%**    |
| Flexbox props           | 500+ instances | 0 instances  | **-100%**   |
| Spacing inconsistencies | 30+ variations | 0 variations | **-100%**   |
| Responsive breakpoints  | Manual         | Automatic    | **+100%**   |

## Common Patterns to Replace

### 1. Card Content Layout

**Before**:

```typescript
<TamaguiView flexDirection="row" alignItems="center" marginBottom="$sm">
  <TamaguiView marginRight="$md">
    <Ionicons name="person" size={24} />
  </TamaguiView>
  <TamaguiView flex={1}>
    <TamaguiText fontWeight="600">{employee.name}</TamaguiText>
    <TamaguiText color="$textSecondary">{employee.email}</TamaguiText>
  </TamaguiView>
  <Ionicons name="chevron-forward" size={20} />
</TamaguiView>
```

**After**:

```typescript
<AyskaStackComponent direction="horizontal" align="center" spacing="md">
  <AyskaIconComponent name="person" size="lg" />
  <AyskaStackComponent direction="vertical" spacing="xs" flex={1}>
    <AyskaTextComponent weight="semibold">{employee.name}</AyskaTextComponent>
    <AyskaCaptionComponent>{employee.email}</AyskaCaptionComponent>
  </AyskaStackComponent>
  <AyskaIconComponent name="chevron-forward" />
</AyskaStackComponent>
```

### 2. Stats Grid

**Before**:

```typescript
<TamaguiView flexDirection="row" gap="$md" marginBottom="$md">
  <StatsCard title="Total" value="100" />
  <StatsCard title="Active" value="75" />
</TamaguiView>
<TamaguiView flexDirection="row" gap="$md" marginBottom="$md">
  <StatsCard title="Pending" value="15" />
  <StatsCard title="Completed" value="10" />
</TamaguiView>
```

**After**:

```typescript
<AyskaGridComponent columns={2} gap="md" margin="md">
  <StatsCard title="Total" value="100" />
  <StatsCard title="Active" value="75" />
  <StatsCard title="Pending" value="15" />
  <StatsCard title="Completed" value="10" />
</AyskaGridComponent>
```

## Next Steps

After completing Phase 2A:

1. **Phase 2B**: Action Components (ActionButton, ListItem patterns)
2. **Phase 3**: Form Components (Smart form fields with validation)
3. **Phase 4**: Feedback Components (Status indicators, animations)

## Unit Testing

### Test Coverage Goals

- 90%+ line coverage for layout components
- Responsive behavior tested
- Spacing system validated
- Edge cases covered

### AyskaStackComponent Tests

- Direction variants (horizontal/vertical)
- Spacing between children
- Alignment options
- Responsive breakpoints

### AyskaGridComponent Tests

- Column layout
- Gap spacing
- Responsive columns
- Auto-fit/auto-fill

### AyskaContainerComponent Tests

- Max-width constraints
- Padding variations
- Center alignment
- Responsive behavior

### Test Examples

#### AyskaStackComponent Tests

```typescript
describe('AyskaStackComponent', () => {
  describe('Direction', () => {
    it('should render vertical stack by default', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStackComponent testID="stack">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
          <AyskaTextComponent>Item 2</AyskaTextComponent>
        </AyskaStackComponent>
      );
      expect(getByTestId('stack')).toHaveStyle({ flexDirection: 'column' });
    });

    it('should render horizontal stack', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStackComponent direction="horizontal" testID="stack">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
          <AyskaTextComponent>Item 2</AyskaTextComponent>
        </AyskaStackComponent>
      );
      expect(getByTestId('stack')).toHaveStyle({ flexDirection: 'row' });
    });
  });

  describe('Spacing', () => {
    it('should apply small spacing', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStackComponent spacing="sm" testID="stack">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
          <AyskaTextComponent>Item 2</AyskaTextComponent>
        </AyskaStackComponent>
      );
      expect(getByTestId('stack')).toHaveStyle({ gap: 8 });
    });

    it('should apply medium spacing by default', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStackComponent testID="stack">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
          <AyskaTextComponent>Item 2</AyskaTextComponent>
        </AyskaStackComponent>
      );
      expect(getByTestId('stack')).toHaveStyle({ gap: 16 });
    });
  });

  describe('Alignment', () => {
    it('should align items center', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaStackComponent align="center" testID="stack">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
        </AyskaStackComponent>
      );
      expect(getByTestId('stack')).toHaveStyle({ alignItems: 'center' });
    });
  });
});
```

#### AyskaGridComponent Tests

```typescript
describe('AyskaGridComponent', () => {
  describe('Columns', () => {
    it('should render 2 columns', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaGridComponent columns={2} testID="grid">
          <AyskaTextComponent>Item 1</AyskaTextComponent>
          <AyskaTextComponent>Item 2</AyskaTextComponent>
        </AyskaGridComponent>
      );
      expect(getByTestId('grid')).toHaveStyle({
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)'
      });
    });
  });

  describe('Responsive', () => {
    it('should adapt columns based on screen size', () => {
      const { getByTestId } = renderWithProviders(
        <AyskaGridComponent
          columns={{ mobile: 1, tablet: 2, desktop: 3 }}
          testID="grid"
        >
          <AyskaTextComponent>Item 1</AyskaTextComponent>
        </AyskaGridComponent>
      );
      // Test responsive behavior with different screen sizes
    });
  });
});
```

### Coverage Report

Expected coverage after Phase 2A:

- Layout components: 90%+
- Test count: ~80 tests
- All direction variants tested
- All spacing values tested
- All alignment options tested
- Responsive behavior verified

## Troubleshooting

### Common Issues

1. **Spacing not working**: Check if Tamagui theme tokens are properly configured
2. **Grid not responsive**: Ensure screen width detection is working
3. **Performance issues**: Use React.memo for layout components
4. **Accessibility warnings**: Add proper accessibility labels and roles

### Best Practices

1. **Prefer semantic components**: Use AyskaStackComponent instead of raw TamaguiView
2. **Consistent spacing**: Always use predefined spacing values
3. **Responsive design**: Test on different screen sizes
4. **Accessibility**: Include proper labels and roles for screen readers
