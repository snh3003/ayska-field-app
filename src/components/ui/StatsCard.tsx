import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View } from 'react-native';

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'primary' | 'secondary' | 'success' | 'warning';
}

export const StatsCard: React.FC<StatsCardProps> = ({ title, value, subtitle, color = 'primary' }) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const getColor = () => {
    switch (color) {
      case 'secondary':
        return theme.secondary;
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      default:
        return theme.primary;
    }
  };

  return (
    <View style={{
      backgroundColor: theme.card,
      borderRadius: 12,
      padding: 16,
      marginBottom: 12,
      borderWidth: 1,
      borderColor: theme.border,
      flex: 1,
      marginHorizontal: 4,
    }}>
      <Text style={{ fontSize: 14, color: theme.text, opacity: 0.7, marginBottom: 4 }}>
        {title}
      </Text>
      <Text style={{ fontSize: 24, fontWeight: '700', color: getColor(), marginBottom: 4 }}>
        {value}
      </Text>
      {subtitle && (
        <Text style={{ fontSize: 12, color: theme.text, opacity: 0.6 }}>
          {subtitle}
        </Text>
      )}
    </View>
  );
};
