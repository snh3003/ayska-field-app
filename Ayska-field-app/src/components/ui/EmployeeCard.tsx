import React from 'react';
import { Text, View } from 'react-native';

export const EmployeeCard: React.FC<{ name: string; email: string }> = ({ name, email }) => {
  return (
    <View style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 }}>
      <Text style={{ fontWeight: '600' }}>{name}</Text>
      <Text>{email}</Text>
    </View>
  );
};


