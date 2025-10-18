import React, { useEffect } from 'react';
import { Animated, TouchableOpacity } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaToastProps } from '../../types';

export const AyskaToastComponent: React.FC<AyskaToastProps> = ({
  message,
  type = 'info',
  visible = false,
  duration = 4000,
  position = 'top',
  onDismiss,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const fadeAnim = new Animated.Value(visible ? 1 : 0);
  const slideAnim = new Animated.Value(visible ? 0 : -100);

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss
      if (duration > 0) {
        const timer = setTimeout(() => {
          handleDismiss();
        }, duration);

        return () => clearTimeout(timer);
      }
    } else {
      // Hide animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: position === 'top' ? -100 : 100,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }

    return undefined;
  }, [visible, duration, position]);

  const handleDismiss = () => {
    hapticFeedback.light();
    onDismiss?.();
  };

  // Type styling
  const typeStyles = {
    success: {
      backgroundColor: theme.successBg,
      borderColor: theme.success,
      iconName: 'checkmark-circle' as const,
      iconColor: 'success' as const,
      textColor: 'text' as const,
    },
    warning: {
      backgroundColor: theme.warningBg,
      borderColor: theme.warning,
      iconName: 'warning' as const,
      iconColor: 'warning' as const,
      textColor: 'text' as const,
    },
    error: {
      backgroundColor: theme.errorBg,
      borderColor: theme.error,
      iconName: 'close-circle' as const,
      iconColor: 'error' as const,
      textColor: 'text' as const,
    },
    info: {
      backgroundColor: theme.infoBg,
      borderColor: theme.info,
      iconName: 'information-circle' as const,
      iconColor: 'info' as const,
      textColor: 'text' as const,
    },
  };

  const currentType = typeStyles[type];

  // Position styling
  const positionStyles = {
    top: {
      top: 50,
      left: 20,
      right: 20,
    },
    bottom: {
      bottom: 50,
      left: 20,
      right: 20,
    },
    center: {
      top: '50%',
      left: 20,
      right: 20,
      transform: [{ translateY: -25 }],
    },
  };

  const containerStyles = {
    position: 'absolute' as const,
    ...positionStyles[position],
    backgroundColor: currentType.backgroundColor,
    borderWidth: 1,
    borderColor: currentType.borderColor,
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 1000,
    ...style,
  };

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={[
        containerStyles,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handleDismiss}
        activeOpacity={0.8}
        {...getA11yProps(
          accessibilityLabel || message,
          accessibilityHint,
          'button'
        )}
      >
        <AyskaStackComponent direction="horizontal" spacing="md" align="center">
          {/* Type Icon */}
          <AyskaIconComponent
            name={currentType.iconName}
            size={20}
            color={currentType.iconColor}
          />

          {/* Message */}
          <AyskaTextComponent
            variant="body"
            color={currentType.textColor}
            style={{ flex: 1 }}
          >
            {message}
          </AyskaTextComponent>

          {/* Dismiss Icon */}
          <AyskaIconComponent name="close" size={16} color="textSecondary" />
        </AyskaStackComponent>
      </TouchableOpacity>
    </Animated.View>
  );
};
