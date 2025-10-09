# 🚀 Quick Reference Guide

## 📱 Installation & Setup

### Install Dependencies
```bash
npm install expo-haptics react-native-gesture-handler @react-native-async-storage/async-storage
```

### Run the App
```bash
npx expo start
```

## 🎨 Components

### Toast Notifications
```tsx
import { useToast } from '@/contexts/ToastContext';

const toast = useToast();
toast.success('Success message');
toast.error('Error message');
toast.info('Info message');
toast.warning('Warning message');
```

### Empty States
```tsx
import { EmptyState } from '@/components/EmptyState';

<EmptyState
  icon="people-outline"
  title="No Data"
  message="Nothing to show here"
  actionLabel="Add New"
  onAction={() => {}}
/>
```

### Skeleton Loaders
```tsx
import { ListItemSkeleton, CardSkeleton } from '@/components/SkeletonLoader';

{loading ? <ListItemSkeleton /> : <ActualContent />}
```

### Bottom Sheet
```tsx
import { BottomSheet } from '@/components/BottomSheet';

<BottomSheet
  isVisible={showSheet}
  onClose={() => setShowSheet(false)}
  title="Filter Options"
>
  <YourContent />
</BottomSheet>
```

### Search Bar
```tsx
import { SearchBar } from '@/components/SearchBar';

<SearchBar
  placeholder="Search..."
  onSearch={setSearchQuery}
  showFilter
  onFilterPress={() => setShowFilter(true)}
/>
```

### Swipeable Cards
```tsx
import { SwipeableCard } from '@/components/SwipeableCard';

<SwipeableCard
  onSwipeLeft={handleDelete}
  onSwipeRight={handleArchive}
  leftAction={{ icon: 'trash', color: theme.error, label: 'Delete' }}
  rightAction={{ icon: 'archive', color: theme.primary, label: 'Archive' }}
>
  <YourCardContent />
</SwipeableCard>
```

## 🎣 Custom Hooks

### useAuth
```tsx
import { useAuth } from '@/hooks/useAuth';

const { user, isAuthenticated, isAdmin, logout } = useAuth();
```

### useDoctors
```tsx
import { useDoctors } from '@/hooks/useDoctors';

const { doctors, loading, error, refresh, searchDoctors } = useDoctors(employeeId);
```

### useVisits
```tsx
import { useVisits } from '@/hooks/useVisits';

const { visits, createVisit, completeVisit, filterByStatus } = useVisits(employeeId);
```

## 🔧 Utilities

### Form Validation
```tsx
import { useFormValidation, commonRules } from '@/utils/validation';

const { values, errors, touched, handleChange, handleBlur, validateAll } = useFormValidation(
  { email: '', password: '' },
  {
    email: [{ required: true }, commonRules.email],
    password: [commonRules.password],
  }
);

const onSubmit = () => {
  if (validateAll()) {
    // Form is valid
  }
};
```

### Date Formatting
```tsx
import { 
  formatRelativeTime, 
  formatDate, 
  formatTime,
  getSmartDateLabel 
} from '@/utils/dateTime';

formatRelativeTime('2025-01-09T10:00:00Z'); // "2h ago"
formatDate('2025-01-09'); // "Jan 9, 2025"
formatTime('2025-01-09T14:30:00Z'); // "2:30 PM"
getSmartDateLabel('2025-01-09T14:30:00Z'); // "Today at 2:30 PM"
```

### Haptic Feedback
```tsx
import { hapticFeedback } from '@/utils/haptics';

hapticFeedback.light();     // Light tap
hapticFeedback.medium();    // Medium tap
hapticFeedback.heavy();     // Heavy tap
hapticFeedback.success();   // Success notification
hapticFeedback.error();     // Error notification
hapticFeedback.warning();   // Warning notification
```

### Storage
```tsx
import { storageService } from '@/services/StorageService';

// Save data
await storageService.setItem('key', data);

// Get data
const data = await storageService.getItem('key');

// Cache with expiry
await storageService.cacheData('doctors', doctorsData, 60); // 60 min

// Get cached data
const cached = await storageService.getCachedData('doctors');

// Save drafts
await storageService.saveDraftData('visit', draftData);
```

