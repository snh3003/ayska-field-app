// Component prop interfaces - Centralized component type definitions

import React from 'react';

// UI Component Props
export interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityHint?: string;
}

export interface ButtonSecondaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityHint?: string;
}

export interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (_e: any) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  style?: any;
  icon?: React.ReactNode;
}

export interface DatePickerProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (_date: string) => void;
  onBlur?: () => void;
  error?: string;
  style?: any;
  icon?: React.ReactNode;
  minDate?: string | undefined;
  maxDate?: string | undefined;
}

export interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  variant?: 'default' | 'elevated' | 'outlined';
}

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export interface HeaderProps {
  title: string;
  subtitle?: string;
  onBackPress?: () => void;
  rightComponent?: React.ReactNode;
}

export interface ThemedViewProps {
  lightColor?: string;
  darkColor?: string;
  style?: any;
  children?: React.ReactNode;
}

// Navigation Component Props
export interface SwipeableCardProps {
  children: React.ReactNode;
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  leftAction?: {
    icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
    color: string;
    label: string;
  };
  rightAction?: {
    icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
    color: string;
    label: string;
  };
}

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: number;
}

// Form Component Props
export interface SearchBarProps {
  placeholder?: string;
  onSearch: (_query: string) => void;
  onFilterPress?: () => void;
  showFilter?: boolean;
}

// Feedback Component Props
export interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  onDismiss: () => void;
}

export interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
}

export interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: any;
}

// Layout Component Props
export interface LogoProps {
  size?: number;
  style?: any;
}

// Base Component Props (Phase 1)
export interface AyskaTextProps {
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

export interface AyskaTitleProps {
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

export interface AyskaHeadingProps {
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

export interface AyskaLabelProps {
  children: React.ReactNode;
  variant?: 'default' | 'uppercase' | 'small';
  required?: boolean;
  color?: 'text' | 'textSecondary' | 'primary' | 'error';
  htmlFor?: string;
  style?: any;
  accessibilityLabel?: string;
}

export interface AyskaCaptionProps {
  children: React.ReactNode;
  variant?: 'default' | 'timestamp' | 'helper';
  color?: 'textSecondary' | 'primary' | 'success' | 'warning' | 'error';
  align?: 'left' | 'center' | 'right';
  numberOfLines?: number;
  style?: any;
  accessibilityLabel?: string;
}

export interface AyskaIconProps {
  name: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
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

export interface AyskaBadgeProps {
  children: React.ReactNode;
  variant?: 'solid' | 'outlined' | 'subtle';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  style?: any;
  accessibilityLabel?: string;
}

// Layout Component Props
export interface AyskaStackProps {
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

export interface AyskaGridProps {
  children: React.ReactNode;
  columns?: number;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
  autoFit?: boolean;
  autoFill?: boolean;
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

export interface AyskaContainerProps {
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';
  padding?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  margin?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'none';
  center?: boolean;
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

// Action Component Props
export interface AyskaActionButtonProps {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  onPress?: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AyskaListItemProps {
  title?: string;
  subtitle?: string;
  avatar?: React.ReactNode;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  showDivider?: boolean;
  padding?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Form Component Props
export interface AyskaFormFieldProps {
  label?: string;
  value: string;
  onChange: (_value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  validator?: any; // IValidationRule from validation system
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
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AyskaSearchBarProps {
  value: string;
  onChange: (_value: string) => void;
  onSearch?: (_value: string) => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  showClearButton?: boolean;
  showSearchButton?: boolean;
  size?: 'sm' | 'md' | 'lg';
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

// Feedback Component Props
export interface AyskaStatusIndicatorProps {
  status: 'success' | 'warning' | 'error' | 'info';
  message: string;
  title?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AyskaToastProps {
  message: string;
  type?: 'success' | 'warning' | 'error' | 'info';
  visible?: boolean;
  duration?: number; // 0 = no auto dismiss
  position?: 'top' | 'bottom' | 'center';
  onDismiss?: () => void;
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AyskaLoadingStateProps {
  message?: string;
  variant?: 'inline' | 'centered' | 'fullscreen' | 'overlay';
  size?: 'small' | 'medium' | 'large';
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'text';
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export interface AyskaEmptyStateProps {
  title?: string;
  message?: string;
  icon?: string;
  actionLabel?: string;
  onAction?: () => void;
  variant?: 'default' | 'minimal' | 'prominent';
  style?: any;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}
