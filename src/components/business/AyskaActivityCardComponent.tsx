import React from 'react';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { AyskaStackComponent } from '../ui/AyskaStackComponent';
import { useTheme } from '../../../utils/theme';
import type { Activity } from '../../types/AyskaApiType';

export const ActivityCard: React.FC<{ activity: Activity }> = ({
  activity,
}) => {
  const theme = useTheme();

  return (
    <AyskaStackComponent
      direction="vertical"
      spacing="xs"
      padding="md"
      backgroundColor="card"
      borderRadius="md"
      style={{
        borderWidth: 1,
        borderColor: theme.border,
        marginBottom: 8,
      }}
    >
      <AyskaTextComponent weight="bold" color="text">
        {activity.type.toUpperCase()}
      </AyskaTextComponent>
      <AyskaCaptionComponent color="textSecondary">
        {new Date(activity.timestamp).toLocaleString()}
      </AyskaCaptionComponent>
      {activity.amount != null && (
        <AyskaTextComponent color="text">
          Amount: {activity.amount}
        </AyskaTextComponent>
      )}
      {activity.notes && (
        <AyskaTextComponent color="text">{activity.notes}</AyskaTextComponent>
      )}
    </AyskaStackComponent>
  );
};
