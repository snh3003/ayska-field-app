import { Colors, Spacing } from '@/constants/theme';
import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Ionicons } from '@expo/vector-icons';
import { InputProps } from '../../types';
import { hapticFeedback } from '../../../utils/haptics';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const PasswordInput: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  keyboardType = 'default',
  autoCapitalize = 'none',
  error,
  style,
  icon,
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
  };

  const togglePasswordVisibility = () => {
    hapticFeedback.light();
    setShowPassword(prev => !prev);
  };

  return (
    <TamaguiView style={[styles.container, style]}>
      {label && (
        <TamaguiText
          fontSize="$4"
          color="$text"
          marginBottom="$sm"
          fontWeight="600"
        >
          {label}
        </TamaguiText>
      )}
      <TamaguiView
        borderColor={error ? '$error' : isFocused ? '$primary' : '$border'}
        backgroundColor="$card"
        borderWidth={1}
        borderRadius="$md"
        padding="$sm"
        flexDirection="row"
        alignItems="center"
      >
        {icon && <TamaguiView marginRight="$sm">{icon}</TamaguiView>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={!showPassword}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[styles.textInput, { color: theme.text }]}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          placeholderTextColor={theme.textSecondary}
        />
        <TouchableOpacity
          onPress={togglePasswordVisibility}
          style={styles.eyeButton}
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          accessibilityHint="Double tap to toggle password visibility"
        >
          <Ionicons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={20}
            color={theme.textSecondary}
          />
        </TouchableOpacity>
      </TamaguiView>
      {error && (
        <TamaguiText fontSize="$3" color="$error" marginTop="$xs">
          {error}
        </TamaguiText>
      )}
    </TamaguiView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
    marginLeft: Spacing.xs,
    borderRadius: 4,
    minWidth: 32,
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
