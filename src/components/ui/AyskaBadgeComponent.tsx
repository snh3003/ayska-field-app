import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaBadgeProps } from '../../types';

export const AyskaBadgeComponent: React.FC<AyskaBadgeProps> = ({
  children,
  variant = 'solid',
  color = 'primary',
  size = 'md',
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map size to dimensions and typography
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingHorizontal: '$xs',
          paddingVertical: 2,
          fontSize: 10,
          lineHeight: 14,
          borderRadius: '$xs',
        };
      case 'md':
        return {
          paddingHorizontal: '$sm',
          paddingVertical: '$xs',
          fontSize: 12,
          lineHeight: 16,
          borderRadius: '$sm',
        };
      case 'lg':
        return {
          paddingHorizontal: '$md',
          paddingVertical: '$sm',
          fontSize: 14,
          lineHeight: 20,
          borderRadius: '$md',
        };
      default:
        return {
          paddingHorizontal: '$sm',
          paddingVertical: '$xs',
          fontSize: 12,
          lineHeight: 16,
          borderRadius: '$sm',
        };
    }
  };

  // Map variant and color to styling
  const getVariantStyles = () => {
    const baseStyles = getSizeStyles();

    switch (variant) {
      case 'solid':
        return {
          ...baseStyles,
          backgroundColor: getColorToken(),
          color: 'white',
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: 'transparent',
          borderWidth: 1,
          borderColor: getColorToken(),
          color: getColorToken(),
        };
      case 'subtle':
        return {
          ...baseStyles,
          backgroundColor: getBackgroundColorToken(),
          color: getColorToken(),
        };
      default:
        return {
          ...baseStyles,
          backgroundColor: getColorToken(),
          color: 'white',
        };
    }
  };

  // Map color to theme token
  const getColorToken = () => {
    switch (color) {
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
        return theme.primary;
    }
  };

  // Map color to background color token
  const getBackgroundColorToken = () => {
    switch (color) {
      case 'primary':
        return theme.primaryBg;
      case 'secondary':
        return theme.secondaryBg;
      case 'success':
        return theme.successBg;
      case 'warning':
        return theme.warningBg;
      case 'error':
        return theme.errorBg;
      case 'info':
        return theme.infoBg;
      default:
        return theme.primaryBg;
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <TamaguiView
      style={[variantStyles, style]}
      {...getA11yProps(accessibilityLabel)}
    >
      <TamaguiText
        color={variantStyles.color}
        fontSize={variantStyles.fontSize}
        lineHeight={variantStyles.lineHeight}
        textAlign="center"
        fontWeight="500"
      >
        {children}
      </TamaguiText>
    </TamaguiView>
  );
};
