import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/Card';
import { EmployeeAnalytics } from '../../types/models';
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
  const getAchievementColor = (rate: number) => {
    if (rate >= 80) return '#4CAF50';
    if (rate >= 60) return '#FF9800';
    return '#F44336';
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
        <TamaguiText fontSize="$5" fontWeight="bold" color="$text">
          {employeeName || `Employee ${analytics.employeeId}`}
        </TamaguiText>
        <TamaguiView
          backgroundColor={getAchievementColor(analytics.targetAchievementRate)}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <TamaguiText fontSize="$2" color="white" fontWeight="bold">
            {Math.round(analytics.targetAchievementRate)}%
          </TamaguiText>
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
            <Ionicons name="list" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Assignments
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {analytics.completedAssignments}/{analytics.totalAssignments}
          </TamaguiText>
        </TamaguiView>

        <TamaguiView flex={1} marginLeft="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="checkmark-circle" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Check-ins
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {analytics.totalCheckIns}
          </TamaguiText>
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
            <Ionicons name="calendar" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Daily Avg
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {analytics.averageCheckInsPerDay.toFixed(1)}
          </TamaguiText>
        </TamaguiView>

        <TamaguiView flex={1} marginLeft="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="time" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Last Check-in
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {formatDate(analytics.lastCheckIn)}
          </TamaguiText>
        </TamaguiView>
      </TamaguiView>
    </Card>
  );
};
