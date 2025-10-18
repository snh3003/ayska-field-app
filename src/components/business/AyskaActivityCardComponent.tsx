import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import type { Activity } from '../../types/AyskaApiType';

export const ActivityCard: React.FC<{ activity: Activity }> = ({
  activity,
}) => {
  return (
    <TamaguiView
      padding="$md"
      borderRadius="$md"
      borderWidth={1}
      borderColor="$border"
      backgroundColor="$card"
      marginBottom="$sm"
    >
      <TamaguiText fontWeight="700" color="$text">
        {activity.type.toUpperCase()}
      </TamaguiText>
      <TamaguiText color="$text">
        {new Date(activity.timestamp).toLocaleString()}
      </TamaguiText>
      {activity.amount != null && (
        <TamaguiText color="$text">Amount: {activity.amount}</TamaguiText>
      )}
      {activity.notes && (
        <TamaguiText color="$text">{activity.notes}</TamaguiText>
      )}
    </TamaguiView>
  );
};
