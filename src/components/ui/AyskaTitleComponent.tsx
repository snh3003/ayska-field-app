import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaTitleProps } from '../../types';

export const AyskaTitleComponent: React.FC<AyskaTitleProps> = ({
  children,
  level = 3,
  weight = 'semibold',
  color = 'text',
  align = 'left',
  numberOfLines,
  leadingIcon,
  trailingIcon,
  style,
  accessibilityLabel,
}) => {
  const theme = useTheme();
  // Map level to Typography system
  const getLevelStyles = () => {
    switch (level) {
      case 1:
        return {
          fontSize: 32,
          lineHeight: 40,
          letterSpacing: -0.5,
        };
      case 2:
        return {
          fontSize: 28,
          lineHeight: 36,
          letterSpacing: -0.3,
        };
      case 3:
        return {
          fontSize: 24,
          lineHeight: 32,
        };
      case 4:
        return {
          fontSize: 20,
          lineHeight: 28,
        };
      default:
        return {
          fontSize: 24,
          lineHeight: 32,
        };
    }
  };

  // Map weight to font weight
  const getWeightStyles = () => {
    switch (weight) {
      case 'semibold':
        return { fontWeight: '600' };
      case 'bold':
        return { fontWeight: '700' };
      default:
        return { fontWeight: '600' };
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
      default:
        return theme.text;
    }
  };

  const levelStyles = getLevelStyles();
  const weightStyles = getWeightStyles();
  const colorToken = getColorToken();

  // If no icons, render simple title
  if (!leadingIcon && !trailingIcon) {
    return (
      <TamaguiText
        color={colorToken}
        textAlign={align}
        numberOfLines={numberOfLines}
        style={[levelStyles, weightStyles, style]}
        {...getA11yProps(accessibilityLabel)}
      >
        {children}
      </TamaguiText>
    );
  }

  // Render title with icons
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
        <TamaguiView marginRight="$sm">{leadingIcon}</TamaguiView>
      )}

      <TamaguiText
        color={colorToken}
        textAlign={align}
        numberOfLines={numberOfLines}
        style={[levelStyles, weightStyles]}
      >
        {children}
      </TamaguiText>

      {trailingIcon && (
        <TamaguiView marginLeft="$sm">{trailingIcon}</TamaguiView>
      )}
    </TamaguiView>
  );
};
