import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
}

export const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  subtitle, 
  color = 'primary',
  icon 
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const getColor = () => {
    switch (color) {
      case 'secondary':
        return theme.secondary;
      case 'success':
        return theme.success;
      case 'warning':
        return theme.warning;
      case 'info':
        return theme.info;
      default:
        return theme.primary;
    }
  };

  const accentColor = getColor();

  return (
    <View style={[
      styles.container,
      {
        backgroundColor: theme.card,
        borderColor: theme.border,
      },
      Shadows.small
    ]}>
      {icon && (
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
          {icon}
        </View>
      )}
      <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginBottom: Spacing.xs }]}>
        {title}
      </Text>
      <Text style={[Typography.h2, { color: accentColor, marginBottom: subtitle ? Spacing.xs : 0 }]}>
        {value}
      </Text>
      {subtitle && (
        <Text style={[Typography.caption, { color: theme.textSecondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    flex: 1,
    marginHorizontal: Spacing.xs / 2,
    borderWidth: 0,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
});
