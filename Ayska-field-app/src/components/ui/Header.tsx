import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  rightAction?: {
    title: string;
    onPress: () => void;
  };
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle, onBack, rightAction }) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <View style={{ 
      backgroundColor: theme.card, 
      paddingHorizontal: 20, 
      paddingVertical: 16, 
      borderBottomWidth: 1, 
      borderBottomColor: theme.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      <View style={{ flex: 1 }}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={{ marginBottom: 4 }}>
            <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>← Back</Text>
          </TouchableOpacity>
        )}
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text }}>{title}</Text>
        {subtitle && (
          <Text style={{ fontSize: 14, color: theme.text, opacity: 0.7, marginTop: 2 }}>{subtitle}</Text>
        )}
      </View>
      {rightAction && (
        <TouchableOpacity onPress={rightAction.onPress}>
          <Text style={{ color: theme.primary, fontSize: 16, fontWeight: '600' }}>{rightAction.title}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};
