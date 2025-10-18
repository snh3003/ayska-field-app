import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaSearchBarProps } from '../../types';

export const AyskaSearchBarComponent: React.FC<AyskaSearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onClear,
  placeholder = 'Search...',
  disabled = false,
  showClearButton = true,
  showSearchButton = false,
  size = 'md',
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const handleSearch = () => {
    hapticFeedback.light();
    onSearch?.(value);
  };

  const handleClear = () => {
    hapticFeedback.light();
    onChange?.('');
    onClear?.();
  };

  const handleSubmit = () => {
    if (onSearch) {
      hapticFeedback.light();
      onSearch(value);
    }
  };

  // Size styling
  const sizeStyles = {
    sm: {
      height: 36,
      paddingHorizontal: 12,
      fontSize: 14,
      iconSize: 16,
    },
    md: {
      height: 44,
      paddingHorizontal: 16,
      fontSize: 16,
      iconSize: 20,
    },
    lg: {
      height: 52,
      paddingHorizontal: 20,
      fontSize: 18,
      iconSize: 24,
    },
  };

  const currentSize = sizeStyles[size];

  // Search bar container styles
  const containerStyles = {
    borderWidth: 1,
    borderColor: isFocused ? theme.primary : theme.border,
    borderRadius: 8,
    backgroundColor: disabled ? theme.background : theme.card,
    opacity: disabled ? 0.6 : 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    height: currentSize.height,
    ...style,
  };

  // Input styles
  const inputStyles = {
    flex: 1,
    paddingHorizontal: currentSize.paddingHorizontal,
    fontSize: currentSize.fontSize,
    color: theme.text,
  };

  return (
    <AyskaStackComponent
      direction="horizontal"
      spacing="xs"
      align="center"
      style={containerStyles}
    >
      {/* Search Icon */}
      <AyskaStackComponent
        direction="horizontal"
        align="center"
        style={{ paddingLeft: 12 }}
      >
        <AyskaIconComponent
          name="search"
          size={currentSize.iconSize}
          color="textSecondary"
        />
      </AyskaStackComponent>

      {/* Text Input */}
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onSubmitEditing={handleSubmit}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        editable={!disabled}
        returnKeyType="search"
        {...getA11yProps(
          accessibilityLabel || 'Search input',
          accessibilityHint,
          'text'
        )}
      />

      {/* Clear Button */}
      {showClearButton && value && (
        <TouchableOpacity
          onPress={handleClear}
          style={{ padding: 8 }}
          {...getA11yProps('Clear search', 'Clear the search input', 'button')}
        >
          <AyskaIconComponent
            name="close-circle"
            size={currentSize.iconSize}
            color="textSecondary"
          />
        </TouchableOpacity>
      )}

      {/* Search Button */}
      {showSearchButton && (
        <TouchableOpacity
          onPress={handleSearch}
          style={{ padding: 8 }}
          {...getA11yProps('Search', 'Perform search', 'button')}
        >
          <AyskaIconComponent
            name="arrow-forward"
            size={currentSize.iconSize}
            color="primary"
          />
        </TouchableOpacity>
      )}
    </AyskaStackComponent>
  );
};
