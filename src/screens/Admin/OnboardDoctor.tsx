import React, { useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { MapPicker } from '../../components/ui/MapPicker';
import { Input } from '../../components/ui/Input';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { onboardDoctor } from '../../store/slices/onboardingSlice';
import { CommonValidators } from '../../validation/CommonValidators';
import { FormValidator } from '../../validation/FormValidator';
import { ValidationContext } from '../../validation/ValidationContext';
import { Location } from '../../types/models';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { hapticFeedback } from '../../../utils/haptics';
import { useToast } from '../../../contexts/ToastContext';

export default function OnboardDoctorScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { loading } = useSelector((state: RootState) => state.onboarding);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    specialization: '',
    phone: '',
  });

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validationRules = {
    name: [CommonValidators.required('Name is required')],
    age: [CommonValidators.required('Age is required'), CommonValidators.age],
    specialization: [CommonValidators.required('Specialization is required')],
    phone: [CommonValidators.phone],
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

    if (!selectedLocation) {
      newErrors.location = 'Please select a location';
    }

    setErrors(newErrors);
    setTouched({
      name: true,
      age: true,
      specialization: true,
      phone: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = useMemo(() => {
    // Check all required fields are filled
    const allFieldsFilled = Object.keys(validationRules).every(
      field =>
        formData[field as keyof typeof formData]?.toString().trim() !== ''
    );
    // Check no validation errors exist
    const noErrors = Object.values(errors).every(err => !err);
    // Check location is selected
    const locationSelected = selectedLocation !== null;
    return allFieldsFilled && noErrors && locationSelected;
  }, [formData, errors, selectedLocation, validationRules]);

  const toast = useToast();

  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert(
        'Validation Error',
        'Please fix the errors before submitting'
      );
      return;
    }

    try {
      await dispatch(
        onboardDoctor({
          name: formData.name,
          age: parseInt(formData.age),
          specialization: formData.specialization,
          location: selectedLocation!,
          phone: formData.phone,
          adminId: 'a1', // Default admin ID
        })
      ).unwrap();

      // Show success toast
      toast.success(
        `Doctor ${formData.name} (${formData.specialization}) onboarded successfully`
      );
      hapticFeedback.success();
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to onboard doctor');
    }
  };

  const handleBack = () => {
    hapticFeedback.light();
    router.back();
  };

  const handleClose = () => {
    hapticFeedback.medium();
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Custom Header */}
        <TamaguiView
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="$md"
          backgroundColor="$card"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <TamaguiText fontSize="$6" fontWeight="600" color="$text">
            Add Doctor
          </TamaguiText>

          <TouchableOpacity
            onPress={handleClose}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </TamaguiView>

        <ScrollView style={{ flex: 1 }}>
          <TamaguiView padding="$md">
            <TamaguiView
              backgroundColor="$card"
              borderRadius="$md"
              padding="$md"
              marginBottom="$md"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$md"
              >
                <Ionicons name="medical" size={24} color={theme.success} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  New Doctor Details
                </TamaguiText>
              </TamaguiView>

              <TamaguiText
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$md"
              >
                Fill in the details below to onboard a new doctor. Include their
                location for employee check-ins.
              </TamaguiText>

              <Input
                label="Name"
                value={formData.name}
                onChangeText={value => handleFieldChange('name', value)}
                onBlur={() => handleFieldBlur('name')}
                placeholder="Enter doctor name"
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
                label="Specialization"
                value={formData.specialization}
                onChangeText={value =>
                  handleFieldChange('specialization', value)
                }
                onBlur={() => handleFieldBlur('specialization')}
                placeholder="Enter specialization"
                icon={
                  <Ionicons
                    name="medical-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
                error={
                  touched.specialization ? errors.specialization || '' : ''
                }
              />

              <Input
                label="Phone"
                value={formData.phone}
                onChangeText={value => handleFieldChange('phone', value)}
                onBlur={() => handleFieldBlur('phone')}
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                icon={
                  <Ionicons
                    name="call-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
                error={touched.phone ? errors.phone || '' : ''}
              />

              <TamaguiView marginBottom="$lg">
                <MapPicker
                  onLocationSelect={setSelectedLocation}
                  title="Doctor Location"
                />
                {errors.location && (
                  <TamaguiText color="$error" fontSize="$3" marginTop="$xs">
                    {errors.location}
                  </TamaguiText>
                )}
              </TamaguiView>

              <ButtonPrimary
                title={loading ? 'Onboarding...' : 'Onboard Doctor'}
                onPress={handleSubmit}
                loading={loading}
                disabled={!isFormValid}
                accessibilityHint="Double tap to onboard the new doctor"
              />
            </TamaguiView>
          </TamaguiView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
