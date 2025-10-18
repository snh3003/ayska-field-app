import React from 'react';
import { View as TamaguiView } from '@tamagui/core';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import type { TeamSales } from '../../types/AyskaApiType';

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
      <AyskaTextComponent
        weight="bold"
        color="text"
        style={{ marginBottom: 4 }}
      >
        Team {team.teamId}
      </AyskaTextComponent>
      <AyskaTextComponent color="text" style={{ marginBottom: 8 }}>
        Total Sales: {team.totalSales}
      </AyskaTextComponent>
      {team.members.map((m: any) => (
        <TamaguiView key={m.employeeId} paddingVertical="$xs">
          <AyskaTextComponent color="text">
            {m.name}: {m.sales}
          </AyskaTextComponent>
        </TamaguiView>
      ))}
    </TamaguiView>
  );
};
