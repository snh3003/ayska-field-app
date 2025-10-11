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

export interface ThemedTextProps {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
  style?: any;
  children?: React.ReactNode;
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
