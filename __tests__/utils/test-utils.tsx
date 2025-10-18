import React from 'react';
import { render, RenderOptions } from '@testing-library/react-native';

// Mock theme context
const mockTheme = {
  light: {
    text: '#1E293B',
    textSecondary: '#64748B',
    background: '#F9FAFB',
    primary: '#1E40AF',
    secondary: '#0891B2',
    success: '#059669',
    warning: '#D97706',
    error: '#B91C1C',
    card: '#FFFFFF',
    border: '#E2E8F0',
  },
  dark: {
    text: '#F1F5F9',
    textSecondary: '#94A3B8',
    background: '#0F172A',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    card: '#1E293B',
    border: '#334155',
  },
};

// Custom render function with providers
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <>{children}</>;
};

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options });

// Test data builders
export const createTestProps = (overrides = {}) => ({
  children: 'Test content',
  ...overrides,
});

export const createTextProps = (overrides = {}) => ({
  children: 'Test text',
  variant: 'body' as const,
  weight: 'normal' as const,
  color: 'text' as const,
  align: 'left' as const,
  ...overrides,
});

export const createTitleProps = (overrides = {}) => ({
  children: 'Test title',
  level: 3 as const,
  weight: 'semibold' as const,
  color: 'text' as const,
  align: 'left' as const,
  ...overrides,
});

export const createCaptionProps = (overrides = {}) => ({
  children: 'Test caption',
  variant: 'default' as const,
  color: 'textSecondary' as const,
  align: 'left' as const,
  ...overrides,
});

export const createLabelProps = (overrides = {}) => ({
  children: 'Test label',
  variant: 'default' as const,
  required: false,
  color: 'text' as const,
  ...overrides,
});

export const createIconProps = (overrides = {}) => ({
  name: 'home' as const,
  size: 'md' as const,
  color: 'text' as const,
  ...overrides,
});

export const createBadgeProps = (overrides = {}) => ({
  children: 'Test badge',
  variant: 'solid' as const,
  color: 'primary' as const,
  size: 'md' as const,
  ...overrides,
});

// Mock factories
export const mockHapticFeedback = {
  light: jest.fn(),
  medium: jest.fn(),
  heavy: jest.fn(),
  success: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
};

export const mockAccessibility = {
  getA11yProps: jest.fn((label?: string) => ({
    accessible: true,
    accessibilityLabel: label || '',
    accessibilityRole: 'text' as const,
  })),
  getButtonA11yProps: jest.fn(
    (label: string, hint?: string, disabled?: boolean) => ({
      accessible: true,
      accessibilityLabel: label,
      accessibilityHint: hint || '',
      accessibilityRole: 'button' as const,
      accessibilityState: { disabled: disabled || false },
    })
  ),
};

// Theme testing utilities
export const testLightTheme = mockTheme.light;
export const testDarkTheme = mockTheme.dark;

// Accessibility testing utilities
export const getAccessibilityProps = (element: any) => {
  return {
    accessible: element.props.accessible,
    accessibilityLabel: element.props.accessibilityLabel,
    accessibilityRole: element.props.accessibilityRole,
    accessibilityHint: element.props.accessibilityHint,
    accessibilityState: element.props.accessibilityState,
  };
};

// Re-export everything
export * from '@testing-library/react-native';
export { customRender as render };
