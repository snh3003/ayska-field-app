import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaActionButtonProps } from '../../types';

export const AyskaActionButtonComponent: React.FC<AyskaActionButtonProps> = ({
  label,
  icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  onPress,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  // Variant styling
  const variantStyles = {
    primary: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
      textColor: 'text' as const,
      iconColor: 'text' as const,
    },
    secondary: {
      backgroundColor: 'transparent',
      borderColor: theme.primary,
      textColor: 'primary' as const,
      iconColor: 'primary' as const,
    },
    success: {
      backgroundColor: theme.success,
      borderColor: theme.success,
      textColor: 'text' as const,
      iconColor: 'text' as const,
    },
    warning: {
      backgroundColor: theme.warning,
      borderColor: theme.warning,
      textColor: 'text' as const,
      iconColor: 'text' as const,
    },
    error: {
      backgroundColor: theme.error,
      borderColor: theme.error,
      textColor: 'text' as const,
      iconColor: 'text' as const,
    },
    ghost: {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      textColor: 'primary' as const,
      iconColor: 'primary' as const,
    },
  };

  // Size styling
  const sizeStyles = {
    sm: {
      paddingVertical: 8,
      paddingHorizontal: 12,
      textVariant: 'bodySmall' as const,
      iconSize: 16,
      borderRadius: 6,
    },
    md: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      textVariant: 'body' as const,
      iconSize: 20,
      borderRadius: 8,
    },
    lg: {
      paddingVertical: 16,
      paddingHorizontal: 20,
      textVariant: 'bodyLarge' as const,
      iconSize: 24,
      borderRadius: 10,
    },
  };

  const currentVariant = variantStyles[variant];
  const currentSize = sizeStyles[size];

  // Disabled state styling
  const disabledStyles = disabled
    ? {
        backgroundColor: theme.textSecondary,
        borderColor: theme.textSecondary,
        textColor: 'text' as const,
        iconColor: 'text' as const,
      }
    : currentVariant;

  // Loading state styling
  const loadingStyles = loading
    ? {
        backgroundColor: theme.textSecondary,
        borderColor: theme.textSecondary,
        textColor: 'text' as const,
        iconColor: 'text' as const,
      }
    : disabledStyles;

  const handlePress = () => {
    if (disabled || loading) return;

    hapticFeedback.light();
    onPress?.();
  };

  const buttonStyles = {
    backgroundColor: loading
      ? loadingStyles.backgroundColor
      : variantStyles[variant].backgroundColor,
    borderWidth: 1,
    borderColor: loading
      ? loadingStyles.borderColor
      : variantStyles[variant].borderColor,
    borderRadius: currentSize.borderRadius,
    paddingVertical: currentSize.paddingVertical,
    paddingHorizontal: currentSize.paddingHorizontal,
    opacity: disabled ? 0.6 : 1,
    width: fullWidth ? '100%' : 'auto',
    ...style,
  };

  const content = (
    <AyskaStackComponent
      direction="horizontal"
      spacing="xs"
      align="center"
      justify="center"
    >
      {loading ? (
        <AyskaIconComponent
          name="refresh"
          size={currentSize.iconSize}
          color={loadingStyles.iconColor}
        />
      ) : icon ? (
        <AyskaIconComponent
          name={icon as any}
          size={currentSize.iconSize}
          color={
            loading ? loadingStyles.iconColor : variantStyles[variant].iconColor
          }
        />
      ) : null}
      <AyskaTextComponent
        color={
          loading ? loadingStyles.textColor : variantStyles[variant].textColor
        }
        variant={currentSize.textVariant}
        weight="semibold"
      >
        {loading ? 'Loading...' : label}
      </AyskaTextComponent>
    </AyskaStackComponent>
  );

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      {...getA11yProps(
        accessibilityLabel || label,
        accessibilityHint,
        'button'
      )}
    >
      {content}
    </TouchableOpacity>
  );
};
