import React from 'react';
import { TouchableOpacity } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaListItemProps } from '../../types';

export const AyskaListItemComponent: React.FC<AyskaListItemProps> = ({
  title,
  subtitle,
  avatar,
  leading,
  trailing,
  onPress,
  disabled = false,
  showDivider = true,
  padding = 'md',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  // Padding mapping
  const paddingMap = {
    none: 0,
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  };

  const handlePress = () => {
    if (disabled) return;

    hapticFeedback.light();
    onPress?.();
  };

  const listItemStyles = {
    padding: paddingMap[padding],
    opacity: disabled ? 0.6 : 1,
    borderBottomWidth: showDivider ? 1 : 0,
    borderBottomColor: theme.border,
    ...style,
  };

  const content = (
    <AyskaStackComponent
      direction="horizontal"
      spacing="md"
      align="center"
      style={listItemStyles}
    >
      {/* Leading content (avatar or custom leading) */}
      {leading && (
        <AyskaStackComponent direction="horizontal" align="center">
          {leading}
        </AyskaStackComponent>
      )}

      {avatar && !leading && (
        <AyskaStackComponent
          direction="horizontal"
          align="center"
          justify="center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 8,
            backgroundColor: theme.iconBg,
          }}
        >
          {avatar}
        </AyskaStackComponent>
      )}

      {/* Main content */}
      <AyskaStackComponent
        direction="vertical"
        spacing="xs"
        style={{ flex: 1 }}
      >
        {title && (
          <AyskaTextComponent color="text" variant="body" weight="semibold">
            {title}
          </AyskaTextComponent>
        )}
        {subtitle && (
          <AyskaCaptionComponent color="textSecondary">
            {subtitle}
          </AyskaCaptionComponent>
        )}
      </AyskaStackComponent>

      {/* Trailing content */}
      {trailing && (
        <AyskaStackComponent direction="horizontal" align="center">
          {trailing}
        </AyskaStackComponent>
      )}
    </AyskaStackComponent>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        onPress={handlePress}
        disabled={disabled}
        {...getA11yProps(
          accessibilityLabel || title,
          accessibilityHint,
          'button'
        )}
      >
        {content}
      </TouchableOpacity>
    );
  }

  return (
    <AyskaStackComponent
      {...getA11yProps(accessibilityLabel || title, accessibilityHint, 'text')}
    >
      {content}
    </AyskaStackComponent>
  );
};
