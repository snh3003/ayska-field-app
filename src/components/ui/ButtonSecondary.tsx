import React from 'react';
import { Colors } from '@/constants/theme';
import { ActivityIndicator } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';
import { getButtonA11yProps } from '@/utils/accessibility';
import { Button as TamaguiButton } from '@tamagui/button';
import { Text as TamaguiText } from '@tamagui/core';
import { ButtonSecondaryProps } from '../../types';

export const ButtonSecondary: React.FC<ButtonSecondaryProps> = ({
  title,
  onPress,
  disabled,
  loading,
  style,
  accessibilityHint,
}) => {
  const scheme = 'light'; // Default scheme
  const theme = Colors[scheme];

  const handlePress = () => {
    hapticFeedback.light();
    onPress();
  };

  return (
    <TamaguiButton
      backgroundColor="transparent"
      borderColor="$primary"
      borderWidth={1.5}
      color="$primary"
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
      {...(getButtonA11yProps(
        title,
        accessibilityHint,
        disabled || loading
      ) as any)}
    >
      {loading ? (
        <ActivityIndicator color={theme.primary} />
      ) : (
        <TamaguiText
          color="$primary"
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
