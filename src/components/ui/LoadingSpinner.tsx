import React from 'react';
import { ActivityIndicator } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';

export const LoadingSpinner: React.FC = () => (
  <TamaguiView padding="$md" alignItems="center">
    <ActivityIndicator />
  </TamaguiView>
);
