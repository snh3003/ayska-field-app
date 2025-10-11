import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';
import { Input as TamaguiInput } from '@tamagui/input'
import { View as TamaguiView, Text as TamaguiText } from '@tamagui/core'

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  multiline?: boolean;
  numberOfLines?: number;
  error?: string;
  style?: any;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  multiline,
  numberOfLines,
  error,
  style,
  icon,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [isFocused, setIsFocused] = useState(false);

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) {
      onBlur();
    }
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
        borderColor={error ? '$error' : (isFocused ? '$primary' : '$border')}
        backgroundColor="$card"
        borderWidth={1}
        borderRadius="$md"
        padding="$sm"
        flexDirection="row"
        alignItems="center"
      >
        {icon && (
          <TamaguiView marginRight="$sm">
            {icon}
          </TamaguiView>
        )}
        <TamaguiInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          multiline={multiline}
          numberOfLines={numberOfLines}
          color="$text"
          fontSize="$4"
          borderWidth={0}
          backgroundColor="transparent"
          flex={1}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
        />
      </TamaguiView>
      {error && (
        <TamaguiText 
          fontSize="$3" 
          color="$error" 
          marginTop="$xs"
        >
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
  },
  iconContainer: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    paddingVertical: Spacing.md,
  },
});
