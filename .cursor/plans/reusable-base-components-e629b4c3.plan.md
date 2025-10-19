<!-- e629b4c3-e7e6-4439-b033-e19e06a9b1d9 d571c2ff-d528-451b-97d4-14373e7f85a6 -->

# Reusable Base Components Migration Plan

## Overview

Create foundational UI components that wrap Tamagui with consistent styling, theme-aware design, and accessibility features. Migrate entire codebase systematically in a bottom-up approach across 4 phases.

## Architecture Decisions

### Component Hierarchy

- **Base Layer**: AyskaTextComponent, AyskaTitleComponent, AyskaIconComponent, AyskaBadgeComponent, AyskaHeadingComponent, AyskaLabelComponent, AyskaCaptionComponent
- **Consumer Layer**: All business/screen components use these base components
- **Styling**: All theme/color/spacing logic centralized in base components
- **Icons**: Optional leading/trailing icons with proper spacing

### Key Principles

- All base components use Tamagui's theme tokens (`$primary`, `$text`, `$md`)
- Support both light/dark modes automatically via Tamagui themes
- Include haptic feedback for interactive elements
- Add accessibility props (a11y) for all interactive components
- TypeScript interfaces in `src/types/AyskaComponentsType.ts`
- Export from `src/components/ui/index.ts`

## Phase 1: Create Base Components (Foundation)

### 1.1 AyskaTextComponent

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
}
```

**Features**:

- Wraps `Text` from `@tamagui/core`
- Maps variants to Typography system (body: 16px/24, bodyLarge: 18px/26, bodySmall: 14px/20)
- Optional leading/trailing icons with proper spacing ($xs gap)
- Theme-aware colors via Tamagui tokens

### 1.2 AyskaTitleComponent

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
}
```

**Features**:

- Maps level to Typography (1=h1: 32px, 2=h2: 28px, 3=h3: 24px, 4=h4: 20px)
- Default level: 3 (h3 - most commonly used)
- Optional icons with $sm gap

### 1.3 AyskaHeadingComponent

**Location**: `src/components/ui/AyskaHeadingComponent.tsx`

**Purpose**: Section headings (between Title and Text)

- Maps to Typography.h4 and custom smaller variants
- Used for card headers, list section titles

### 1.4 AyskaLabelComponent

**Location**: `src/components/ui/AyskaLabelComponent.tsx`

**Purpose**: Form labels, metadata labels

- Small, uppercase variant support
- Required field indicator (optional red asterisk)
- Associated with form inputs via htmlFor/nativeID

### 1.5 AyskaCaptionComponent

**Location**: `src/components/ui/AyskaCaptionComponent.tsx`

**Purpose**: Helper text, timestamps, metadata

- Maps to Typography.caption (12px)
- Subtle colors (textSecondary by default)

### 1.6 AyskaIconComponent

**Location**: `src/components/ui/AyskaIconComponent.tsx`

**Props**:

```typescript
interface AyskaIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  color?: ThemeColorKeys;
  backgroundColor?: ThemeColorKeys;
  rounded?: boolean;
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
}
```

**Features**:

- Wraps Ionicons with theme colors
- Size mapping: sm=16, md=20, lg=24, xl=32
- Optional background container with rounded/square variants
- Haptic feedback on press

### 1.7 AyskaBadgeComponent

**Location**: `src/components/ui/AyskaBadgeComponent.tsx`

**Purpose**: Status badges, counts, labels

- Variants: 'solid', 'outlined', 'subtle'
- Colors: 'primary', 'secondary', 'success', 'warning', 'error', 'info'
- Sizes: 'sm', 'md', 'lg'

## Phase 2: Update Type Definitions

### 2.1 Add to AyskaComponentsType.ts

Add all new component prop interfaces:

- `AyskaTextProps`
- `AyskaTitleProps`
- `AyskaHeadingProps`
- `AyskaLabelProps`
- `AyskaCaptionProps`
- `AyskaIconProps`
- `AyskaBadgeProps`

### 2.2 Update index.ts

Export all new components from `src/components/ui/index.ts`

## Phase 3: Migrate Existing Components

### 3.1 Business Components (10 files)

Migrate all components in `src/components/business/`:

- AyskaActivityCardComponent.tsx
- AyskaAnalyticsCardComponent.tsx
- AyskaAssignmentCardComponent.tsx
- AyskaCheckInButtonComponent.tsx
- AyskaDoctorCardComponent.tsx
- AyskaEmployeeCardComponent.tsx
- AyskaNotificationCardComponent.tsx
- AyskaRoundupCardComponent.tsx
- AyskaTeamCardComponent.tsx

**Changes**: Replace `TamaguiText` → `AyskaTextComponent`, add icons via `AyskaIconComponent`

### 3.2 UI Components (16 files)

Migrate `src/components/ui/` consumers:

- AyskaButtonPrimaryComponent.tsx → use AyskaTextComponent for label
- AyskaButtonSecondaryComponent.tsx → use AyskaTextComponent
- AyskaHeaderComponent.tsx → use AyskaTitleComponent, AyskaCaptionComponent
- AyskaStatsCardComponent.tsx → use AyskaHeadingComponent, AyskaTextComponent
- AyskaInputComponent.tsx → use AyskaLabelComponent, AyskaCaptionComponent
- AyskaDatePickerComponent.tsx → use AyskaLabelComponent
- AyskaDropdownComponent.tsx → use AyskaLabelComponent
- AyskaPasswordInputComponent.tsx → use AyskaLabelComponent
- AyskaErrorBannerComponent.tsx → use AyskaTextComponent with error color
- And others...

### 3.3 Feedback Components (4 files)

