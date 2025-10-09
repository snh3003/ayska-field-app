import React from 'react';
import { ActivityIndicator, View } from 'react-native';

export const LoadingSpinner: React.FC = () => (
  <View style={{ padding: 16, alignItems: 'center' }}>
    <ActivityIndicator />
  </View>
);