### Performance
```tsx
import { useDebounce, useThrottle } from '@/utils/performance';

// Debounce search (waits until user stops typing)
const debouncedSearch = useDebounce((query) => {
  searchAPI(query);
}, 500);

// Throttle scroll (limits execution rate)
const throttledScroll = useThrottle(() => {
  loadMore();
}, 1000);
```

### Accessibility
```tsx
import { 
  getButtonA11yProps, 
  getInputA11yProps,
  getHeaderA11yProps 
} from '@/utils/accessibility';

<TouchableOpacity {...getButtonA11yProps('Submit', 'Submits the form')}>
  <Text>Submit</Text>
</TouchableOpacity>

<TextInput {...getInputA11yProps('Email', 'Enter your email', email)} />

<Text {...getHeaderA11yProps('Dashboard', 1)}>Dashboard</Text>
```

## 🎨 UI Components

### Enhanced Buttons
```tsx
import { ButtonPrimary, ButtonSecondary } from '@/components/ui';

<ButtonPrimary 
  title="Submit"
  onPress={handleSubmit}
  loading={isLoading}
  disabled={!isValid}
  accessibilityHint="Double tap to submit"
/>

<ButtonSecondary 
  title="Cancel"
  onPress={handleCancel}
/>
```

### Enhanced Input
```tsx
import { Input } from '@/components/ui/Input';

<Input
  placeholder="Email"
  value={email}
  onChangeText={setEmail}
  onBlur={() => handleBlur('email')}
  icon="mail-outline"
  keyboardType="email-address"
  autoCapitalize="none"
  error={errors.email}
/>
```

### Stats Card
```tsx
import { StatsCard } from '@/components/ui/StatsCard';

<StatsCard
  icon={<Ionicons name="people" size={24} color={theme.primary} />}
  title="Total Users"
  value="1,234"
  subtitle="+12% from last month"
  color="primary"
/>
```

### Card Variants
```tsx
import { Card } from '@/components/ui/Card';

<Card variant="default">Default Card</Card>
<Card variant="elevated">Elevated Card</Card>
<Card variant="outlined">Outlined Card</Card>
```

## 🔄 Pull to Refresh
```tsx
import { RefreshControl } from 'react-native';

<ScrollView
  refreshControl={
    <RefreshControl
      refreshing={loading}
      onRefresh={handleRefresh}
      tintColor={theme.primary}
      colors={[theme.primary]}
    />
  }
>
  {/* Content */}
</ScrollView>
```

## 🌈 Theme
```tsx
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

const colorScheme = useColorScheme();
const theme = Colors[colorScheme];

// Use theme colors
<View style={{ backgroundColor: theme.background }}>
  <Text style={{ color: theme.text }}>Hello</Text>
</View>
```

## 🎯 Common Patterns

### Loading State
```tsx
{loading ? (
  <ListItemSkeleton />
) : data.length === 0 ? (
  <EmptyState
    icon="inbox-outline"
    title="No Data"
    message="Nothing to show"
  />
) : (
  data.map(item => <ItemCard key={item.id} item={item} />)
)}
```

### Form with Validation
```tsx
const {
  values,
  errors,
  touched,
  handleChange,
  handleBlur,
  validateAll,
} = useFormValidation(
  { email: '', password: '' },
  {
    email: [{ required: true }, commonRules.email],
    password: [commonRules.password],
  }
);

const onSubmit = async () => {
  if (!validateAll()) {
    toast.error('Please fix the errors');
    return;
  }

  try {
    await submitForm(values);
    hapticFeedback.success();
    toast.success('Form submitted!');
  } catch (error) {
    hapticFeedback.error();
    toast.error('Something went wrong');
  }
};

return (
  <>
    <Input
      value={values.email}
      onChangeText={(text) => handleChange('email', text)}
      onBlur={() => handleBlur('email')}
      error={touched.email ? errors.email : undefined}
    />
    <ButtonPrimary title="Submit" onPress={onSubmit} />
  </>
);
```

