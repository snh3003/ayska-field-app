import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { AppDispatch, RootState } from '../../store';
import { onboardEmployee } from '../../store/slices/onboardingSlice';
import { CommonValidators } from '../../validation/CommonValidators';
import { FormValidator } from '../../validation/FormValidator';
import { ValidationContext } from '../../validation/ValidationContext';
import { Input } from '../ui/Input';
import { ButtonPrimary } from '../ui/ButtonPrimary';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
// import { hapticFeedback } from '../../utils/haptics';

interface OnboardEmployeeFormProps {
  onSuccess?: () => void;
}

export const OnboardEmployeeForm: React.FC<OnboardEmployeeFormProps> = ({
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.onboarding);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    dateOfBirth: '',
    areaOfOperation: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validationRules = {
    name: [CommonValidators.required('Name is required')],
    email: [
      CommonValidators.required('Email is required'),
      CommonValidators.email,
    ],
    age: [CommonValidators.required('Age is required'), CommonValidators.age],
    dateOfBirth: [CommonValidators.required('Date of birth is required')],
    areaOfOperation: [CommonValidators.areaOfOperation],
  };

  const handleFieldChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const context = new ValidationContext();
      validationRules[field as keyof typeof validationRules]?.forEach(rule =>
        context.addRule(rule)
      );
      const result = context.validate(value);
      setErrors(prev => ({ ...prev, [field]: result.error || '' }));
    }
  };

  const handleFieldBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    handleFieldChange(field, formData[field as keyof typeof formData]);
  };

  const validateForm = (): boolean => {
    const formValidator = new FormValidator();
    const newErrors = formValidator.validateForm(formData, validationRules);
    setErrors(newErrors);
    setTouched({
      name: true,
      email: true,
      age: true,
      dateOfBirth: true,
      areaOfOperation: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // hapticFeedback.light();

    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting'
      );
      return;
    }

    try {
      await dispatch(
        onboardEmployee({
          name: formData.name,
          email: formData.email,
          age: parseInt(formData.age),
          dateOfBirth: formData.dateOfBirth,
          areaOfOperation: formData.areaOfOperation,
          adminId: 'a1', // Default admin ID
        })
      ).unwrap();

      Alert.alert(
        'Success',
        'Employee onboarded successfully! Check console for mock email.'
      );
      onSuccess?.();
    } catch {
      Alert.alert('Error', 'Failed to onboard employee');
    }
  };

  return (
    <TamaguiView>
      <Input
        label="Name"
        value={formData.name}
        onChangeText={value => handleFieldChange('name', value)}
        onBlur={() => handleFieldBlur('name')}
        placeholder="Enter employee name"
        icon={
          <Ionicons
            name="person-outline"
            size={20}
            color={theme.textSecondary}
          />
        }
        error={touched.name ? errors.name || '' : ''}
      />

      <Input
        label="Email"
        value={formData.email}
        onChangeText={value => handleFieldChange('email', value)}
        onBlur={() => handleFieldBlur('email')}
        placeholder="Enter email address"
        keyboardType="email-address"
        icon={
          <Ionicons name="mail-outline" size={20} color={theme.textSecondary} />
        }
        error={touched.email ? errors.email || '' : ''}
      />

      <Input
        label="Age"
        value={formData.age}
        onChangeText={value => handleFieldChange('age', value)}
        onBlur={() => handleFieldBlur('age')}
        placeholder="Enter age"
        keyboardType="numeric"
        icon={
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.textSecondary}
          />
        }
        error={touched.age ? errors.age || '' : ''}
      />

      <Input
        label="Date of Birth"
        value={formData.dateOfBirth}
        onChangeText={value => handleFieldChange('dateOfBirth', value)}
        onBlur={() => handleFieldBlur('dateOfBirth')}
        placeholder="YYYY-MM-DD"
        icon={
          <Ionicons
            name="calendar-outline"
            size={20}
            color={theme.textSecondary}
          />
        }
        error={touched.dateOfBirth ? errors.dateOfBirth || '' : ''}
      />

      <Input
        label="Area of Operation"
        value={formData.areaOfOperation}
        onChangeText={value => handleFieldChange('areaOfOperation', value)}
        onBlur={() => handleFieldBlur('areaOfOperation')}
        placeholder="Enter area of operation"
        icon={
          <Ionicons
            name="location-outline"
            size={20}
            color={theme.textSecondary}
          />
        }
        error={touched.areaOfOperation ? errors.areaOfOperation || '' : ''}
      />

      <ButtonPrimary
        title={loading ? 'Onboarding...' : 'Onboard Employee'}
        onPress={handleSubmit}
        loading={loading}
        accessibilityHint="Double tap to onboard the new employee"
      />
    </TamaguiView>
  );
};
