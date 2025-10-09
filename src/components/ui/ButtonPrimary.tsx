import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';
import { getButtonA11yProps } from '@/utils/accessibility';

interface ButtonPrimaryProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  style?: any;
  accessibilityHint?: string;
}

export const ButtonPrimary: React.FC<ButtonPrimaryProps> = ({ 
  title, 
  onPress, 
  disabled, 
  loading,
  style,
  accessibilityHint 
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handlePress = () => {
    hapticFeedback.light();
    onPress();
  };
  
  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        { 
          backgroundColor: theme.primary,
          opacity: (disabled || loading) ? 0.6 : 1 
        },
        style
      ]}
      activeOpacity={0.8}
      {...getButtonA11yProps(title, accessibilityHint, disabled || loading)}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <Text style={[styles.text, Typography.button]}>
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
  },
  text: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
});


