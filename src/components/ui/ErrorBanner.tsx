import React from 'react';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => {
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <TamaguiView
      padding="$sm"
      backgroundColor={theme.errorBg}
      borderRadius="$md"
    >
      <TamaguiText color="$error">{message}</TamaguiText>
    </TamaguiView>
  );
};
