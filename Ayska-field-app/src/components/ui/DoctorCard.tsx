import React from 'react';
import { Text, View } from 'react-native';
import type { Doctor } from '../../interfaces/interfaces';

export const DoctorCard: React.FC<{ doctor: Doctor }> = ({ doctor }) => {
  return (
    <View style={{ padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginBottom: 8 }}>
      <Text style={{ fontWeight: '600' }}>{doctor.name}</Text>
      <Text>{doctor.specialization}</Text>
      <Text>Loc: {doctor.location.lat}, {doctor.location.lng}</Text>
    </View>
  );
};


