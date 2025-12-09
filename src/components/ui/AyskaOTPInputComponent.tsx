import React, { useEffect, useRef, useState } from 'react';
import { TextInput, TouchableOpacity } from 'react-native';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaStackComponent } from './AyskaStackComponent';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { useTheme } from '../../../utils/theme';
import { AyskaOTPInputProps } from '../../types';

export const AyskaOTPInputComponent: React.FC<AyskaOTPInputProps> = ({
  length = 6,
  value = '',
  onChange,
  onComplete,
  disabled = false,
  error,
  style,
  accessibilityLabel = 'OTP input',
  accessibilityHint = 'Enter the 6-digit verification code',
}) => {
  const theme = useTheme();
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  // Initialize input refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  // Auto-focus first input on mount
  useEffect(() => {
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (text: string, index: number) => {
    // Only allow single digit
    const digit = text.slice(-1);
    if (!/^\d$/.test(digit) && digit !== '') return;

    const newValue = value.split('');
    newValue[index] = digit;
    const updatedValue = newValue.join('').slice(0, length);

    onChange?.(updatedValue);

    // Auto-advance to next input
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all digits are entered
    if (updatedValue.length === length && updatedValue.replace(/\s/g, '').length === length) {
      onComplete?.(updatedValue);
    }
  };

  const handleKeyPress = (key: string, index: number) => {
    if (key === 'Backspace') {
      // Move to previous input on backspace if current is empty
      if (!value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleBlur = () => {
    setFocusedIndex(null);
  };

  const handlePress = (index: number) => {
    hapticFeedback.light();
    inputRefs.current[index]?.focus();
  };

  const hasError = !!error;

  // Individual input styles
  const getInputStyles = (index: number) => ({
    width: 48,
    height: 48,
    borderWidth: 1.5,
    borderColor: hasError ? theme.error : focusedIndex === index ? theme.primary : theme.border,
    borderRadius: 8,
    backgroundColor: disabled ? theme.background : theme.card,
    textAlign: 'center' as const,
    fontSize: 18,
    fontWeight: '600' as const,
    color: theme.text,
    opacity: disabled ? 0.6 : 1,
    shadowColor: focusedIndex === index ? theme.primary : 'transparent',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: focusedIndex === index ? 2 : 0,
  });

  return (
    <AyskaStackComponent direction="vertical" spacing="xs" style={style}>
      <AyskaStackComponent
        direction="horizontal"
        spacing="sm"
        align="center"
        justify="center"
        {...getA11yProps(accessibilityLabel, accessibilityHint, 'text')}
      >
        {Array.from({ length }, (_, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => handlePress(idx)}
            disabled={disabled}
            style={getInputStyles(idx)}
            activeOpacity={0.7}
            {...getA11yProps(
              `Digit ${idx + 1}`,
              `Enter digit ${idx + 1} of the verification code`,
              'button',
            )}
          >
            <TextInput
              ref={(ref) => {
                inputRefs.current[idx] = ref;
              }}
              value={value[idx] || ''}
              onChangeText={(text) => handleChange(text, idx)}
              onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, idx)}
              onFocus={() => handleFocus(idx)}
              onBlur={handleBlur}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
              editable={!disabled}
              style={{
                flex: 1,
                textAlign: 'center',
                fontSize: 18,
                fontWeight: '600',
                color: theme.text,
              }}
            />
          </TouchableOpacity>
        ))}
      </AyskaStackComponent>

      {/* Error Message */}
      {hasError && (
        <AyskaTextComponent variant="bodySmall" color="error" align="center">
          {error}
        </AyskaTextComponent>
      )}
    </AyskaStackComponent>
  );
};
