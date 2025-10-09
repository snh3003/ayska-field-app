import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

export const ButtonPrimary: React.FC<{ title: string; onPress: () => void; disabled?: boolean }> = ({ title, onPress, disabled }) => {
  const scheme = useColorScheme() ?? 'light';
  const bg = Colors[scheme].primary ?? Colors[scheme].tint;
  const textColor = '#FFFFFF';
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{ backgroundColor: bg, padding: 14, borderRadius: 10, opacity: disabled ? 0.6 : 1 }}
    >
      <Text style={{ color: textColor, textAlign: 'center', fontWeight: '700' }}>{title}</Text>
    </TouchableOpacity>
  );
};


