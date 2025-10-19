import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { Spacing } from '../constants/theme';
import { AyskaTextComponent } from '../src/components/ui/AyskaTextComponent';
import { AyskaTitleComponent } from '../src/components/ui/AyskaTitleComponent';
import { AyskaCaptionComponent } from '../src/components/ui/AyskaCaptionComponent';
import { AyskaStackComponent } from '../src/components/ui/AyskaStackComponent';
import { AyskaFormFieldComponent } from '../src/components/ui/AyskaFormFieldComponent';
import { AyskaActionButtonComponent } from '../src/components/ui/AyskaActionButtonComponent';
import { Card } from '../src/components/ui/AyskaCardComponent';
import { login } from '../src/store/slices/AyskaAuthSliceSlice';
import type { RootState } from '../src/store';
import { serviceContainer } from '../src/store/AyskaConfigureStoreStore';
import { ThemeToggle } from '../src/components/layout/AyskaThemeToggleComponent';
import { Logo } from '../src/components/layout/AyskaLogoComponent';
import { CommonValidators } from '../src/validation/AyskaCommonValidatorsValidation';
import { ValidationContext } from '../src/validation/AyskaValidationContextValidation';
import { FormValidator } from '../src/validation/AyskaFormValidatorValidation';
import { useToast } from '../contexts/ToastContext';
import { hapticFeedback } from '../utils/haptics';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { loading: loginLoading, error: loginError } = useSelector(
    (s: RootState) => s.auth
  );
  const theme = useTheme();
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
          <AyskaStackComponent
            direction="horizontal"
            justify="end"
            align="center"
            style={{ marginBottom: Spacing.md }}
          >
            <ThemeToggle />
          </AyskaStackComponent>

          <Logo
            size="responsive"
            matchCardWidth={true}
            style={{
              marginBottom: Spacing.xl,
              marginTop: Spacing.lg,
            }}
          />

          <Card variant="elevated" style={{ marginBottom: Spacing.xl }}>
            <AyskaTitleComponent
              level={3}
              weight="bold"
              color="text"
              style={{ marginBottom: Spacing.xs }}
            >
              Welcome Back
            </AyskaTitleComponent>
            <AyskaTextComponent
              variant="bodyLarge"
              color="textSecondary"
              style={{ marginBottom: Spacing.xl }}
            >
              Sign in to continue
            </AyskaTextComponent>

            <AyskaFormFieldComponent
              label="Email"
              value={values.email}
              onChange={text => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter your email"
              leadingIcon={
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              }
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email ? errors.email || '' : ''}
              touched={!!touched.email}
              required
            />

            <AyskaFormFieldComponent
              label="Password"
              value={values.password}
              onChange={text => handleChange('password', text)}
              onBlur={() => handleBlur('password')}
              placeholder="Enter your password"
              leadingIcon={
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={theme.textSecondary}
                />
              }
              secureTextEntry
              showPasswordToggle
              error={touched.password ? errors.password || '' : ''}
              touched={!!touched.password}
              required
            />

            <AyskaActionButtonComponent
              label="Sign In"
              onPress={onSubmit}
              loading={loginLoading}
              variant="primary"
              size="md"
              accessibilityLabel="Double tap to sign in to your account"
            />

            {!!loginError && (
              <AyskaTextComponent
                variant="bodySmall"
                color="error"
                align="center"
                style={{ marginTop: Spacing.md }}
              >
                {loginError}
              </AyskaTextComponent>
            )}
          </Card>

          <AyskaStackComponent style={{ marginTop: Spacing.lg }}>
            <AyskaCaptionComponent
              color="textSecondary"
              align="center"
              style={{ marginBottom: Spacing.sm }}
            >
              Demo Credentials
            </AyskaCaptionComponent>
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
              <AyskaCaptionComponent color="primary" align="center">
                Admin: admin@field.co / admin123
              </AyskaCaptionComponent>
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
              <AyskaCaptionComponent color="primary" align="center">
                Employee: alice@field.co / password123
              </AyskaCaptionComponent>
            </TouchableOpacity>
          </AyskaStackComponent>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
