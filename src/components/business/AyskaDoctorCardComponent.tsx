import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import type { Doctor } from '../../types';

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <TamaguiView
      padding="$sm"
      borderRadius="$md"
      borderWidth={1}
      borderColor="$border"
      marginBottom="$sm"
      backgroundColor="$card"
    >
      <TamaguiText fontWeight="600" color="$text">
        {doctor.name}
      </TamaguiText>
      <TamaguiText color="$text">{doctor.specialization}</TamaguiText>
      <TamaguiText color="$text">
        Loc: {doctor.location.lat}, {doctor.location.lng}
      </TamaguiText>
    </TamaguiView>
  );
};
