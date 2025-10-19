import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaTitleComponent } from './AyskaTitleComponent';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaStatusIndicatorProps } from '../../types';

export const AyskaStatusIndicatorComponent: React.FC<
  AyskaStatusIndicatorProps
> = ({
  status,
  message,
  title,
  dismissible = false,
  onDismiss,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  // Status styling
  const statusStyles = {
    success: {
      backgroundColor: theme.successBg,
      borderColor: theme.success,
      iconName: 'checkmark-circle' as const,
      iconColor: 'success' as const,
      titleColor: 'primary' as const,
      messageColor: 'text' as const,
    },
    warning: {
      backgroundColor: theme.warningBg,
      borderColor: theme.warning,
      iconName: 'warning' as const,
      iconColor: 'warning' as const,
      titleColor: 'primary' as const,
      messageColor: 'text' as const,
    },
    error: {
      backgroundColor: theme.errorBg,
      borderColor: theme.error,
      iconName: 'close-circle' as const,
      iconColor: 'error' as const,
      titleColor: 'primary' as const,
      messageColor: 'text' as const,
    },
    info: {
      backgroundColor: theme.infoBg,
      borderColor: theme.info,
      iconName: 'information-circle' as const,
      iconColor: 'info' as const,
      titleColor: 'primary' as const,
      messageColor: 'text' as const,
    },
  };

  const currentStatus = statusStyles[status];

  const handleDismiss = () => {
    hapticFeedback.light();
    onDismiss?.();
  };

  const containerStyles = {
    backgroundColor: currentStatus.backgroundColor,
    borderWidth: 1,
    borderColor: currentStatus.borderColor,
    borderRadius: 8,
    padding: 16,
    ...style,
  };

  return (
    <AyskaStackComponent
      direction="horizontal"
      spacing="md"
      align="start"
      style={containerStyles}
      {...getA11yProps(
        accessibilityLabel || message,
        accessibilityHint,
        'text'
      )}
    >
      {/* Status Icon */}
      <AyskaStackComponent
        direction="horizontal"
        align="center"
        style={{ marginTop: 2 }}
      >
        <AyskaIconComponent
          name={currentStatus.iconName}
          size={20}
          color={currentStatus.iconColor}
        />
      </AyskaStackComponent>

      {/* Content */}
      <AyskaStackComponent
        direction="vertical"
        spacing="xs"
        style={{ flex: 1 }}
      >
        {title && (
          <AyskaTitleComponent
            level={4}
            color={currentStatus.titleColor}
            weight="semibold"
          >
            {title}
          </AyskaTitleComponent>
        )}
        <AyskaTextComponent variant="body" color={currentStatus.messageColor}>
          {message}
        </AyskaTextComponent>
      </AyskaStackComponent>

      {/* Dismiss Button */}
      {dismissible && (
        <TouchableOpacity
          onPress={handleDismiss}
          style={{ padding: 4 }}
          {...getA11yProps('Dismiss', 'Dismiss this message', 'button')}
        >
          <AyskaIconComponent name="close" size={16} color="textSecondary" />
        </TouchableOpacity>
      )}
    </AyskaStackComponent>
  );
};
