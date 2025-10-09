import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const ButtonSecondary: React.FC<{ title: string; onPress: () => void; disabled?: boolean }> = ({ title, onPress, disabled }) => {
  const scheme = useColorScheme() ?? 'light';
  const color = Colors[scheme].primary ?? Colors[scheme].tint;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ backgroundColor: 'transparent', borderWidth: 1, borderColor: color, padding: 14, borderRadius: 10, opacity: disabled ? 0.6 : 1 }}
    >
      <Text style={{ color, textAlign: 'center', fontWeight: '700' }}>{title}</Text>
    </TouchableOpacity>
  );
};


