import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/Card';
import { ActivityRoundup } from '../../types/models';
import { Ionicons } from '@expo/vector-icons';

interface RoundupCardProps {
  roundup: ActivityRoundup;
  onPress?: () => void;
}

export const RoundupCard: React.FC<RoundupCardProps> = ({
  roundup,
  onPress,
}) => {
  const totalCheckIns = roundup.employeeSummaries.reduce(
    (sum, emp) => sum + emp.checkInsCount,
    0
  );
  const totalTargets = roundup.employeeSummaries.reduce(
    (sum, emp) => sum + emp.targetsAchieved,
    0
  );
  const activeEmployees = roundup.employeeSummaries.length;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const getPeriodIcon = (period: string) => {
    return period === 'daily' ? 'calendar' : 'calendar-outline';
  };

  return (
    <Card onPress={onPress || (() => {})} variant="elevated">
      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$md"
      >
        <TamaguiView flexDirection="row" alignItems="center">
          <Ionicons
            name={getPeriodIcon(roundup.period)}
            size={24}
            color="#2196F3"
            marginRight="$sm"
          />
          <TamaguiText fontSize="$5" fontWeight="bold" color="$text">
            {roundup.period.charAt(0).toUpperCase() + roundup.period.slice(1)}{' '}
            Roundup
          </TamaguiText>
        </TamaguiView>
        <TamaguiView
          backgroundColor="#2196F3"
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <TamaguiText fontSize="$2" color="white" fontWeight="bold">
            {formatDate(roundup.startDate)}
          </TamaguiText>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="$md"
      >
        <TamaguiView flex={1} marginRight="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="people" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Active Employees
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {activeEmployees}
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
              Total Check-ins
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {totalCheckIns}
          </TamaguiText>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        marginBottom="$md"
      >
        <TamaguiView flex={1} marginRight="$sm">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$xs"
          >
            <Ionicons name="flag" size={16} color="#666" />
            <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
              Targets Achieved
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {totalTargets}
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
              Generated
            </TamaguiText>
          </TamaguiView>
          <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
            {formatDate(roundup.generatedAt)}
          </TamaguiText>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView>
        <TamaguiText fontSize="$3" color="$textSecondary" marginBottom="$xs">
          Top Performers:
        </TamaguiText>
        {roundup.employeeSummaries
          .filter(emp => emp.checkInsCount > 0)
          .sort((a, b) => b.checkInsCount - a.checkInsCount)
          .slice(0, 3)
          .map((emp, index) => (
            <TamaguiView
              key={emp.employeeId}
              flexDirection="row"
              alignItems="center"
              marginBottom="$xs"
            >
              <TamaguiView
                width={20}
                height={20}
                backgroundColor={
                  index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : '#CD7F32'
                }
                borderRadius={10}
                justifyContent="center"
                alignItems="center"
                marginRight="$sm"
              >
                <TamaguiText fontSize="$2" color="white" fontWeight="bold">
                  {index + 1}
                </TamaguiText>
              </TamaguiView>
              <TamaguiText fontSize="$3" color="$text" flex={1}>
                {emp.employeeName}
              </TamaguiText>
              <TamaguiText fontSize="$3" color="$textSecondary">
                {emp.checkInsCount} check-ins
              </TamaguiText>
            </TamaguiView>
          ))}
      </TamaguiView>
    </Card>
  );
};
