# 📁 Folder Restructure Plan

## 🚨 Current Problems

### Duplicate Component Folders
```
/components/           # New components (created recently)
  - Logo.tsx
  - ThemeToggle.tsx
  - Toast.tsx
  - SearchBar.tsx
  - etc...

/src/components/ui/    # Original UI components
  - ButtonPrimary.tsx
  - Card.tsx
  - Input.tsx
  - etc...
```

### Issues:
- ❌ Confusing import paths
- ❌ Components scattered across folders
- ❌ No clear organization
- ❌ Hard to maintain

## 🎯 Proposed Solution

### Single, Well-Organized Components Structure
```
/src/components/
  /ui/                    # Base UI components
    - ButtonPrimary.tsx
    - ButtonSecondary.tsx
    - Card.tsx
    - Input.tsx
    - StatsCard.tsx
    - LoadingSpinner.tsx
    - etc...

  /layout/                # Layout components
    - Header.tsx
    - Logo.tsx
    - ThemeToggle.tsx

  /feedback/              # User feedback components
    - Toast.tsx
    - ErrorBoundary.tsx
    - EmptyState.tsx
    - SkeletonLoader.tsx

  /forms/                 # Form-related components
    - SearchBar.tsx
    - Input.tsx (if form-specific)

  /navigation/            # Navigation components
    - BottomSheet.tsx
    - SwipeableCard.tsx

  /business/              # Business logic components
    - DoctorCard.tsx
    - EmployeeCard.tsx
    - ActivityCard.tsx
    - TeamCard.tsx
```

## 📋 Migration Plan

### Step 1: Create New Structure
```bash
mkdir -p src/components/{ui,layout,feedback,forms,navigation,business}
```

### Step 2: Move Components
```bash
# Move from root /components/ to /src/components/
mv components/Logo.tsx src/components/layout/
mv components/ThemeToggle.tsx src/components/layout/
mv components/Toast.tsx src/components/feedback/
mv components/ErrorBoundary.tsx src/components/feedback/
mv components/EmptyState.tsx src/components/feedback/
mv components/SkeletonLoader.tsx src/components/feedback/
mv components/SearchBar.tsx src/components/forms/
mv components/BottomSheet.tsx src/components/navigation/
mv components/SwipeableCard.tsx src/components/navigation/

# Move from /src/components/ui/ to /src/components/ui/
# (already in correct location)
```

### Step 3: Update All Imports
```typescript
// OLD imports
import { Logo } from '../../../components/Logo';
import { Toast } from '../../../components/Toast';

// NEW imports
import { Logo } from '../../components/layout/Logo';
import { Toast } from '../../components/feedback/Toast';
```

### Step 4: Create Index Files
```typescript
// src/components/index.ts
export * from './ui';
export * from './layout';
export * from './feedback';
export * from './forms';
export * from './navigation';
export * from './business';
```

## 🎯 Benefits

### ✅ Clear Organization
- **ui/** - Base UI components (buttons, cards, inputs)
- **layout/** - Layout components (headers, logos, navigation)
- **feedback/** - User feedback (toasts, errors, loading)
- **forms/** - Form components (search, inputs, validation)
- **navigation/** - Navigation (bottom sheets, swipeable)
- **business/** - Business logic (doctor cards, employee cards)

### ✅ Better Imports
```typescript
// Clean, organized imports
import { Logo, ThemeToggle } from '@/components/layout';
import { Toast, ErrorBoundary } from '@/components/feedback';
import { SearchBar } from '@/components/forms';
import { ButtonPrimary, Card } from '@/components/ui';
```

### ✅ Easier Maintenance
- Find components by category
- Clear separation of concerns
- Scalable structure
- No duplication

### ✅ TypeScript Benefits
```typescript
// Auto-completion by category
import { 
  Logo,           // layout
  ThemeToggle,    // layout
  Toast,          // feedback
  SearchBar       // forms
} from '@/components';
```

## 📁 Final Structure

```
/src/
  /components/
    /ui/                    # Base UI components
      - ButtonPrimary.tsx
      - ButtonSecondary.tsx
      - Card.tsx
      - Input.tsx
      - StatsCard.tsx
      - LoadingSpinner.tsx
      - index.ts

    /layout/                # Layout components
      - Header.tsx
      - Logo.tsx
      - ThemeToggle.tsx
      - index.ts

    /feedback/              # User feedback
      - Toast.tsx
      - ErrorBoundary.tsx
      - EmptyState.tsx
      - SkeletonLoader.tsx
      - index.ts

    /forms/                 # Form components
      - SearchBar.tsx
      - index.ts

    /navigation/            # Navigation
      - BottomSheet.tsx
      - SwipeableCard.tsx
      - index.ts

    /business/              # Business logic
      - DoctorCard.tsx
      - EmployeeCard.tsx
      - ActivityCard.tsx
      - TeamCard.tsx
      - index.ts

    index.ts                # Main export

  /screens/                 # Screen components
  /services/                # Business logic
  /hooks/                   # Custom hooks
  /utils/                   # Utilities
  /store/                   # State management
```

## 🚀 Implementation Steps

1. **Create new folder structure**
2. **Move all components to appropriate folders**
3. **Update all import statements**
4. **Create index files for clean exports**
5. **Remove old /components/ folder**
6. **Test all imports work**
7. **Update documentation**

## 📝 Import Examples

### Before (Confusing)
```typescript
import { Logo } from '../../../components/Logo';
import { Toast } from '../../../components/Toast';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
```

### After (Clean)
```typescript
import { Logo, ThemeToggle } from '@/components/layout';
import { Toast, ErrorBoundary } from '@/components/feedback';
import { ButtonPrimary, Card } from '@/components/ui';
```

## 🎯 Result

- ✅ **Single source of truth** for components
- ✅ **Clear organization** by purpose
- ✅ **Easy to find** components
- ✅ **Scalable structure** for growth
- ✅ **Clean imports** with auto-completion
- ✅ **No duplication** or confusion

This structure follows React/React Native best practices and scales well as the app grows!
