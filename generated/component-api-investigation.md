# Component API Investigation Report

**Phase 2 - TypeScript Error Fix Strategy**

Generated: October 23, 2025  
Purpose: Document actual component APIs vs current usage to fix TypeScript errors

---

## Executive Summary

**Total Components Investigated:** 4  
**API Mismatches Found:** 4 categories  
**Affected Error Count:** ~37 errors

This investigation reveals systematic misuse of component props across business components, primarily:

1. Using non-existent `count` prop on Skeleton
2. Passing accessibility props to Input (not in interface)
3. Passing `style`/`accessibilityHint` to ErrorBoundary (not accepted)
4. Passing invalid props to EmptyState

---

## 1. Skeleton Component

### File Location

`src/components/feedback/AyskaSkeletonLoaderComponent.tsx`

### Actual API (SkeletonProps)

```typescript
export interface SkeletonProps {
  width?: number | string; // ✅ Accepts string ('100%') or number
  height?: number; // ✅ Optional height in pixels
  borderRadius?: number; // ✅ Optional border radius
  style?: any; // ✅ Accepts custom styles
}

// Component signature:
export function Skeleton({
  width = '100%',
  height = 20,
  borderRadius = BorderRadius.sm,
  style,
}: SkeletonProps);
```

### Invalid Props Being Used

❌ **`count`** - Does NOT exist in SkeletonProps  
❌ **`accessibilityHint`** - Does NOT exist in SkeletonProps

### Current Problematic Usage

```typescript
// Found in 5 business components:
<Skeleton count={5} height={100} style={style} accessibilityHint="Loading..." />
```

### Correct Usage Pattern

```typescript
// Option 1: Manual array rendering
<View style={style}>
  {[...Array(5)].map((_, i) => (
    <Skeleton key={i} height={100} style={{ marginBottom: 8 }} />
  ))}
</View>

// Option 2: Use pre-built skeleton layouts (RECOMMENDED)
import { CardSkeleton, StatCardSkeleton, ListItemSkeleton } from '@/components/feedback/AyskaSkeletonLoaderComponent';

// For card lists:
<CardSkeleton />  // Single card skeleton

// For stat grids:
<StatCardSkeleton />  // Single stat card skeleton

// For multiple items:
<ListItemSkeleton />  // Renders 3 CardSkeleton instances
```

### Available Pre-built Skeletons

```typescript
// 1. CardSkeleton - For list item cards
export function CardSkeleton();
// Renders: Avatar + 2 text lines in card layout

// 2. StatCardSkeleton - For dashboard stat cards
export function StatCardSkeleton();
// Renders: Icon + title + value in card layout

// 3. ListItemSkeleton - For multiple list items
export function ListItemSkeleton();
// Renders: 3 CardSkeleton instances
```

### Fix Strategy

**Errors Fixed:** ~7 errors  
**Files to Modify:** 5 business components

1. Remove `count` prop usage
2. Remove `accessibilityHint` from Skeleton
3. Use pre-built skeletons where appropriate
4. For custom counts, use array mapping pattern

---

## 2. Input Component

### File Location

`src/components/ui/AyskaInputComponent.tsx`

### Actual API (InputProps)

```typescript
export interface InputProps {
  label?: string; // ✅ Optional label text
  placeholder?: string; // ✅ Placeholder text
  value: string; // ✅ REQUIRED current value
  onChangeText: (_e: any) => void; // ✅ REQUIRED change handler
  onBlur?: () => void; // ✅ Optional blur handler
  secureTextEntry?: boolean; // ✅ Password field flag
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'; // ✅ Keyboard type
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters'; // ✅ Auto-capitalize
  multiline?: boolean; // ✅ Multi-line flag
  numberOfLines?: number; // ✅ Number of lines (if multiline)
  error?: string; // ✅ Error message
  style?: any; // ✅ Custom styles
  icon?: React.ReactNode; // ✅ Optional icon element
}

// Component signature:
export const Input: React.FC<InputProps> = {
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline,
  numberOfLines,
  error,
  style,
  icon,
};
```

### Invalid Props Being Used

❌ **Accessibility Props** - NOT in InputProps interface:

- `accessible`
- `accessibilityLabel`
- `accessibilityHint`
- `accessibilityRole`
- `accessibilityState`
- `accessibilityValue`

### Current Problematic Usage

```typescript
// Found in AyskaCheckInComponent, AyskaDoctorFormComponent:
<Input
  accessible={true}
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email"
  accessibilityRole="text"
  value={email}
  onChangeText={setEmail}
/>
```

