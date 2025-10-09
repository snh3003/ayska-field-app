import { Colors, BorderRadius, Spacing, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: any;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({ children, onPress, style, variant = 'default' }) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          ...Shadows.medium,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          borderWidth: 1,
          borderColor: theme.border,
          shadowOpacity: 0,
          elevation: 0,
        };
      default:
        return {
          ...Shadows.small,
          borderWidth: 0,
        };
    }
  };

  const cardStyle = {
    backgroundColor: theme.card,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...getVariantStyle(),
    ...style,
  };

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={cardStyle} activeOpacity={0.7}>
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
};
