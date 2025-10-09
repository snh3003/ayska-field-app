import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TextInput, View } from 'react-native';

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
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={{ marginBottom: 16, ...style }}>
      {label && (
        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 8 }}>
          {label}
        </Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.text + '60'}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        style={{
          borderWidth: 1,
          borderColor: error ? '#DC2626' : theme.border,
          borderRadius: 10,
          padding: 12,
          fontSize: 16,
          color: theme.text,
          backgroundColor: theme.background,
          ...(multiline && { textAlignVertical: 'top' }),
        }}
      />
      {error && (
        <Text style={{ color: '#DC2626', fontSize: 14, marginTop: 4 }}>{error}</Text>
      )}
    </View>
  );
};
