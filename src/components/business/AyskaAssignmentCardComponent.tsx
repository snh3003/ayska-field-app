import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { Card } from '../ui/AyskaCardComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { Assignment } from '../../types/AyskaModelsType';
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
          <AyskaTextComponent variant="bodyLarge" weight="bold" color="text">
            {doctorName || `Doctor ${assignment.doctorId}`}
          </AyskaTextComponent>
          <AyskaCaptionComponent color="textSecondary">
            Assigned: {new Date(assignment.assignedDate).toLocaleDateString()}
          </AyskaCaptionComponent>
        </TamaguiView>
        <TamaguiView
          backgroundColor={getStatusColor(assignment.status)}
          paddingHorizontal="$sm"
          paddingVertical="$xs"
          borderRadius="$sm"
        >
          <AyskaCaptionComponent style={{ color: 'white', fontWeight: 'bold' }}>
            {assignment.status.toUpperCase()}
          </AyskaCaptionComponent>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView marginBottom="$sm">
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          marginBottom="$xs"
        >
          <AyskaTextComponent color="text">
            Progress: {assignment.currentProgress}/{assignment.target}
          </AyskaTextComponent>
          <AyskaTextComponent color="text" weight="bold">
            {Math.round(progressPercentage)}%
          </AyskaTextComponent>
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
        <AyskaCaptionComponent color="textSecondary" style={{ marginLeft: 4 }}>
          Target: {assignment.target} visits
        </AyskaCaptionComponent>
      </TamaguiView>
    </Card>
  );
};
