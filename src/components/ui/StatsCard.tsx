import { Colors, Typography, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { View as TamaguiView, Text as TamaguiText } from '@tamagui/core'

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
    <TamaguiView 
      backgroundColor="$card"
      borderColor="$border"
      borderRadius="$md"
      padding="$md"
      marginBottom="$md"
      flex={1}
      marginHorizontal="$xs"
      borderWidth={0}
      shadowColor="$shadow"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={0.08}
      shadowRadius={4}
      elevation={2}
    >
      {icon && (
        <TamaguiView 
          width={40}
          height={40}
          borderRadius="$sm"
          justifyContent="center"
          alignItems="center"
          marginBottom="$sm"
          backgroundColor={accentColor + '15'}
        >
          {icon}
        </TamaguiView>
      )}
      <TamaguiText 
        fontSize="$3" 
        color="$textSecondary" 
        marginBottom="$xs"
      >
        {title}
      </TamaguiText>
      <TamaguiText 
        fontSize="$8" 
        fontWeight="700"
        color={accentColor} 
        marginBottom={subtitle ? "$xs" : 0}
      >
        {value}
      </TamaguiText>
      {subtitle && (
        <TamaguiText 
          fontSize="$2" 
          color="$textSecondary"
        >
          {subtitle}
        </TamaguiText>
      )}
    </TamaguiView>
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
