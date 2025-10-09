/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

// Brand palette: dark blue and dark red
const brandBlue = '#0B3A6E';
const brandRed = '#8B0D1A';
const brandBlueLight = '#164E89';
const brandRedLight = '#B21626';
const surfaceLight = '#F7F8FB';
const surfaceDark = '#0F1114';
const textLight = '#0F172A';
const textDark = '#E5E7EB';

export const Colors = {
  light: {
    text: textLight,
    background: surfaceLight,
    tint: brandBlueLight,
    icon: '#6B7280',
    tabIconDefault: '#6B7280',
    tabIconSelected: brandBlueLight,
    primary: brandBlue,
    secondary: brandRedLight,
    card: '#FFFFFF',
    border: '#E5E7EB',
  },
  dark: {
    text: textDark,
    background: surfaceDark,
    tint: brandRed,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: brandRed,
    primary: brandRed,
    secondary: brandBlueLight,
    card: '#0B0F14',
    border: '#1F2937',
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
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
