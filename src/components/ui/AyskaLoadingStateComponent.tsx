import React from 'react';
import { ActivityIndicator } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaLoadingStateProps } from '../../types';

export const AyskaLoadingStateComponent: React.FC<AyskaLoadingStateProps> = ({
  message = 'Loading...',
  variant = 'inline',
  size = 'large',
  color = 'primary',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  // Size mapping
  const sizeMap = {
    small: 20,
    medium: 30,
    large: 40,
  };

  // Color mapping
  const colorMap = {
    primary: theme.primary,
    secondary: theme.textSecondary,
    success: theme.success,
    warning: theme.warning,
    error: theme.error,
    text: theme.text,
  };

  const indicatorSize = sizeMap[size];
  const indicatorColor = colorMap[color];

  // Variant styling
  const variantStyles = {
    inline: {
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      justifyContent: 'flex-start' as const,
      padding: 0,
    },
    centered: {
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: 20,
    },
    fullscreen: {
      flex: 1,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      padding: 40,
      backgroundColor: theme.overlay,
    },
    overlay: {
      position: 'absolute' as const,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      flexDirection: 'column' as const,
      alignItems: 'center' as const,
      justifyContent: 'center' as const,
      backgroundColor: theme.overlay,
      zIndex: 1000,
    },
  };

  const currentVariant = variantStyles[variant];

  const containerStyles = {
    ...currentVariant,
    ...style,
  };

  const content = (
    <AyskaStackComponent
      direction={variant === 'inline' ? 'horizontal' : 'vertical'}
      spacing={variant === 'inline' ? 'sm' : 'md'}
      align="center"
      justify="center"
      style={containerStyles}
      {...getA11yProps(
        accessibilityLabel || message,
        accessibilityHint,
        'text'
      )}
    >
      <ActivityIndicator size={indicatorSize} color={indicatorColor} />
      {message && (
        <AyskaTextComponent
          variant="body"
          color="textSecondary"
          align={variant === 'inline' ? 'left' : 'center'}
        >
          {message}
        </AyskaTextComponent>
      )}
    </AyskaStackComponent>
  );

  return content;
};