### Fix Strategy Options

**Errors Fixed:** ~15 errors  
**Files to Modify:** 2 business components (8 instances total)

**Option A: Remove Accessibility Props (RECOMMENDED)**

```typescript
// Simply remove all accessibility props from Input
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
/>
```

**Option B: Extend InputProps Type**

```typescript
// Add to src/types/AyskaComponentsType.ts
export interface InputProps {
  // ... existing props
  accessible?: boolean;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  accessibilityRole?: string;
  // ... etc
}
```

**Option C: Use AyskaFormFieldComponent Instead**

```typescript
// FormField already wraps Input with proper accessibility
import { AyskaFormFieldComponent } from '@/components/ui/AyskaFormFieldComponent';

<AyskaFormFieldComponent
  label="Email"
  value={email}
  onChangeText={setEmail}
  error={errors.email}
  accessibilityHint="Enter your email address"  // ✅ Supported
/>
```

**Recommendation:** Option A - Remove props (simplest, fastest)

---

## 3. ErrorBoundary Component

### File Location

`src/components/feedback/AyskaErrorBoundaryComponent.tsx`

### Actual API (Props Interface)

```typescript
interface Props {
  children: ReactNode;    // ✅ REQUIRED child components
  fallback?: ReactNode;   // ✅ Optional custom error UI
}

// Component signature:
export const ErrorBoundary: React.FC<Props> = props => {
  const theme = useTheme();
  return <ErrorBoundaryClass {...props} theme={theme} />;
};
```

### Invalid Props Being Used

❌ **`style`** - Does NOT exist in Props  
❌ **`accessibilityHint`** - Does NOT exist in Props

### Current Problematic Usage

```typescript
// Found in 5 business components:
<ErrorBoundary style={style} accessibilityHint={accessibilityHint}>
  <Content />
</ErrorBoundary>
```

### Correct Usage

```typescript
// Option 1: Wrap ErrorBoundary in View for styling
<View style={style} accessibilityHint={accessibilityHint}>
  <ErrorBoundary>
    <Content />
  </ErrorBoundary>
</View>

// Option 2: ErrorBoundary handles its own styling
<ErrorBoundary>
  <View style={style}>
    <Content />
  </View>
</ErrorBoundary>
```

### Fix Strategy

**Errors Fixed:** ~5 errors  
**Files to Modify:** 5 business components

1. Remove `style` prop from ErrorBoundary
2. Remove `accessibilityHint` prop from ErrorBoundary
3. Wrap ErrorBoundary in View if styling/accessibility needed
4. Or move style to child components

---

## 4. EmptyState Component

### File Location

`src/components/feedback/AyskaEmptyStateComponent.tsx`

### Actual API (EmptyStateProps)

```typescript
interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap; // ✅ Optional icon name
  title: string; // ✅ REQUIRED title text
  message: string; // ✅ REQUIRED message text
  actionLabel?: string; // ✅ Optional button label
  onAction?: () => void; // ✅ Optional button handler
}

// Component signature:
export function EmptyState({
  icon = 'file-tray-outline',
  title,
  message,
  actionLabel,
  onAction,
}: EmptyStateProps);
```

### Invalid Props Being Used

❌ **`style`** - Does NOT exist in EmptyStateProps  
❌ **`actionText`** - Should be `actionLabel`

### Current Problematic Usage

```typescript
// Found in AyskaDoctorListComponent, AyskaNotificationListComponent:
<EmptyState
  title="No doctors found"
  message="Try adjusting your search"
  actionText="Add Doctor"  // ❌ Should be actionLabel
  onAction={handleAdd}
  style={customStyle}      // ❌ Not accepted
/>
```

### Correct Usage

```typescript
// Fixed version:
<EmptyState
  icon="people-outline"
  title="No doctors found"
  message="Try adjusting your search"
  actionLabel="Add Doctor"  // ✅ Correct prop name
  onAction={handleAdd}
/>

// If styling needed:
<View style={customStyle}>
  <EmptyState
    title="No doctors found"
    message="Try adjusting your search"
    actionLabel="Add Doctor"
    onAction={handleAdd}
  />
</View>
```

### Fix Strategy

**Errors Fixed:** ~3 errors  
**Files to Modify:** 2 business components

1. Rename `actionText` → `actionLabel`
2. Remove `style` prop
3. Wrap in View if custom styling needed

---

## Summary of Fixes by Component

