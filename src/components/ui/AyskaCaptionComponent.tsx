import React from 'react';
import { Text as TamaguiText } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaCaptionProps } from '../../types';

export const AyskaCaptionComponent: React.FC<AyskaCaptionProps> = ({
  children,
  variant = 'default',
  color = 'textSecondary',
  align = 'left',
  numberOfLines,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map variant to Typography system (all variants use caption size)
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          fontSize: 12,
          lineHeight: 16,
        };
      case 'timestamp':
        return {
          fontSize: 12,
          lineHeight: 16,
          fontStyle: 'italic' as const,
        };
      case 'helper':
        return {
          fontSize: 12,
          lineHeight: 16,
        };
      default:
        return {
          fontSize: 12,
          lineHeight: 16,
        };
    }
  };

  // Map color to theme token
  const getColorToken = () => {
    switch (color) {
      case 'textSecondary':
        return theme.textSecondary;
      case 'primary':
        return theme.primary;
      case 'success':
        return theme.success;
      case 'warning':
        return theme.warning;
      case 'error':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  const variantStyles = getVariantStyles();
  const colorToken = getColorToken();

  return (
    <TamaguiText
      color={colorToken}
      textAlign={align}
      numberOfLines={numberOfLines}
      style={[variantStyles, style]}
      {...getA11yProps(accessibilityLabel)}
    >
      {children}
    </TamaguiText>
  );
};
