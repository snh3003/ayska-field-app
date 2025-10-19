import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaTextProps } from '../../types';

export const AyskaTextComponent: React.FC<AyskaTextProps> = ({
  children,
  variant = 'body',
  weight = 'normal',
  color = 'text',
  align = 'left',
  numberOfLines,
  leadingIcon,
  trailingIcon,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map variants to Typography system
  const getVariantStyles = () => {
    switch (variant) {
      case 'body':
        return {
          fontSize: 16,
          lineHeight: 24,
        };
      case 'bodyLarge':
        return {
          fontSize: 18,
          lineHeight: 28,
        };
      case 'bodySmall':
        return {
          fontSize: 14,
          lineHeight: 20,
        };
      default:
        return {
          fontSize: 16,
          lineHeight: 24,
        };
    }
  };

  // Map weight to font weight
  const getWeightStyles = () => {
    switch (weight) {
      case 'normal':
        return { fontWeight: '400' };
      case 'medium':
        return { fontWeight: '500' };
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      default:
        return { fontWeight: '400' };
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

  const variantStyles = getVariantStyles();
  const weightStyles = getWeightStyles();
  const colorToken = getColorToken();

  // If no icons, render simple text
  if (!leadingIcon && !trailingIcon) {
    return (
      <TamaguiText
        color={colorToken}
        textAlign={align}
        numberOfLines={numberOfLines}
        style={[variantStyles, weightStyles, style]}
        {...getA11yProps(accessibilityLabel)}
      >
        {children}
      </TamaguiText>
    );
  }

  // Render text with icons
  return (
    <TamaguiView
      flexDirection="row"
      alignItems="center"
      justifyContent={
        align === 'center'
          ? 'center'
          : align === 'right'
            ? 'flex-end'
            : 'flex-start'
      }
      style={style}
      {...getA11yProps(accessibilityLabel)}
    >
      {leadingIcon && (
        <TamaguiView marginRight="$xs">{leadingIcon}</TamaguiView>
      )}

      <TamaguiText
        color={colorToken}
        textAlign={align}
        numberOfLines={numberOfLines}
        style={[variantStyles, weightStyles]}
      >
        {children}
      </TamaguiText>

      {trailingIcon && (
        <TamaguiView marginLeft="$xs">{trailingIcon}</TamaguiView>
      )}
    </TamaguiView>
  );
};