- AyskaEmptyStateComponent.tsx → use AyskaTitleComponent, AyskaTextComponent
- AyskaErrorBoundaryComponent.tsx → use AyskaTitleComponent
- AyskaToastComponent.tsx → use AyskaTextComponent
- AyskaSkeletonLoaderComponent.tsx → no changes (structural)

### 3.4 Navigation Components (2 files)

- AyskaBottomSheetComponent.tsx → use AyskaTitleComponent
- AyskaSwipeableCardComponent.tsx → use AyskaTextComponent

### 3.5 Layout Components (2 files)

- AyskaLogoComponent.tsx → no changes (image-based)
- AyskaThemeToggleComponent.tsx → use AyskaIconComponent

### 3.6 Form Components (2 files)

- AyskaSearchBarComponent.tsx → use AyskaTextComponent
- AyskaOnboardEmployeeFormComponent.tsx → use AyskaLabelComponent

## Phase 4: Migrate Screens

### 4.1 Admin Screens (10 files in src/screens/Admin/)

- AyskaAdminDashboardScreen.tsx
- AyskaAnalyticsScreen.tsx
- AyskaAssignDoctorsScreen.tsx
- AyskaEmployeeAnalyticsScreen.tsx
- AyskaEmployeeDetailScreen.tsx
- AyskaEmployeeListScreen.tsx
- AyskaManualCheckInScreen.tsx
- AyskaNotificationLogScreen.tsx
- AyskaOnboardDoctorScreen.tsx
- AyskaOnboardEmployeeScreen.tsx
- AyskaReportsScreen.tsx

**Pattern**: Replace all `TamaguiText` with appropriate variants (AyskaTextComponent, AyskaTitleComponent, AyskaCaptionComponent)

### 4.2 Employee Screens (7 files in src/screens/Employee/)

- AyskaCheckInHistoryScreen.tsx
- AyskaCheckInScreenScreen.tsx
- AyskaDoctorDetailScreen.tsx
- AyskaEmployeeHomeScreen.tsx
- AyskaMyAssignmentsScreen.tsx
- AyskaMyNotificationsScreen.tsx
- AyskaProfileScreen.tsx

### 4.3 Root Screens (3 files in src/screens/)

- AyskaNotificationDetailScreen.tsx
- AyskaNotificationsScreenScreen.tsx
- AyskaSettingsScreen.tsx

## Migration Strategy Per File

1. **Import new components**: Add imports for AyskaTextComponent, etc.
2. **Replace inline TamaguiText**:
   - Regular text → `<AyskaTextComponent>`
   - Titles/headings → `<AyskaTitleComponent level={3}>`
   - Small text/timestamps → `<AyskaCaptionComponent>`
   - Form labels → `<AyskaLabelComponent>`

3. **Replace inline Ionicons**: Wrap in `<AyskaIconComponent>` for theme consistency
4. **Remove redundant styling**: Delete fontSize, color, fontWeight props (handled by variants)
5. **Verify linting**: Run linter after each file migration

## Files to Modify

### Create (7 new files):

1. `src/components/ui/AyskaTextComponent.tsx`
2. `src/components/ui/AyskaTitleComponent.tsx`
3. `src/components/ui/AyskaHeadingComponent.tsx`
4. `src/components/ui/AyskaLabelComponent.tsx`
5. `src/components/ui/AyskaCaptionComponent.tsx`
6. `src/components/ui/AyskaIconComponent.tsx`
7. `src/components/ui/AyskaBadgeComponent.tsx`

### Modify (46+ files):

- 10 business components
- 16 UI components
- 4 feedback components
- 2 navigation components
- 2 layout components
- 2 form components
- 10+ admin screens
- 7 employee screens
- 3 root screens

### Update:

- `src/types/AyskaComponentsType.ts` (add 7 new interfaces)
- `src/components/ui/index.ts` (add 7 exports)

## Post-Migration

1. **Remove AyskaThemedTextComponent.tsx**: Deprecated by AyskaTextComponent
2. **Linting**: Run `npm run lint` and fix all errors
3. **Type checking**: Run `npx tsc --noEmit`
4. **Testing**: Verify light/dark mode switching works correctly across all screens

## Documentation Files

Create comprehensive phase documentation:

1. `docs/phase-1-base-components.md` - Current implementation plan (detailed)
2. `docs/phase-2a-layout-components.md` - Stack, Grid, Container components
3. `docs/phase-2b-action-components.md` - ActionButton, ListItem patterns
4. `docs/phase-3-form-components.md` - Smart form fields with validation
5. `docs/phase-4-feedback-components.md` - Status indicators, animations
6. `docs/architecture-vision.md` - Long-term component hierarchy and principles

### To-dos

- [ ] Create AyskaTextComponent with optional leading/trailing icons
- [ ] Create AyskaTitleComponent with level variants (1-4)
- [ ] Create AyskaHeadingComponent for section headers
- [ ] Create AyskaLabelComponent for form labels
- [ ] Create AyskaCaptionComponent for helper text/timestamps
- [ ] Create AyskaIconComponent wrapping Ionicons with theme support
- [ ] Create AyskaBadgeComponent for status badges
- [ ] Add all 7 component prop interfaces to AyskaComponentsType.ts
- [ ] Export all new components from src/components/ui/index.ts
- [ ] Migrate 10 business components to use base components
- [ ] Migrate 16 UI components to use base components
- [ ] Migrate 4 feedback components to use base components
- [ ] Migrate 2 navigation components to use base components
- [ ] Migrate layout components to use base components
- [ ] Migrate 2 form components to use base components
- [ ] Migrate 10+ admin screens to use base components
- [ ] Migrate 7 employee screens to use base components
- [ ] Migrate 3 root screens to use base components
- [ ] Remove deprecated AyskaThemedTextComponent.tsx if fully replaced
- [ ] Run linter and fix all errors across migrated files
