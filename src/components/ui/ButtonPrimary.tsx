import React from 'react';
import { ActivityIndicator } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';
import { getButtonA11yProps } from '@/utils/accessibility';
import { Button as TamaguiButton } from '@tamagui/button';
import { Text as TamaguiText } from '@tamagui/core';

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
  accessibilityHint,
}) => {
  const handlePress = () => {
    hapticFeedback.light();
    onPress();
  };

  return (
    <TamaguiButton
      backgroundColor="$primary"
      color="white"
      paddingVertical="$md"
      paddingHorizontal="$lg"
      borderRadius="$md"
      alignItems="center"
      justifyContent="center"
      minHeight={48}
      opacity={disabled || loading ? 0.6 : 1}
      disabled={disabled || loading}
      onPress={handlePress}
      style={style}
      {...getButtonA11yProps(title, accessibilityHint, disabled || loading)}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <TamaguiText
          color="white"
          fontSize="$4"
          fontWeight="600"
          textAlign="center"
        >
          {title}
        </TamaguiText>
      )}
    </TamaguiButton>
  );
};
