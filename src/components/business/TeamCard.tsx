import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import type { TeamSales } from '../../types/api';

export const TeamCard: React.FC<{ team: TeamSales }> = ({ team }) => {
  return (
    <TamaguiView
      padding="$md"
      borderRadius="$md"
      borderWidth={1}
      borderColor="$border"
      backgroundColor="$card"
      marginBottom="$sm"
    >
      <TamaguiText fontWeight="700" marginBottom="$xs" color="$text">
        Team {team.teamId}
      </TamaguiText>
      <TamaguiText marginBottom="$sm" color="$text">
        Total Sales: {team.totalSales}
      </TamaguiText>
      {team.members.map((m: any) => (
        <TamaguiView key={m.employeeId} paddingVertical="$xs">
          <TamaguiText color="$text">
            {m.name}: {m.sales}
          </TamaguiText>
        </TamaguiView>
      ))}
    </TamaguiView>
  );
};
