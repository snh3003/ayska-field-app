import React from 'react';
import { ActivityIndicator } from 'react-native';
import { hapticFeedback } from '@/utils/haptics';
import { getButtonA11yProps } from '@/utils/accessibility';
import { Button as TamaguiButton } from '@tamagui/button';
import { AyskaTextComponent } from './AyskaTextComponent';
import { ButtonPrimaryProps } from '../../types';

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
      {...(getButtonA11yProps(
        title,
        accessibilityHint,
        disabled || loading
      ) as any)}
    >
      {loading ? (
        <ActivityIndicator color="white" />
      ) : (
        <AyskaTextComponent color="text" weight="semibold" align="center">
          {title}
        </AyskaTextComponent>
      )}
    </TamaguiButton>
  );
};
