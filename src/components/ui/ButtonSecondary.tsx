import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonSecondaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
}

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({ 
  title, 
  onPress, 
  disabled, 
  loading,
  style 
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { 
          borderColor: theme.primary,
          opacity: (disabled || loading) ? 0.6 : 1 
        },
        style
      ]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <Text style={[styles.text, Typography.button, { color: theme.primary }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  text: {
    textAlign: 'center',
  },
});


