import React from 'react';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaTitleComponent } from './AyskaTitleComponent';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaActionButtonComponent } from './AyskaActionButtonComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaEmptyStateProps } from '../../types';

export const AyskaEmptyStateComponent: React.FC<AyskaEmptyStateProps> = ({
  title,
  message,
  icon = 'document-outline',
  actionLabel,
  onAction,
  variant = 'default',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  // Variant styling
  const variantStyles = {
    default: {
      iconSize: 64,
      iconColor: 'textSecondary' as const,
      titleColor: 'text' as const,
      messageColor: 'textSecondary' as const,
      spacing: 'lg' as const,
    },
    minimal: {
      iconSize: 48,
      iconColor: 'textSecondary' as const,
      titleColor: 'text' as const,
      messageColor: 'textSecondary' as const,
      spacing: 'md' as const,
    },
    prominent: {
      iconSize: 80,
      iconColor: 'primary' as const,
      titleColor: 'text' as const,
      messageColor: 'textSecondary' as const,
      spacing: 'xl' as const,
    },
  };

  const currentVariant = variantStyles[variant];

  const containerStyles = {
    flex: 1,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
    padding: 40,
    ...style,
  };

  return (
    <AyskaStackComponent
      direction="vertical"
      spacing={currentVariant.spacing}
      align="center"
      justify="center"
      style={containerStyles}
      {...getA11yProps(
        accessibilityLabel || title || 'Empty state',
        accessibilityHint,
        'text'
      )}
    >
      {/* Icon */}
      <AyskaIconComponent
        name={icon as any}
        size={currentVariant.iconSize}
        color={currentVariant.iconColor}
      />

      {/* Content */}
      <AyskaStackComponent
        direction="vertical"
        spacing="sm"
        align="center"
        style={{ maxWidth: 300 }}
      >
        {title && (
          <AyskaTitleComponent
            level={3}
            color={currentVariant.titleColor}
            weight="semibold"
            align="center"
          >
            {title}
          </AyskaTitleComponent>
        )}

        {message && (
          <AyskaTextComponent
            variant="body"
            color={currentVariant.messageColor}
            align="center"
          >
            {message}
          </AyskaTextComponent>
        )}
      </AyskaStackComponent>

      {/* Action Button */}
      {actionLabel && onAction && (
        <AyskaActionButtonComponent
          label={actionLabel}
          variant="primary"
          onPress={onAction}
        />
      )}
    </AyskaStackComponent>
  );
};