### API Call with Loading & Error
```tsx
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const toast = useToast();

const fetchData = async () => {
  try {
    setLoading(true);
    const response = await api.getData();
    setData(response);
    
    // Cache the data
    await storageService.cacheData('data', response, 30);
  } catch (error) {
    toast.error('Failed to load data');
    
    // Try to load from cache
    const cached = await storageService.getCachedData('data');
    if (cached) {
      setData(cached);
      toast.info('Showing cached data');
    }
  } finally {
    setLoading(false);
  }
};
```

### Search & Filter
```tsx
const [searchQuery, setSearchQuery] = useState('');
const [showFilter, setShowFilter] = useState(false);

const filteredData = data.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);

return (
  <>
    <SearchBar
      placeholder="Search..."
      onSearch={setSearchQuery}
      showFilter
      onFilterPress={() => setShowFilter(true)}
    />
    
    <BottomSheet
      isVisible={showFilter}
      onClose={() => setShowFilter(false)}
      title="Filter Options"
    >
      {/* Filter controls */}
    </BottomSheet>
    
    {filteredData.map(item => <Item key={item.id} {...item} />)}
  </>
);
```

## 📝 TypeScript Tips

### Component Props
```tsx
interface MyComponentProps {
  title: string;
  count: number;
  onPress?: () => void;
  style?: ViewStyle;
}

const MyComponent: React.FC<MyComponentProps> = ({ title, count, onPress, style }) => {
  // ...
};
```

### Generic Hooks
```tsx
function useData<T>(key: string) {
  const [data, setData] = useState<T[]>([]);
  // ...
  return { data, loading, error };
}
```

## 🐛 Debugging

### Performance Tracking (Dev Only)
```tsx
import { useRenderCount, useRenderTime } from '@/utils/performance';

function MyComponent() {
  useRenderCount('MyComponent');
  useRenderTime('MyComponent');
  // Check console for render stats
}
```

### Error Boundary
```tsx
import { ErrorBoundary } from '@/components/ErrorBoundary';

<ErrorBoundary>
  <MyComponent />
</ErrorBoundary>
```

## 🚀 Ready for Production

Before deploying:
1. ✅ Install all dependencies
2. ✅ Run `npm run lint` - fix any errors
3. ✅ Test on both iOS and Android
4. ✅ Test light and dark modes
5. ✅ Test all form validations
6. ✅ Test offline behavior
7. ✅ Test accessibility with screen reader
8. ✅ Remove any console.logs
9. ✅ Update environment variables
10. ✅ Build and test production bundle

## 📚 File Structure

```
/components
  /ui                    # Base UI components
  SkeletonLoader.tsx     # Loading states
  Toast.tsx              # Notifications
  EmptyState.tsx         # Empty states
  SearchBar.tsx          # Search component
  BottomSheet.tsx        # Bottom sheet modal
  SwipeableCard.tsx      # Swipeable cards
  ThemeToggle.tsx        # Theme switcher
  ErrorBoundary.tsx      # Error handling

/contexts
  ThemeContext.tsx       # Theme provider
  ToastContext.tsx       # Toast provider

/hooks
  useAuth.ts             # Auth hook
  useDoctors.ts          # Doctors hook
  useVisits.ts           # Visits hook
  use-color-scheme.ts    # Theme hook

/utils
  validation.ts          # Form validation
  dateTime.ts            # Date utilities
  haptics.ts             # Haptic feedback
  performance.ts         # Performance utils
  accessibility.ts       # A11y helpers

/services
  StorageService.ts      # Async storage
  LocalDataService.ts    # Local data (replace with API)
```

## 💡 Tips & Tricks

1. **Always show feedback**: Use toast for success/error, haptics for touch
2. **Loading states**: Use skeletons, not spinners
3. **Empty states**: Always provide helpful messages and actions
4. **Form validation**: Validate on blur and on submit
5. **Accessibility**: Use semantic elements and a11y props
6. **Performance**: Debounce search, throttle scroll
7. **Offline**: Cache data, show cached data when offline
8. **Error handling**: Use error boundaries, show user-friendly messages
9. **Type safety**: Use TypeScript, define interfaces
10. **Code reuse**: Create hooks for common logic

---

**Happy Coding! 🎉**