| Component         | Invalid Props                 | Valid Props                                     | Errors  | Files Affected |
| ----------------- | ----------------------------- | ----------------------------------------------- | ------- | -------------- |
| **Skeleton**      | `count`, `accessibilityHint`  | `width`, `height`, `borderRadius`, `style`      | ~7      | 5              |
| **Input**         | Accessibility props (8 types) | `label`, `value`, `onChangeText`, `error`, etc. | ~15     | 2              |
| **ErrorBoundary** | `style`, `accessibilityHint`  | `children`, `fallback`                          | ~5      | 5              |
| **EmptyState**    | `style`, `actionText`         | `title`, `message`, `actionLabel`, `onAction`   | ~3      | 2              |
| **TOTAL**         | -                             | -                                               | **~30** | **9 unique**   |

---

## Implementation Priority

### Priority 1: Skeleton Fixes (EASIEST)

**Impact:** 7 errors  
**Effort:** LOW  
**Why:** Simple prop removal + use pre-built skeletons

```typescript
// Before:
<Skeleton count={5} height={100} />

// After:
<ListItemSkeleton />  // or manual array mapping
```

### Priority 2: Input Fixes (MEDIUM)

**Impact:** 15 errors  
**Effort:** LOW-MEDIUM  
**Why:** Just remove accessibility props (Option A)

```typescript
// Before:
<Input accessible={true} accessibilityLabel="Email" value={email} />

// After:
<Input value={email} onChangeText={setEmail} />
```

### Priority 3: ErrorBoundary Fixes (EASY)

**Impact:** 5 errors  
**Effort:** LOW  
**Why:** Wrap in View or remove props

```typescript
// Before:
<ErrorBoundary style={style}>

// After:
<View style={style}>
  <ErrorBoundary>
```

### Priority 4: EmptyState Fixes (EASIEST)

**Impact:** 3 errors  
**Effort:** VERY LOW  
**Why:** Rename one prop, remove one prop

```typescript
// Before:
<EmptyState actionText="Add" style={style} />

// After:
<EmptyState actionLabel="Add" />
```

---

## Affected Files Breakdown

### Files with Multiple Issues

**AyskaCheckInComponent.tsx:**

- Skeleton: 1 instance (line 207)
- Input: 1 instance (line 321)
- ErrorBoundary: 1 instance (line 216)
  **Total:** 3 fixes

**AyskaDoctorFormComponent.tsx:**

- Skeleton: 1 instance (line 184)
- Input: 7 instances (lines 204, 215, 232, 244, 263, 275, 288)
- ErrorBoundary: 1 instance (line 193)
  **Total:** 9 fixes

**AyskaAnalyticsDashboardComponent.tsx:**

- Skeleton: 1 instance (line 169)
- ErrorBoundary: 1 instance (line 178)
  **Total:** 2 fixes

**AyskaDoctorListComponent.tsx:**

- Skeleton: 1 instance (line 141)
- ErrorBoundary: 1 instance (line 163)
- EmptyState: 1 instance (line 155)
  **Total:** 3 fixes

**AyskaNotificationListComponent.tsx:**

- Skeleton: 1 instance (line 266)
- ErrorBoundary: 1 instance (line 286)
- EmptyState: 1 instance (line 280)
  **Total:** 3 fixes

---

## Next Steps (Phase 3-7)

1. **Phase 3:** Fix all Skeleton errors (7 errors) → 124 remaining
2. **Phase 4:** Fix all Input errors (15 errors) → 109 remaining
3. **Phase 5:** Fix exactOptionalPropertyTypes (25 errors) → 84 remaining
4. **Phase 6:** Fix FormValidator API (10 errors) → 74 remaining
5. **Phase 7:** Fix ErrorBoundary/EmptyState (8 errors) → 66 remaining

**Estimated Total Impact:** ~30 errors from component API fixes alone

---

## Conclusion

All component API mismatches stem from:

1. **Missing type awareness** - Not checking actual prop interfaces
2. **Assumption-based usage** - Assuming props exist without verification
3. **Accessibility over-application** - Adding accessibility to components that handle it internally

**Resolution Strategy:** Systematic prop removal/renaming based on actual component APIs documented above.

**Success Criteria:**

- ✅ All component APIs documented
- ✅ All invalid prop usages identified
- ✅ Fix strategies defined
- ✅ Priority order established
- ⏭️ Ready for Phase 3 implementation

---

**Investigation Complete:** October 23, 2025  
**Next Phase:** Phase 3 - Fix Skeleton Component Errors
