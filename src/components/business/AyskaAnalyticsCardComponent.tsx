import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/AyskaCardComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { useTheme } from '../../../utils/theme';
import { EmployeeAnalytics } from '../../types/AyskaModelsType';
import { Ionicons } from '@expo/vector-icons';

interface AnalyticsCardProps {
  analytics: EmployeeAnalytics;
  employeeName?: string;
  onPress?: () => void;
}

export const AnalyticsCard: React.FC<AnalyticsCardProps> = ({
  analytics,
  employeeName,
  onPress,
}) => {
  const theme = useTheme();

  const getAchievementColor = (rate: number) => {
    if (rate >= 80) return theme.success;
    if (rate >= 60) return theme.warning;
    return theme.error;
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <Card onPress={onPress || (() => {})} variant="elevated">
      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$md"
      >
        <AyskaTextComponent variant="bodyLarge" weight="bold" color="text">
          {employeeName || `Employee ${analytics.employeeId}`}
        </AyskaTextComponent>
        <TamaguiView
          backgroundColor={getAchievementColor(analytics.targetAchievementRate)}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <AyskaCaptionComponent style={{ color: 'white', fontWeight: 'bold' }}>
            {Math.round(analytics.targetAchievementRate)}%
          </AyskaCaptionComponent>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="$sm"
      >
        <TamaguiView flex={1} marginRight="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="list" size={16} color={theme.textSecondary} />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Assignments
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {analytics.completedAssignments}/{analytics.totalAssignments}
          </AyskaTextComponent>
        </TamaguiView>

        <TamaguiView flex={1} marginLeft="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons
              name="checkmark-circle"
              size={16}
              color={theme.textSecondary}
            />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Check-ins
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {analytics.totalCheckIns}
          </AyskaTextComponent>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="$sm"
      >
        <TamaguiView flex={1} marginRight="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="calendar" size={16} color={theme.textSecondary} />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Daily Avg
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {analytics.averageCheckInsPerDay.toFixed(1)}
          </AyskaTextComponent>
        </TamaguiView>

        <TamaguiView flex={1} marginLeft="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="time" size={16} color={theme.textSecondary} />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Last Check-in
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {formatDate(analytics.lastCheckIn)}
          </AyskaTextComponent>
        </TamaguiView>
      </TamaguiView>
    </Card>
  );
};
