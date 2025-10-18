import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/Card';
import { Assignment } from '../../types/models';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';

interface AssignmentCardProps {
  assignment: Assignment;
  doctorName?: string;
  onPress?: () => void;
}

export const AssignmentCard: React.FC<AssignmentCardProps> = ({
  assignment,
  doctorName,
  onPress,
}) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const progressPercentage =
    assignment.target > 0
      ? (assignment.currentProgress / assignment.target) * 100
      : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.success;
      case 'completed':
        return theme.primary;
      case 'cancelled':
        return theme.error;
      default:
        return theme.textSecondary;
    }
  };

  return (
    <Card onPress={onPress || (() => {})} variant="elevated">
      <TamaguiView
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        marginBottom="$sm"
      >
        <TamaguiView flex={1}>
          <TamaguiText fontSize="$5" fontWeight="bold" color="$text">
            {doctorName || `Doctor ${assignment.doctorId}`}
          </TamaguiText>
          <TamaguiText fontSize="$3" color="$textSecondary">
            Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
          </TamaguiText>
        </TamaguiView>
        <TamaguiView
          backgroundColor={getStatusColor(assignment.status)}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <TamaguiText fontSize="$2" color="white" fontWeight="bold">
            {assignment.status.toUpperCase()}
          </TamaguiText>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView marginBottom="$sm">
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="$xs"
        >
          <TamaguiText fontSize="$4" color="$text">
            Progress: {assignment.currentProgress}/{assignment.target}
          </TamaguiText>
          <TamaguiText fontSize="$4" color="$text" fontWeight="bold">
            {Math.round(progressPercentage)}%
          </TamaguiText>
        </TamaguiView>

        <TamaguiView
          height={8}
          backgroundColor="$border"
          borderRadius="$sm"
          overflow="hidden"
        >
          <TamaguiView
            height="100%"
            backgroundColor={theme.success}
            width={`${Math.min(progressPercentage, 100)}%`}
          />
        </TamaguiView>
      </TamaguiView>

      <TamaguiView flexDirection="row" alignItems="center">
        <Ionicons name="flag-outline" size={16} color={theme.textSecondary} />
        <TamaguiText fontSize="$3" color="$textSecondary" marginLeft="$xs">
          Target: {assignment.target} visits
        </TamaguiText>
      </TamaguiView>
    </Card>
  );
};
