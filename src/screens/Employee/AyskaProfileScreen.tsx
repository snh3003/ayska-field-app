import React from 'react';
import { ScrollView } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonSecondary } from '../../components/ui/AyskaButtonSecondaryComponent';
import { Card } from '../../components/ui/AyskaCardComponent';
import { StatsCard } from '../../components/ui/AyskaStatsCardComponent';
import { localDataService } from '../../services/AyskaLocalDataService';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/AyskaAuthSlice';

export default function Profile() {
  const { name, role, userId } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const stats = userId
    ? localDataService.getEmployeeStats(userId)
    : { totalDays: 0, completedDays: 0, totalVisits: 0, completedVisits: 0 };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <TamaguiView padding="$md">
        <TamaguiText
          fontSize="$6"
          fontWeight="700"
          color="$text"
          marginBottom="$lg"
        >
          Profile
        </TamaguiText>

        <Card style={{ marginBottom: 20 }}>
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Personal Information
          </TamaguiText>
          <TamaguiText color="$text" marginBottom="$xs">
            Name: {name}
          </TamaguiText>
          <TamaguiText color="$text" marginBottom="$md">
            Role: {role}
          </TamaguiText>
        </Card>

        <TamaguiText
          fontSize="$5"
          fontWeight="600"
          color="$text"
          marginBottom="$md"
        >
          Performance Stats
        </TamaguiText>
        <TamaguiView flexDirection="row" marginBottom="$lg" gap="$md">
          <StatsCard
            title="Total Days"
            value={stats.totalDays}
            color="primary"
          />
          <StatsCard
            title="Completed Days"
            value={stats.completedDays}
            color="success"
          />
        </TamaguiView>
        <TamaguiView flexDirection="row" marginBottom="$lg" gap="$md">
          <StatsCard
            title="Total Visits"
            value={stats.totalVisits}
            color="secondary"
          />
          <StatsCard
            title="Completed Visits"
            value={stats.completedVisits}
            color="success"
          />
        </TamaguiView>

        <Card>
          <ButtonSecondary
            title="Sign Out"
            onPress={() => dispatch(logout() as any)}
          />
        </Card>
      </TamaguiView>
    </ScrollView>
  );
}
