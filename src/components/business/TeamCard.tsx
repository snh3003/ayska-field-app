import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { Text, View } from 'react-native';
import type { TeamSales } from '../../types/api';

export const TeamCard: React.FC<{ team: TeamSales }> = ({ team }) => {
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
      <Text style={{ fontWeight: '700', marginBottom: 4, color: theme.text }}>
        Team {team.teamId}
      </Text>
      <Text style={{ marginBottom: 8, color: theme.text }}>
        Total Sales: {team.totalSales}
      </Text>
      {team.members.map((m: any) => (
        <View key={m.employeeId} style={{ paddingVertical: 2 }}>
          <Text style={{ color: theme.text }}>
            {m.name}: {m.sales}
          </Text>
        </View>
      ))}
    </View>
  );
};
