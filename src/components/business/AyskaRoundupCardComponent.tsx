import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/AyskaCardComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { useTheme } from '../../../utils/theme';
import { ActivityRoundup } from '../../types/AyskaModelsType';
import { Ionicons } from '@expo/vector-icons';

interface RoundupCardProps {
  roundup: ActivityRoundup;
  onPress?: () => void;
}

export const RoundupCard: React.FC<RoundupCardProps> = ({
  roundup,
  onPress,
}) => {
  const theme = useTheme();

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
            color={theme.primary}
            marginRight="$sm"
          />
          <AyskaTextComponent variant="bodyLarge" weight="bold" color="text">
            {roundup.period.charAt(0).toUpperCase() + roundup.period.slice(1)}{' '}
            Roundup
          </AyskaTextComponent>
        </TamaguiView>
        <TamaguiView
          backgroundColor={theme.primary}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <AyskaCaptionComponent style={{ color: 'white', fontWeight: 'bold' }}>
            {formatDate(roundup.startDate)}
          </AyskaCaptionComponent>
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
            <Ionicons name="people" size={16} color={theme.textSecondary} />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Active Employees
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {activeEmployees}
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
              Total Check-ins
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {totalCheckIns}
          </AyskaTextComponent>
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
            <Ionicons name="flag" size={16} color={theme.textSecondary} />
            <AyskaCaptionComponent
              color="textSecondary"
              style={{ marginLeft: 4 }}
            >
              Targets Achieved
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {totalTargets}
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
              Generated
            </AyskaCaptionComponent>
          </TamaguiView>
          <AyskaTextComponent weight="bold" color="text">
            {formatDate(roundup.generatedAt)}
          </AyskaTextComponent>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView>
        <AyskaCaptionComponent
          color="textSecondary"
          style={{ marginBottom: 4 }}
        >
          Top Performers:
        </AyskaCaptionComponent>
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
                  index === 0
                    ? theme.warning
                    : index === 1
                      ? theme.textSecondary
                      : theme.error
                }
                borderRadius={10}
                justifyContent="center"
                alignItems="center"
                marginRight="$sm"
              >
                <AyskaCaptionComponent
                  style={{ color: 'white', fontWeight: 'bold' }}
                >
                  {index + 1}
                </AyskaCaptionComponent>
              </TamaguiView>
              <AyskaCaptionComponent color="textSecondary" style={{ flex: 1 }}>
                {emp.employeeName}
              </AyskaCaptionComponent>
              <AyskaCaptionComponent color="textSecondary">
                {emp.checkInsCount} check-ins
              </AyskaCaptionComponent>
            </TamaguiView>
          ))}
      </TamaguiView>
    </Card>
  );
};
