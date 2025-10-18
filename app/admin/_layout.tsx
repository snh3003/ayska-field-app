import { Stack } from 'expo-router';
import React from 'react';

export default function AdminLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: 'transparent' },
        headerTintColor: 'transparent',
        headerTitleStyle: { fontWeight: '600' },
        headerTransparent: true,
        headerLeft: () => null,
        headerRight: () => null,
      }}
    >
      <Stack.Screen
        name="onboard-employee"
        options={{
          presentation: 'modal',
          title: 'Add Employee',
        }}
      />
      <Stack.Screen
        name="onboard-doctor"
        options={{
          presentation: 'modal',
          title: 'Add Doctor',
        }}
      />
      <Stack.Screen
        name="analytics"
        options={{
          presentation: 'modal',
          title: 'Employee Analytics',
        }}
      />
      <Stack.Screen
        name="assign-doctors"
        options={{
          presentation: 'modal',
          title: 'Assign Doctors',
        }}
      />
    </Stack>
  );
}
