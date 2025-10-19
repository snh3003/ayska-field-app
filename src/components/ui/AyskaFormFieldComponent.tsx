import React, { useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { AyskaLabelComponent } from './AyskaLabelComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaIconComponent } from './AyskaIconComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaFormFieldProps } from '../../types';

export const AyskaFormFieldComponent: React.FC<AyskaFormFieldProps> = ({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  validator: _validator, // Mark as unused for now
  error,
  touched,
  required = false,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  showPasswordToggle = false,
  leadingIcon,
  trailingIcon,
  style,
  accessibilityLabel,
  accessibilityHint,
}) => {
  const theme = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onBlur?.();
  };

  const handlePasswordToggle = () => {
    hapticFeedback.light();
    setShowPassword(!showPassword);
  };

  const hasError = error && touched;
  const isPasswordField = secureTextEntry || showPasswordToggle;
  const actualSecureTextEntry = isPasswordField && !showPassword;

  // Input container styles
  const inputContainerStyles = {
    borderWidth: 1,
    borderColor: hasError
      ? theme.error
      : isFocused
        ? theme.primary
        : theme.border,
    borderRadius: 8,
    backgroundColor: disabled ? theme.background : theme.card,
    opacity: disabled ? 0.6 : 1,
    flexDirection: 'row' as const,
    alignItems: 'center' as const,
    minHeight: multiline ? 80 : 48,
    ...style,
  };

  // Input styles
  const inputStyles = {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: theme.text,
    textAlignVertical: multiline ? ('top' as const) : ('center' as const),
  };

  const inputContent = (
    <AyskaStackComponent
      direction="horizontal"
      spacing="xs"
      align="center"
      style={inputContainerStyles}
    >
      {/* Leading Icon */}
      {leadingIcon && (
        <AyskaStackComponent
          direction="horizontal"
          align="center"
          style={{ paddingLeft: 12 }}
        >
          {leadingIcon}
        </AyskaStackComponent>
      )}

      {/* Text Input */}
      <TextInput
        style={inputStyles}
        value={value}
        onChangeText={onChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholder={placeholder}
        placeholderTextColor={theme.textSecondary}
        editable={!disabled}
        multiline={multiline}
        numberOfLines={numberOfLines}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        secureTextEntry={actualSecureTextEntry}
        {...getA11yProps(
          accessibilityLabel || label,
          accessibilityHint,
          'text'
        )}
      />

      {/* Password Toggle */}
      {showPasswordToggle && isPasswordField && (
        <TouchableOpacity
          onPress={handlePasswordToggle}
          style={{ padding: 12 }}
          {...getA11yProps(
            showPassword ? 'Hide password' : 'Show password',
            'Toggle password visibility',
            'button'
          )}
        >
          <AyskaIconComponent
            name={showPassword ? 'eye-off' : 'eye'}
            size={20}
            color="textSecondary"
          />
        </TouchableOpacity>
      )}

      {/* Trailing Icon */}
      {trailingIcon && !showPasswordToggle && (
        <AyskaStackComponent
          direction="horizontal"
          align="center"
          style={{ paddingRight: 12 }}
        >
          {trailingIcon}
        </AyskaStackComponent>
      )}
    </AyskaStackComponent>
  );

  return (
    <AyskaStackComponent direction="vertical" spacing="xs">
      {/* Label */}
      {label && (
        <AyskaLabelComponent
          required={required}
          color={hasError ? 'error' : 'text'}
        >
          {label}
        </AyskaLabelComponent>
      )}

      {/* Input */}
      {inputContent}

      {/* Error Message */}
      {hasError && (
        <AyskaCaptionComponent color="error">{error}</AyskaCaptionComponent>
      )}
    </AyskaStackComponent>
  );
};
