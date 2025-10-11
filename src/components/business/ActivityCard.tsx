import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View } from 'react-native';
import type { Activity } from '../../types/api';

export const ActivityCard: React.FC<{ activity: Activity }> = ({
  activity,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  return (
    <View
      style={{
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.border,
        backgroundColor: theme.card,
        marginBottom: 10,
      }}
    >
      <Text style={{ fontWeight: '700', color: theme.text }}>
        {activity.type.toUpperCase()}
      </Text>
      <Text style={{ color: theme.text }}>
        {new Date(activity.timestamp).toLocaleString()}
      </Text>
      {activity.amount != null && (
        <Text style={{ color: theme.text }}>Amount: {activity.amount}</Text>
      )}
      {activity.notes && (
        <Text style={{ color: theme.text }}>{activity.notes}</Text>
      )}
    </View>
  );
};
