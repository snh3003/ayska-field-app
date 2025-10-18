import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '../src/components/ui/Input';
import { PasswordInput } from '../src/components/ui/PasswordInput';
import { ButtonPrimary } from '../src/components/ui/ButtonPrimary';
import { Card } from '../src/components/ui/Card';
import { login } from '../src/store/slices/authSlice';
import type { RootState } from '../src/store';
import { serviceContainer } from '../src/store/configureStore';
import { ThemeToggle } from '../src/components/layout/ThemeToggle';
import { Logo } from '../src/components/layout/Logo';
import { CommonValidators } from '../src/validation/CommonValidators';
import { ValidationContext } from '../src/validation/ValidationContext';
import { FormValidator } from '../src/validation/FormValidator';
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

  const [values, setValues] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const formValidator = new FormValidator();
  const validationRules: Record<string, any[]> = {
    email: [
      CommonValidators.required('Email is required'),
      CommonValidators.email,
    ],
    password: [
      CommonValidators.required('Password is required'),
      CommonValidators.password,
    ],
  };

  const handleChange = (field: string, value: string) => {
    setValues(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const context = new ValidationContext();
      validationRules[field]?.forEach((rule: any) => context.addRule(rule));
      const result = context.validate(value);
      setErrors(prev => ({
        ...prev,
        [field]: result.isValid ? '' : result.error || '',
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const context = new ValidationContext();
    validationRules[field]?.forEach((rule: any) => context.addRule(rule));
    const result = context.validate(values[field as keyof typeof values]);
    setErrors(prev => ({
      ...prev,
      [field]: result.isValid ? '' : result.error || '',
    }));
  };

  const validateAll = (): boolean => {
    const newErrors = formValidator.validateForm(values, validationRules);
    setErrors(newErrors);

    const allTouched = Object.keys(validationRules).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    return Object.keys(newErrors).length === 0;
  };

  const performLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    const { email, password } = credentials;

    // Check admin
    const authRepository = serviceContainer.get('IAuthRepository') as any;
    const admin = await authRepository.validateAdmin(email, password);
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
    const employee = await authRepository.validateEmployee(email, password);
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

  const onSubmit = async () => {
    if (!validateAll()) {
      hapticFeedback.error();
      toast.error('Please fix the errors in the form');
      return;
    }

    await performLogin(values);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            padding: Spacing.xl,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TamaguiView
            flexDirection="row"
            justifyContent="flex-end"
            alignItems="center"
            marginBottom="$md"
          >
            <ThemeToggle />
          </TamaguiView>

          <Logo
            size="responsive"
            matchCardWidth={true}
            style={{
              marginBottom: Spacing.xl,
              marginTop: Spacing.lg,
            }}
          />

          <Card variant="elevated" style={{ marginBottom: Spacing.xl }}>
            <TamaguiText
              fontSize="$6"
              fontWeight="700"
              color={theme.text}
              marginBottom="$xs"
            >
              Welcome Back
            </TamaguiText>
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color={theme.textSecondary}
              marginBottom="$xl"
            >
              Sign in to continue
            </TamaguiText>

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

            <PasswordInput
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
              keyboardType="default"
              autoCapitalize="none"
              error={touched.password ? errors.password || '' : ''}
            />

            <ButtonPrimary
              title="Sign In"
              onPress={onSubmit}
              loading={loginLoading}
              accessibilityHint="Double tap to sign in to your account"
            />

            {!!loginError && (
              <TamaguiText
                fontSize="$3"
                lineHeight="$5"
                color={theme.error}
                marginTop="$md"
                textAlign="center"
              >
                {loginError}
              </TamaguiText>
            )}
          </Card>

          <TamaguiView style={{ marginTop: Spacing.lg }}>
            <TamaguiText
              fontSize="$2"
              lineHeight="$4"
              color={theme.textSecondary}
              textAlign="center"
              marginBottom="$sm"
            >
              Demo Credentials
            </TamaguiText>
            <TouchableOpacity
              onPress={() => {
                setValues({ email: 'admin@field.co', password: 'admin123' });
                performLogin({ email: 'admin@field.co', password: 'admin123' });
              }}
              style={{
                paddingVertical: Spacing.sm,
                paddingHorizontal: Spacing.md,
                marginBottom: Spacing.xs,
              }}
            >
              <TamaguiText
                fontSize="$2"
                lineHeight="$4"
                color={theme.primary}
                textAlign="center"
              >
                Admin: admin@field.co / admin123
              </TamaguiText>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setValues({ email: 'alice@field.co', password: 'password123' });
                performLogin({
                  email: 'alice@field.co',
                  password: 'password123',
                });
              }}
              style={{
                paddingVertical: Spacing.sm,
                paddingHorizontal: Spacing.md,
                marginBottom: Spacing.xs,
              }}
            >
              <TamaguiText
                fontSize="$2"
                lineHeight="$4"
                color={theme.primary}
                textAlign="center"
              >
                Employee: alice@field.co / password123
              </TamaguiText>
            </TouchableOpacity>
          </TamaguiView>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
