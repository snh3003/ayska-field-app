// Doctor Form Component - Complete UI for doctor creation and editing
// Implements doctor form with validation and error handling

import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../contexts/ToastContext';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaActionButtonComponent } from '../ui/AyskaActionButtonComponent';
import { Input } from '../ui/AyskaInputComponent';
import { Card } from '../ui/AyskaCardComponent';
import { Skeleton } from '../feedback/AyskaSkeletonLoaderComponent';
import { ErrorBoundary } from '../feedback/AyskaErrorBoundaryComponent';
import { FormValidator } from '../../validation/AyskaFormValidator';
import { CommonValidators } from '../../validation/AyskaCommonValidators';
import {
  clearError,
  createDoctor,
  selectDoctorError,
  selectDoctorLoading,
  updateDoctor,
} from '../../store/slices/AyskaDoctorSlice';
import type { AppDispatch } from '../../store';
import type { Doctor } from '../../types/AyskaDoctorApiType';

interface DoctorFormComponentProps {
  doctor?: Doctor | null;
  onSuccess?: (_doctor: Doctor) => void;
  onCancel?: () => void;
  style?: any;
  accessibilityHint?: string;
}

export const DoctorFormComponent: React.FC<DoctorFormComponentProps> = ({
  doctor,
  onSuccess,
  onCancel,
  style,
  accessibilityHint,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const loading = useSelector(selectDoctorLoading);
  const error = useSelector(selectDoctorError);

  const [formData, setFormData] = useState({
    name: doctor?.name || '',
    specialization: doctor?.specialization || '',
    phone: doctor?.phone || '',
    email: doctor?.email || '',
    location_lat: doctor?.location_lat?.toString() || '',
    location_lng: doctor?.location_lng?.toString() || '',
    address: doctor?.address || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Form validation
  const formValidator = new FormValidator();
  const validationRules = {
    name: [CommonValidators.required('Name is required')],
    specialization: [CommonValidators.required('Specialization is required')],
    phone: [
      CommonValidators.required('Phone is required'),
      CommonValidators.pattern(
        /^[0-9+\-\s()]+$/,
        'Invalid phone number format'
      ),
    ],
    email: [
      CommonValidators.required('Email is required'),
      CommonValidators.email,
    ],
    location_lat: [
      CommonValidators.required('Latitude is required'),
      CommonValidators.pattern(/^-?\d+\.?\d*$/, 'Invalid latitude format'),
    ],
    location_lng: [
      CommonValidators.required('Longitude is required'),
      CommonValidators.pattern(/^-?\d+\.?\d*$/, 'Invalid longitude format'),
    ],
    address: [CommonValidators.required('Address is required')],
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (touched[field]) {
      const context = new FormValidator();
      validationRules[field as keyof typeof validationRules]?.forEach(rule =>
        context.addRule(rule)
      );
      const result = context.validate(value);
      setErrors(prev => ({ ...prev, [field]: result.error || '' }));
    }
  };

  // Handle input blur
  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const context = new FormValidator();
    validationRules[field as keyof typeof validationRules]?.forEach(rule =>
      context.addRule(rule)
    );
    const result = context.validate(formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: result.error || '' }));
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors = formValidator.validateForm(formData, validationRules);
    setErrors(newErrors);
    setTouched({
      name: true,
      specialization: true,
      phone: true,
      email: true,
      location_lat: true,
      location_lng: true,
      address: true,
    });
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    hapticFeedback.medium();

    if (!validateForm()) {
      showToast('Please fix the errors before submitting.', 'error');
      return;
    }

    try {
      const payload = {
        name: formData.name,
        specialization: formData.specialization,
        phone: formData.phone,
        email: formData.email,
        location_lat: parseFloat(formData.location_lat),
        location_lng: parseFloat(formData.location_lng),
        address: formData.address,
      };

      if (doctor) {
        // Update existing doctor
        await dispatch(updateDoctor({ id: doctor.id, data: payload }));
        showToast('Doctor updated successfully!', 'success');
      } else {
        // Create new doctor
        await dispatch(createDoctor(payload));
        showToast('Doctor created successfully!', 'success');
      }

      onSuccess?.(doctor || ({} as Doctor));
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to save doctor:', error);
      }
    }
  };

  // Handle cancel
  const handleCancel = () => {
    hapticFeedback.light();
    onCancel?.();
  };

  // Clear error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  // Render loading skeleton
  if (loading) {
    return (
      <View style={style}>
        {[...Array(8)].map((_, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={60} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <ErrorBoundary style={style} accessibilityHint={accessibilityHint}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <AyskaTitleComponent
          level={2}
          weight="bold"
          style={{ marginBottom: 24 }}
        >
          {doctor ? 'Edit Doctor' : 'Add New Doctor'}
        </AyskaTitleComponent>

        <Card style={{ marginBottom: 16 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Basic Information
          </AyskaTitleComponent>

          <Input
            label="Name"
            placeholder="Enter doctor name"
            value={formData.name}
            onChangeText={value => handleInputChange('name', value)}
            onBlur={() => handleInputBlur('name')}
            error={errors.name}
            style={{ marginBottom: 16 }}
            {...getA11yProps('Doctor name input')}
          />

          <Input
            label="Specialization"
            placeholder="Enter specialization"
            value={formData.specialization}
            onChangeText={value => handleInputChange('specialization', value)}
            onBlur={() => handleInputBlur('specialization')}
            error={errors.specialization}
            style={{ marginBottom: 16 }}
            {...getA11yProps('Doctor specialization input')}
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Contact Information
          </AyskaTitleComponent>

          <Input
            label="Phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChangeText={value => handleInputChange('phone', value)}
            onBlur={() => handleInputBlur('phone')}
            error={errors.phone}
            keyboardType="phone-pad"
            style={{ marginBottom: 16 }}
            {...getA11yProps('Doctor phone number input')}
          />

          <Input
            label="Email"
            placeholder="Enter email address"
            value={formData.email}
            onChangeText={value => handleInputChange('email', value)}
            onBlur={() => handleInputBlur('email')}
            error={errors.email}
            keyboardType="email-address"
            style={{ marginBottom: 16 }}
            {...getA11yProps('Doctor email input')}
          />
        </Card>

        <Card style={{ marginBottom: 16 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Location Information
          </AyskaTitleComponent>

          <View style={{ flexDirection: 'row', marginBottom: 16 }}>
            <Input
              label="Latitude"
              placeholder="Enter latitude"
              value={formData.location_lat}
              onChangeText={value => handleInputChange('location_lat', value)}
              onBlur={() => handleInputBlur('location_lat')}
              error={errors.location_lat}
              keyboardType="numeric"
              style={{ flex: 1, marginRight: 8 }}
              {...getA11yProps('Doctor latitude input')}
            />

            <Input
              label="Longitude"
              placeholder="Enter longitude"
              value={formData.location_lng}
              onChangeText={value => handleInputChange('location_lng', value)}
              onBlur={() => handleInputBlur('location_lng')}
              error={errors.location_lng}
              keyboardType="numeric"
              style={{ flex: 1, marginLeft: 8 }}
              {...getA11yProps('Doctor longitude input')}
            />
          </View>

          <Input
            label="Address"
            placeholder="Enter full address"
            value={formData.address}
            onChangeText={value => handleInputChange('address', value)}
            onBlur={() => handleInputBlur('address')}
            error={errors.address}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 16 }}
            {...getA11yProps('Doctor address input')}
          />
        </Card>

        <View style={{ flexDirection: 'row', marginTop: 24 }}>
          <AyskaActionButtonComponent
            variant="secondary"
            onPress={handleCancel}
            style={{ flex: 1, marginRight: 8 }}
            disabled={loading}
            {...getA11yProps('Cancel doctor form')}
          >
            Cancel
          </AyskaActionButtonComponent>

          <AyskaActionButtonComponent
            variant="primary"
            onPress={handleSubmit}
            style={{ flex: 1, marginLeft: 8 }}
            loading={loading}
            disabled={loading}
            {...getA11yProps('Save doctor information')}
          >
            {doctor ? 'Update Doctor' : 'Create Doctor'}
          </AyskaActionButtonComponent>
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};
