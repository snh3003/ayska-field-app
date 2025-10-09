import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';

export default function EmployeeDetail() {
  useEffect(() => {
    console.log('Fetch employee details');
  }, []);

  return (
    <ScrollView style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Employee Detail</Text>
    </ScrollView>
  );
}


