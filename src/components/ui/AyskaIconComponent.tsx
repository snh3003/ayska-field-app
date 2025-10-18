import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { Ionicons } from '@expo/vector-icons';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaIconProps } from '../../types';

export const AyskaIconComponent: React.FC<AyskaIconProps> = ({
  name,
  size = 'md',
  color = 'text',
  backgroundColor,
  rounded = false,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  // Map size to pixel value
  const getSizeValue = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'md':
        return 20;
      case 'lg':
        return 24;
      case 'xl':
        return 32;
      default:
        return typeof size === 'number' ? size : 20;
    }
  };

  // Map color to theme token
  const getColorToken = () => {
    switch (color) {
      case 'text':
        return theme.text;
      case 'textSecondary':
        return theme.textSecondary;
      case 'primary':
        return theme.primary;
      case 'secondary':
        return theme.secondary;
      case 'success':
        return theme.success;
      case 'warning':
        return theme.warning;
      case 'error':
        return theme.error;
      case 'info':
        return theme.info;
      default:
        return theme.text;
    }
  };

  // Map background color to theme token
  const getBackgroundColorToken = () => {
    if (!backgroundColor) return undefined;

    switch (backgroundColor) {
      case 'primaryBg':
        return theme.primaryBg;
      case 'secondaryBg':
        return theme.secondaryBg;
      case 'successBg':
        return theme.successBg;
      case 'warningBg':
        return theme.warningBg;
      case 'errorBg':
        return theme.errorBg;
      case 'infoBg':
        return theme.infoBg;
      case 'iconBg':
        return theme.iconBg;
      default:
        return undefined;
    }
  };

  const sizeValue = getSizeValue();
  const colorToken = getColorToken();
  const backgroundColorToken = getBackgroundColorToken();

  const handlePress = () => {
    if (onPress) {
      hapticFeedback.light();
      onPress();
    }
  };

  const iconElement = (
    <TamaguiView
      width={sizeValue + 8} // Add padding
      height={sizeValue + 8}
      borderRadius={rounded ? '$full' : '$sm'}
      backgroundColor={backgroundColorToken}
      justifyContent="center"
      alignItems="center"
      style={style}
      {...getA11yProps(accessibilityLabel, accessibilityHint)}
    >
      <Ionicons name={name} size={sizeValue} color={colorToken} />
    </TamaguiView>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={accessibilityLabel}
        accessibilityHint={accessibilityHint}
        accessibilityRole="button"
      >
        {iconElement}
      </TouchableOpacity>
    );
  }

  return iconElement;
};
