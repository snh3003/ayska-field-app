import { AccessibilityRole } from 'react-native';
import { A11yProps } from '../src/types';

/**
 * Generate basic accessibility props for any element
 */
export function getA11yProps(
  label?: string,
  hint?: string,
  role?: AccessibilityRole
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label || '',
    accessibilityHint: hint || '',
    accessibilityRole: role || 'text',
  };
}

/**
 * Generate accessibility props for buttons
 */
export function getButtonA11yProps(
  label: string,
  hint?: string,
  disabled?: boolean
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || '',
    accessibilityRole: 'button' as AccessibilityRole,
    accessibilityState: { disabled: disabled || false },
  };
}

/**
 * Generate accessibility props for text inputs
 */
export function getInputA11yProps(
  label: string,
  hint?: string,
  value?: string,
  _required?: boolean
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || '',
    accessibilityRole: 'text',
    accessibilityState: { disabled: false },
    accessibilityValue: { text: value || '' },
  };
}

/**
 * Generate accessibility props for links
 */
export function getLinkA11yProps(label: string, hint?: string): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || '',
    accessibilityRole: 'link',
  };
}

/**
 * Generate accessibility props for headers
 */
export function getHeaderA11yProps(
  text: string,
  _level: number = 1
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: text,
    accessibilityRole: 'header',
  };
}

/**
 * Generate accessibility props for images
 */
export function getImageA11yProps(
  description: string,
  isDecorative = false
): A11yProps {
  if (isDecorative) {
    return {
      accessible: false,
    };
  }

  return {
    accessible: true,
    accessibilityLabel: description,
    accessibilityRole: 'image',
  };
}

/**
 * Generate accessibility props for toggles/switches
 */
export function getToggleA11yProps(
  label: string,
  checked: boolean,
  hint?: string
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || '',
    accessibilityRole: 'switch',
    accessibilityState: { checked },
  };
}

/**
 * Generate accessibility props for cards/touchable items
 */
export function getCardA11yProps(
  label: string,
  hint?: string,
  selected?: boolean
): A11yProps {
  return {
    accessible: true,
    accessibilityLabel: label,
    accessibilityHint: hint || 'Double tap to open',
    accessibilityRole: 'button' as AccessibilityRole,
    accessibilityState: { selected: selected ?? false },
  };
}

/**
 * Announce to screen readers
 */
export function announceForAccessibility(message: string) {
  // This would use AccessibilityInfo.announceForAccessibility in React Native
  // Implementation varies by platform
  // eslint-disable-next-line no-console
  console.log('A11y announcement:', message);
}

/**
 * Format number for screen readers
 */
export function formatNumberA11y(value: number): string {
  return value.toLocaleString();
}

/**
 * Format date for screen readers
 */
export function formatDateA11y(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
