import { Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../src/components/ui/Input';
import { ButtonPrimary } from '../src/components/ui/ButtonPrimary';
import { Card } from '../src/components/ui/Card';
import { login } from '../src/store/slices/authSlice';
import type { RootState } from '../src/store';
import { localDataService } from '../src/services/LocalDataService';
import { ThemeToggle } from '../src/components/layout/ThemeToggle';
import { Logo } from '../src/components/layout/Logo';
import { commonRules, useFormValidation } from '../utils/validation';
import { useToast } from '../contexts/ToastContext';
import { hapticFeedback } from '../utils/haptics';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading: loginLoading, error: loginError } = useSelector(
    (s: RootState) => s.auth
  );
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];
  const toast = useToast();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    validateAll,
    setValues,
  } = useFormValidation(
    { email: '', password: '' },
    {
      email: [
        { required: true, message: 'Email is required' },
        commonRules.email,
      ],
      password: [
        { required: true, message: 'Password is required' },
        commonRules.password,
      ],
    }
  );

  const onSubmit = async () => {
    if (!validateAll()) {
      hapticFeedback.error();
      toast.error('Please fix the errors in the form');
      return;
    }

    const { email, password } = values;

    // Check admin
    const admin = localDataService.validateAdmin(email, password);
    if (admin) {
      const action = await dispatch(
        login({
          email,
          password,
          role: 'admin',
          userId: admin.id,
          name: admin.name,
        }) as any
      );
      if (action.type.endsWith('fulfilled')) {
        hapticFeedback.success();
        toast.success(`Welcome back, ${admin.name}!`);
        router.replace('/(tabs)');
      }
      return;
    }

    // Check employee
    const employee = localDataService.validateEmployee(email, password);
    if (employee) {
      const action = await dispatch(
        login({
          email,
          password,
          role: 'employee',
          userId: employee.id,
          name: employee.name,
        }) as any
      );
      if (action.type.endsWith('fulfilled')) {
        hapticFeedback.success();
        toast.success(`Welcome back, ${employee.name}!`);
        router.replace('/(tabs)');
      }
      return;
    }

    // Invalid credentials
    hapticFeedback.error();
    toast.error('Invalid email or password');
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <ThemeToggle />
          </View>

          <Logo size="responsive" matchCardWidth={true} style={styles.logo} />

          <Card variant="elevated" style={styles.formCard}>
            <Text
              style={[
                Typography.h3,
                { color: theme.text, marginBottom: Spacing.xs },
              ]}
            >
              Welcome Back
            </Text>
            <Text
              style={[
                Typography.body,
                { color: theme.textSecondary, marginBottom: Spacing.xl },
              ]}
            >
              Sign in to continue
            </Text>

            <Input
              placeholder="Email"
              value={values.email}
              onChangeText={text => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              icon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              }
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email ? errors.email || '' : ''}
            />

            <Input
              placeholder="Password"
              value={values.password}
              onChangeText={text => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              icon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              }
              secureTextEntry
              error={touched.password ? errors.password || '' : ''}
            />

            <ButtonPrimary
              title="Sign In"
              onPress={onSubmit}
              loading={loginLoading}
              accessibilityHint="Double tap to sign in to your account"
            />

            {!!loginError && (
              <Text
                style={[
                  Typography.bodySmall,
                  {
                    color: theme.error,
                    marginTop: Spacing.md,
                    textAlign: 'center',
                  },
                ]}
              >
                {loginError}
              </Text>
            )}
          </Card>

          <View style={styles.demoCredentials}>
            <Text
              style={[
                Typography.caption,
                {
                  color: theme.textSecondary,
                  textAlign: 'center',
                  marginBottom: Spacing.sm,
                },
              ]}
            >
              Demo Credentials
            </Text>
            <TouchableOpacity
              onPress={() => {
                setValues({ email: 'admin@field.co', password: 'admin123' });
                onSubmit();
              }}
              style={styles.demoButton}
            >
              <Text
                style={[
                  Typography.caption,
                  { color: theme.primary, textAlign: 'center' },
                ]}
              >
                Admin: admin@field.co / admin123
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setValues({ email: 'alice@field.co', password: 'password123' });
                onSubmit();
              }}
              style={styles.demoButton}
            >
              <Text
                style={[
                  Typography.caption,
                  { color: theme.primary, textAlign: 'center' },
                ]}
              >
                Employee: alice@field.co / password123
              </Text>
            </TouchableOpacity>
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
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  logo: {
    marginBottom: Spacing.xl,
    marginTop: Spacing.lg,
  },
  formCard: {
    marginBottom: Spacing.xl,
  },
  demoCredentials: {
    marginTop: Spacing.lg,
  },
  demoButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.xs,
  },
});
