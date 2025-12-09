import React, { useEffect, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/theme';
import { Spacing } from '../constants/theme';
import { AyskaTextComponent } from '../src/components/ui/AyskaTextComponent';
import { AyskaTitleComponent } from '../src/components/ui/AyskaTitleComponent';
import { AyskaStackComponent } from '../src/components/ui/AyskaStackComponent';
import { AyskaFormFieldComponent } from '../src/components/ui/AyskaFormFieldComponent';
import { AyskaActionButtonComponent } from '../src/components/ui/AyskaActionButtonComponent';
import { AyskaOTPInputComponent } from '../src/components/ui/AyskaOTPInputComponent';
import { Card } from '../src/components/ui/AyskaCardComponent';
import { login } from '../src/store/slices/AyskaAuthSlice';
import type { RootState } from '../src/store';
import { ThemeToggle } from '../src/components/layout/AyskaThemeToggleComponent';
import { Logo } from '../src/components/layout/AyskaLogoComponent';
import { CommonValidators } from '../src/validation/AyskaCommonValidators';
import { ValidationContext } from '../src/validation/AyskaValidationContext';
import { FormValidator } from '../src/validation/AyskaFormValidator';
import { useToast } from '../contexts/ToastContext';
import { hapticFeedback } from '../utils/haptics';
import { ServiceContainer } from '../src/di/ServiceContainer';
import { IAuthService } from '../src/services/AyskaAuthService';

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { error: loginError } = useSelector((s: RootState) => s.auth);
  const theme = useTheme();
  const toast = useToast();

  const [values, setValues] = useState({ email: '', otp: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(0);

  // Get auth service from container
  const authService = ServiceContainer.getInstance().get('IAuthService') as IAuthService;

  const formValidator = new FormValidator();
  const validationRules: Record<string, any[]> = {
    email: [CommonValidators.required('Email or phone is required'), CommonValidators.emailOrPhone],
  };

  // Countdown timer effect
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (resendCountdown > 0) {
      interval = setInterval(() => {
        setResendCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [resendCountdown]);

  const handleChange = (field: string, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const context = new ValidationContext();
      validationRules[field]?.forEach((rule: any) => context.addRule(rule));
      const result = context.validate(value);
      setErrors((prev) => ({
        ...prev,
        [field]: result.isValid ? '' : result.error || '',
      }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    const context = new ValidationContext();
    validationRules[field]?.forEach((rule: any) => context.addRule(rule));
    const result = context.validate(values[field as keyof typeof values]);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? '' : result.error || '',
    }));
  };

  const validateEmail = (): boolean => {
    const newErrors = formValidator.validateForm(
      { email: values.email },
      { email: validationRules.email || [] },
    );
    setErrors((prev) => ({ ...prev, email: newErrors.email || '' }));
    setTouched((prev) => ({ ...prev, email: true }));
    return !newErrors.email;
  };

  const validateOTP = (): boolean => {
    if (values.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: 'Please enter the 6-digit code' }));
      return false;
    }
    setErrors((prev) => ({ ...prev, otp: '' }));
    return true;
  };

  const sendOTP = async () => {
    if (!validateEmail()) {
      hapticFeedback.error();
      toast.error('Please enter a valid email or phone number');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await authService.requestOTP(values.email);

      setOtpSent(true);
      setResendCountdown(60);
      hapticFeedback.success();
      toast.success(response.message);
    } catch (error: any) {
      hapticFeedback.error();
      toast.error(error.message || 'Failed to send verification code. Please try again.');
    } finally {
      setOtpLoading(false);
    }
  };

  const verifyOTP = async () => {
    // Validate OTP length first
    if (!validateOTP()) {
      hapticFeedback.error();
      toast.error('Please enter the 6-digit verification code');
      return;
    }

    setOtpLoading(true);
    try {
      const response = await authService.verifyOTP(values.email, values.otp);

      // Store token and user data
      const authStorage = ServiceContainer.getInstance().get('IAuthStorage') as any;
      await authStorage.setToken(response.access_token);
      await authStorage.setUser(response.user);

      // Dispatch login action with real user data
      const action = await dispatch(
        login({
          email: response.user.email || values.email,
          role: response.user.role as any,
          userId: response.user.id,
          name: response.user.name,
        }) as any,
      );

      if (action.type.endsWith('fulfilled')) {
        hapticFeedback.success();
        toast.success('Login successful!');
        router.replace('/(tabs)');
      }
    } catch (error: any) {
      hapticFeedback.error();
      // Extract error message from API error (already mapped by ErrorInterceptor)
      // ErrorInterceptor converts errors to ApiError with message property
      const errorMessage =
        error?.message ||
        error?.response?.data?.message ||
        error?.response?.data?.detail?.message ||
        'Invalid verification code. Please try again.';
      toast.error(errorMessage);
    } finally {
      setOtpLoading(false);
    }
  };

  const resendOTP = async () => {
    if (resendCountdown > 0) return;

    await sendOTP();
  };

  // Determine if email/phone is valid for enabling Send OTP button
  const isEmailValid = values.email.length > 0 && !errors.email;
  const isOTPValid = values.otp.length === 6;

  // Get adaptive button text color for light/dark mode
  const getButtonTextColor = ():
    | 'text'
    | 'textSecondary'
    | 'primary'
    | 'secondary'
    | 'success'
    | 'warning'
    | 'error'
    | 'info' => {
    // For primary buttons with colored backgrounds, always use white text for contrast
    return 'text';
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'flex-start',
            padding: Spacing.md,
            paddingTop: Spacing.md,
            paddingBottom: Spacing.lg,
            minHeight: '100%',
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <AyskaStackComponent
            direction="horizontal"
            justify="end"
            align="center"
            style={{
              position: 'absolute',
              top: Spacing.lg,
              right: Spacing.md,
              zIndex: 10,
            }}
          >
            <ThemeToggle />
          </AyskaStackComponent>

          <Logo
            size="responsive"
            matchCardWidth={true}
            style={{
              marginBottom: Spacing.md,
              marginTop: Spacing.xl,
            }}
          />

          <Card
            variant="elevated"
            style={{
              marginBottom: Spacing.md,
              padding: Spacing.md,
              borderRadius: 12,
              shadowColor: theme.textSecondary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <AyskaStackComponent
              direction="vertical"
              spacing="xs"
              align="center"
              style={{ marginBottom: Spacing.md }}
            >
              <AyskaTitleComponent level={3} weight="bold" color="text" align="center">
                Welcome Back
              </AyskaTitleComponent>
              <AyskaTextComponent variant="body" color="textSecondary" align="center">
                Sign in to continue
              </AyskaTextComponent>
            </AyskaStackComponent>

            <AyskaFormFieldComponent
              label="Email or Phone"
              value={values.email}
              onChange={(text) => handleChange('email', text)}
              onBlur={() => handleBlur('email')}
              placeholder="Enter email or phone number"
              leadingIcon={<Ionicons name="mail-outline" size={20} color={theme.textSecondary} />}
              keyboardType="email-address"
              autoCapitalize="none"
              error={touched.email ? errors.email || '' : ''}
              touched={!!touched.email}
              required
            />

            {!otpSent ? (
              <AyskaActionButtonComponent
                label="Send OTP"
                onPress={sendOTP}
                loading={otpLoading}
                disabled={!isEmailValid}
                variant="primary"
                size="md"
                fullWidth
                textColor={getButtonTextColor()}
                style={{
                  marginTop: Spacing.sm,
                  borderRadius: 8,
                  shadowColor: theme.primary,
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 3,
                }}
                accessibilityLabel="Double tap to send verification code"
              />
            ) : (
              <AyskaStackComponent
                direction="vertical"
                spacing="sm"
                align="center"
                style={{ marginTop: Spacing.sm, width: '100%' }}
              >
                <AyskaStackComponent direction="vertical" spacing="xs" align="center">
                  <AyskaTextComponent variant="body" color="text" align="center" weight="medium">
                    Verification Code
                  </AyskaTextComponent>
                  <AyskaTextComponent variant="body" color="text" align="center" weight="medium">
                    Enter the 6-digit code sent to
                  </AyskaTextComponent>
                  <AyskaTextComponent
                    variant="bodySmall"
                    color="primary"
                    align="center"
                    weight="semibold"
                  >
                    {values.email}
                  </AyskaTextComponent>
                </AyskaStackComponent>

                <AyskaOTPInputComponent
                  length={6}
                  value={values.otp}
                  onChange={(value) => handleChange('otp', value)}
                  error={touched.otp ? errors.otp || '' : ''}
                  accessibilityLabel="Enter verification code"
                  accessibilityHint="Enter the 6-digit verification code sent to your email or phone"
                />

                <AyskaActionButtonComponent
                  label="Verify & Login"
                  onPress={verifyOTP}
                  loading={otpLoading}
                  disabled={!isOTPValid}
                  variant="primary"
                  size="md"
                  fullWidth
                  textColor={getButtonTextColor()}
                  style={{
                    borderRadius: 8,
                    shadowColor: theme.primary,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                  accessibilityLabel="Double tap to verify code and login"
                />

                <TouchableOpacity
                  onPress={resendOTP}
                  disabled={resendCountdown > 0}
                  style={{
                    paddingVertical: Spacing.sm,
                    paddingHorizontal: Spacing.md,
                    borderRadius: 6,
                    backgroundColor: resendCountdown > 0 ? theme.background : 'transparent',
                    borderWidth: resendCountdown > 0 ? 0 : 1,
                    borderColor: theme.border,
                  }}
                >
                  <AyskaTextComponent
                    variant="body"
                    color={resendCountdown > 0 ? 'textSecondary' : 'primary'}
                    align="center"
                    weight={resendCountdown > 0 ? 'normal' : 'medium'}
                  >
                    {resendCountdown > 0
                      ? `Resend code in ${resendCountdown}s`
                      : 'Resend verification code'}
                  </AyskaTextComponent>
                </TouchableOpacity>
              </AyskaStackComponent>
            )}

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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
