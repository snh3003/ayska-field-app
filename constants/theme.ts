/**
 * Modern, minimal design system with elegant Light and Dark modes
 * Colors complement Ayska logo: Dark Blue "Ay" + Dark Red "ska"
 */

import { Platform } from 'react-native';

// Brand Color Palette - Complementing Ayska Logo
const primaryBlue = '#1E40AF'; // Dark blue matching "Ay"
const primaryRed = '#B91C1C'; // Dark red matching "ska"
const secondaryTeal = '#0891B2'; // Complementary cyan
const accentPurple = '#7C3AED'; // Accent color
const lightBg = '#F9FAFB'; // Soft white
const darkBg = '#0F172A'; // Deep navy
const textDark = '#1E293B';
const textLight = '#F1F5F9';

export const Colors = {
  light: {
    text: textDark,
    textSecondary: '#64748B',
    background: lightBg,
    tint: primaryBlue,
    icon: '#64748B',
    tabIconDefault: '#5A6B7D',
    tabIconSelected: primaryBlue,
    primary: primaryBlue,
    primaryRed: primaryRed,
    secondary: secondaryTeal,
    accent: accentPurple,
    card: '#FFFFFF',
    cardShadow: 'rgba(30, 64, 175, 0.08)', // Blue tint shadow
    border: '#E2E8F0',
    success: '#059669',
    warning: '#D97706',
    error: primaryRed,
    info: '#0891B2',
    overlay: 'rgba(15, 23, 42, 0.5)',
    // Semantic background colors for icons and surfaces
    primaryBg: 'rgba(30, 64, 175, 0.15)',
    secondaryBg: 'rgba(8, 145, 178, 0.15)',
    successBg: 'rgba(5, 150, 105, 0.15)',
    warningBg: 'rgba(217, 119, 6, 0.15)',
    infoBg: 'rgba(8, 145, 178, 0.15)',
    errorBg: 'rgba(185, 28, 28, 0.15)',
    iconBg: 'rgba(90, 107, 125, 0.15)',
    avatarBg: '#E0E7FF',
  },
  dark: {
    text: textLight,
    textSecondary: '#94A3B8',
    background: darkBg,
    tint: '#60A5FA', // Lighter blue for dark mode
    icon: '#94A3B8',
    tabIconDefault: '#A1AEC0',
    tabIconSelected: '#60A5FA',
    primary: '#60A5FA', // Lighter blue for visibility
    primaryRed: '#EF4444', // Lighter red for visibility
    secondary: '#06B6D4', // Lighter cyan
    accent: '#A78BFA', // Lighter purple
    card: '#1E293B',
    cardShadow: 'rgba(0, 0, 0, 0.4)',
    border: '#334155',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    overlay: 'rgba(0, 0, 0, 0.7)',
    // Semantic background colors for icons and surfaces
    primaryBg: 'rgba(96, 165, 250, 0.20)',
    secondaryBg: 'rgba(6, 182, 212, 0.20)',
    successBg: 'rgba(16, 185, 129, 0.20)',
    warningBg: 'rgba(245, 158, 11, 0.20)',
    infoBg: 'rgba(6, 182, 212, 0.20)',
    errorBg: 'rgba(239, 68, 68, 0.20)',
    iconBg: 'rgba(161, 174, 192, 0.20)',
    avatarBg: '#334155',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Typography System
export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600' as const,
    lineHeight: 32,
  },
  h4: {
    fontSize: 20,
    fontWeight: '600' as const,
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
  bodyLarge: {
    fontSize: 18,
    fontWeight: '400' as const,
    lineHeight: 26,
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: '400' as const,
    lineHeight: 20,
  },
  caption: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 24,
  },
};

// Spacing System
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Border Radius
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Shadows
export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 8,
  },
};
