import { Colors, Typography, Spacing, BorderRadius } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View, SafeAreaView, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { ButtonPrimary } from '../src/components/ui/ButtonPrimary';
import { Card } from '../src/components/ui/Card';
import { Input } from '../src/components/ui/Input';
import { localDataService } from '../src/services/LocalDataService';
import type { RootState } from '../src/store';
import { login } from '../src/store/slices/authSlice';
import { ThemeToggle } from '../components/ThemeToggle';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s: RootState) => s.auth);
  const [email, setEmail] = useState('alice@field.co');
  const [password, setPassword] = useState('password123');
  const [loginError, setLoginError] = useState<string | null>(null);

  const onSubmit = async () => {
    setLoginError(null);
    
    // Validate against LocalDataService
    const admin = localDataService.validateAdmin(email, password);
    const employee = localDataService.validateEmployee(email, password);
    
    if (admin) {
      const action = await dispatch(login({ email, password, role: 'admin', userId: admin.id, name: admin.name }) as any);
      if (action.type.endsWith('fulfilled')) {
        router.replace('/(tabs)');
      }
    } else if (employee) {
      const action = await dispatch(login({ email, password, role: 'employee', userId: employee.id, name: employee.name }) as any);
      if (action.type.endsWith('fulfilled')) {
        router.replace('/(tabs)');
      }
    } else {
      setLoginError('Invalid email or password');
    }
  };

  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.themeToggleContainer}>
              <ThemeToggle />
            </View>
            <View style={[styles.logoContainer, { backgroundColor: theme.primary + '15' }]}>
              <Ionicons name="briefcase" size={48} color={theme.primary} />
            </View>
            <Text style={[Typography.h1, { color: theme.text, marginTop: Spacing.lg, textAlign: 'center' }]}>
              Field Sales
            </Text>
            <Text style={[Typography.body, { color: theme.textSecondary, marginTop: Spacing.sm, textAlign: 'center' }]}>
              Track your sales activities effortlessly
            </Text>
          </View>

          <View style={styles.formContainer}>
            <Card variant="elevated" style={{ padding: Spacing.lg }}>
              <Input
                label="Email"
                placeholder="Enter your email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                icon={<Ionicons name="mail-outline" size={20} color={theme.icon} />}
              />
              <Input
                label="Password"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                icon={<Ionicons name="lock-closed-outline" size={20} color={theme.icon} />}
              />
              <ButtonPrimary 
                title="Sign In" 
                onPress={onSubmit} 
                loading={loading}
                style={{ marginTop: Spacing.sm }}
              />
              {!!error && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={theme.error} />
                  <Text style={[Typography.bodySmall, { color: theme.error, marginLeft: Spacing.xs }]}>
                    {error}
                  </Text>
                </View>
              )}
              {!!loginError && (
                <View style={styles.errorContainer}>
                  <Ionicons name="alert-circle" size={16} color={theme.error} />
                  <Text style={[Typography.bodySmall, { color: theme.error, marginLeft: Spacing.xs }]}>
                    {loginError}
                  </Text>
                </View>
              )}
            </Card>

            <View style={styles.quickLoginContainer}>
              <Text style={[Typography.caption, { color: theme.textSecondary, textAlign: 'center', marginBottom: Spacing.sm }]}>
                Quick login credentials:
              </Text>
              <Text style={[Typography.caption, { color: theme.textSecondary, textAlign: 'center' }]}>
                Employee: alice@field.co / password123
              </Text>
              <Text style={[Typography.caption, { color: theme.textSecondary, textAlign: 'center' }]}>
                Admin: admin@field.co / admin123
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: Spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginTop: Spacing.xl,
    marginBottom: Spacing.xl,
  },
  themeToggleContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.md,
    justifyContent: 'center',
  },
  quickLoginContainer: {
    marginTop: Spacing.lg,
    padding: Spacing.md,
  },
});


