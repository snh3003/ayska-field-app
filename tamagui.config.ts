import { config } from '@tamagui/config/v3'
import { createTamagui } from '@tamagui/core'

const tamaguiConfig = createTamagui({
  ...config,
  themes: {
    light: {
      // Map existing Colors.light values
      primary: '#1E40AF',
      primaryRed: '#B91C1C', 
      secondary: '#0891B2',
      accent: '#7C3AED',
      background: '#F9FAFB',
      text: '#1E293B',
      textSecondary: '#64748B',
      card: '#FFFFFF',
      border: '#E2E8F0',
      success: '#059669',
      warning: '#D97706',
      error: '#B91C1C',
      info: '#0891B2',
      tint: '#1E40AF',
      icon: '#64748B',
      tabIconDefault: '#94A3B8',
      tabIconSelected: '#1E40AF',
      cardShadow: 'rgba(30, 64, 175, 0.08)',
      shadow: 'rgba(0, 0, 0, 0.1)',
      overlay: 'rgba(15, 23, 42, 0.5)',
      // Additional tokens for Tamagui components
      color: '#1E293B',
      borderColor: '#E2E8F0',
      borderColorHover: '#CBD5E1',
      borderColorFocus: '#1E40AF',
      backgroundHover: '#F1F5F9',
      backgroundPress: '#E2E8F0',
      borderColorPress: '#94A3B8',
    },
    dark: {
      // Map existing Colors.dark values  
      primary: '#60A5FA',
      primaryRed: '#EF4444',
      secondary: '#06B6D4', 
      accent: '#A78BFA',
      background: '#0F172A',
      text: '#F1F5F9',
      textSecondary: '#94A3B8',
      card: '#1E293B',
      border: '#334155',
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#06B6D4',
      tint: '#60A5FA',
      icon: '#94A3B8',
      tabIconDefault: '#64748B',
      tabIconSelected: '#60A5FA',
      cardShadow: 'rgba(0, 0, 0, 0.4)',
      shadow: 'rgba(0, 0, 0, 0.3)',
      overlay: 'rgba(0, 0, 0, 0.7)',
      // Additional tokens for Tamagui components
      color: '#F1F5F9',
      borderColor: '#334155',
      borderColorHover: '#475569',
      borderColorFocus: '#60A5FA',
      backgroundHover: '#1E293B',
      backgroundPress: '#334155',
      borderColorPress: '#64748B',
    }
  },
  tokens: {
    // Map existing Spacing, BorderRadius, Typography
    space: {
      xs: 4,
      sm: 8, 
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    radius: {
      sm: 8,
      md: 12,
      lg: 16,
      xl: 24,
      full: 9999,
    },
    size: {
      xs: 4,
      sm: 8,
      md: 16,
      lg: 24,
      xl: 32,
      xxl: 48,
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 28,
      xxxxl: 32,
    },
    lineHeight: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 26,
      xl: 28,
      xxl: 32,
      xxxl: 36,
      xxxxl: 40,
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    letterSpacing: {
      tight: -0.5,
      normal: 0,
      wide: 0.5,
    }
  }
})

export default tamaguiConfig
