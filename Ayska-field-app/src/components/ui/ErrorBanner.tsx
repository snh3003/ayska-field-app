import React from 'react';
import { Text, View } from 'react-native';

export const ErrorBanner: React.FC<{ message: string }> = ({ message }) => (
  <View style={{ padding: 12, backgroundColor: '#fee2e2', borderRadius: 8 }}>
    <Text style={{ color: '#991b1b' }}>{message}</Text>
  </View>
);


