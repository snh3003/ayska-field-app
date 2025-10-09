import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonPrimary } from '../src/components/ui/ButtonPrimary';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { localDataService } from '../src/services/LocalDataService';
import type { RootState } from '../src/store';
import { login } from '../src/store/slices/authSlice';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading, error, role } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState('alice@field.co');
  const [password, setPassword] = useState('password123');

  const onSubmit = async () => {
    // Validate against LocalDataService
    const admin = localDataService.validateAdmin(email, password);
    const employee = localDataService.validateEmployee(email, password);
    
    if (admin) {
      const action = await dispatch(login({ email, password, role: 'admin', userId: admin.id, name: admin.name }) as any);
      if (action.type.endsWith('fulfilled')) {
        router.replace('/(tabs)/explore');
      }
    } else if (employee) {
      const action = await dispatch(login({ email, password, role: 'employee', userId: employee.id, name: employee.name }) as any);
      if (action.type.endsWith('fulfilled')) {
        router.replace('/(tabs)');
      }
    } else {
      // Handle invalid credentials
      console.log('Invalid credentials');
    }
  };

  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: theme.background }}>
      <Card style={{ padding: 24 }}>
        <Text style={{ fontSize: 28, fontWeight: '700', marginBottom: 24, color: theme.text, textAlign: 'center' }}>
          Field Sales App
        </Text>
        <Input
          label="Email"
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <Input
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {loading ? (
          <ActivityIndicator />
        ) : (
          <ButtonPrimary title="Sign In" onPress={onSubmit} />
        )}
        {!!error && <Text style={{ color: '#DC2626', marginTop: 12, textAlign: 'center' }}>{error}</Text>}
      </Card>
    </View>
  );
}


