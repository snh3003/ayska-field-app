import { Colors, Typography, BorderRadius, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { Text, TextInput, View, StyleSheet } from 'react-native';

interface InputProps {
  label?: string;
  placeholder?: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
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
  secureTextEntry,
  keyboardType = 'default',
  multiline,
  numberOfLines,
  error,
  style,
  icon,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={[Typography.body, { color: theme.text, marginBottom: Spacing.sm, fontWeight: '600' }]}>
          {label}
        </Text>
      )}
      <View style={[
        styles.inputContainer,
        {
          borderColor: error ? theme.error : (isFocused ? theme.primary : theme.border),
          backgroundColor: theme.card,
        }
      ]}>
        {icon && (
          <View style={styles.iconContainer}>
            {icon}
          </View>
        )}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={theme.textSecondary}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          multiline={multiline}
          numberOfLines={numberOfLines}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={[
            Typography.body,
            styles.input,
            {
              color: theme.text,
            },
            multiline && { textAlignVertical: 'top' },
          ]}
        />
      </View>
      {error && (
        <Text style={[Typography.bodySmall, { color: theme.error, marginTop: Spacing.xs }]}>
          {error}
        </Text>
      )}
    </View>
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
