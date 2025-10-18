import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';

export const EmployeeCard: React.FC<{ name: string; email: string }> = ({
  name,
  email,
}) => {
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
        {name}
      </TamaguiText>
      <TamaguiText color="$text">{email}</TamaguiText>
    </TamaguiView>
  );
};
