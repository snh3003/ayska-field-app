import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaLabelProps } from '../../types';

export const AyskaLabelComponent: React.FC<AyskaLabelProps> = ({
  children,
  variant = 'default',
  required = false,
  color = 'text',
  htmlFor,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map variant to Typography system
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          fontSize: 14,
          lineHeight: 20,
          textTransform: 'none' as const,
        };
      case 'uppercase':
        return {
          fontSize: 14,
          lineHeight: 20,
          textTransform: 'uppercase' as const,
          letterSpacing: 0.5,
        };
      case 'small':
        return {
          fontSize: 12,
          lineHeight: 16,
          textTransform: 'none' as const,
        };
      default:
        return {
          fontSize: 14,
          lineHeight: 20,
          textTransform: 'none' as const,
        };
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
      case 'error':
        return theme.error;
      default:
        return theme.text;
    }
  };

  const variantStyles = getVariantStyles();
  const colorToken = getColorToken();

  return (
    <TamaguiView
      flexDirection="row"
      alignItems="center"
      style={style}
      {...getA11yProps(accessibilityLabel)}
    >
      <TamaguiText color={colorToken} style={variantStyles} nativeID={htmlFor}>
        {children}
      </TamaguiText>
      {required && (
        <TamaguiText color={theme.error} fontSize={14} marginLeft="$xs">
          *
        </TamaguiText>
      )}
    </TamaguiView>
  );
};
