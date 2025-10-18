import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaHeadingProps } from '../../types';

export const AyskaHeadingComponent: React.FC<AyskaHeadingProps> = ({
  children,
  variant = 'section',
  weight = 'medium',
  color = 'text',
  align = 'left',
  numberOfLines,
  leadingIcon,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map variant to Typography system
  const getVariantStyles = () => {
    switch (variant) {
      case 'section':
        return {
          fontSize: 20,
          lineHeight: 28,
        };
      case 'card':
        return {
          fontSize: 18,
          lineHeight: 24,
        };
      case 'list':
        return {
          fontSize: 16,
          lineHeight: 20,
        };
      default:
        return {
          fontSize: 20,
          lineHeight: 28,
        };
    }
  };

  // Map weight to font weight
  const getWeightStyles = () => {
    switch (weight) {
      case 'medium':
        return { fontWeight: '500' };
      case 'semibold':
        return { fontWeight: '600' };
      default:
        return { fontWeight: '500' };
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
      default:
        return theme.text;
    }
  };

  const variantStyles = getVariantStyles();
  const weightStyles = getWeightStyles();
  const colorToken = getColorToken();

  // If no icon, render simple heading
  if (!leadingIcon) {
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

  // Render heading with icon
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
      <TamaguiView marginRight="$xs">{leadingIcon}</TamaguiView>

      <TamaguiText
        color={colorToken}
        textAlign={align}
        numberOfLines={numberOfLines}
        style={[variantStyles, weightStyles]}
      >
        {children}
      </TamaguiText>
    </TamaguiView>
  );
};
