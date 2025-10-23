// Check-in Component - Complete UI for employee check-in system
// Implements check-in functionality with location validation and feedback

import React, { useEffect, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../contexts/ToastContext';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaActionButtonComponent } from '../ui/AyskaActionButtonComponent';
import { Input } from '../ui/AyskaInputComponent';
import { Card } from '../ui/AyskaCardComponent';
import { Skeleton } from '../feedback/AyskaSkeletonLoaderComponent';
import { ErrorBoundary } from '../feedback/AyskaErrorBoundaryComponent';
import { FormValidator } from '../../validation/AyskaFormValidator';
import { ValidationContext } from '../../validation/AyskaValidationContext';
import {
  clearError,
  fetchEmployeeProfile,
  selectCheckInError,
  selectCheckInLoading,
  selectEmployeeProfile,
  selectLastCheckIn,
  submitCheckIn,
} from '../../store/slices/AyskaCheckInSlice';
import type { AppDispatch } from '../../store';
import type { CheckinRequest } from '../../types/AyskaCheckInApiType';

interface CheckInComponentProps {
  doctorId: string;
  doctorName?: string;
  doctorSpecialization?: string;
  onCheckInSuccess?: (_result: any) => void;
  onCheckInError?: (_error: string) => void;
  style?: any;
  accessibilityHint?: string;
}

export const CheckInComponent: React.FC<CheckInComponentProps> = ({
  doctorId,
  doctorName,
  doctorSpecialization,
  onCheckInSuccess,
  onCheckInError,
  style,
  accessibilityHint,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const employeeProfile = useSelector(selectEmployeeProfile);
  const loading = useSelector(selectCheckInLoading);
  const error = useSelector(selectCheckInError);
  const lastCheckIn = useSelector(selectLastCheckIn);

  const [formData, setFormData] = useState({
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Load employee profile on mount
  useEffect(() => {
    dispatch(fetchEmployeeProfile());
  }, [dispatch]);

  // Get current location
  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            position => {
              setCurrentLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              });
            },
            error => {
              if (__DEV__) {
                console.error('Location error:', error);
              }
              showToast(
                'Unable to get your current location. Please enable location services.',
                'error'
              );
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
          );
        }
      } catch (error) {
        if (__DEV__) {
          console.error('Location error:', error);
        }
      }
    };

    getCurrentLocation();
  }, [showToast]);

  // Form validation
  const formValidator = new FormValidator();
  const validationRules = {
    notes: [
      // Optional field, no required validator
    ],
  };

  // Handle input change
  const handleInputChange = (field: string, value: string) => {
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

  // Handle input blur
  const handleInputBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    const context = new ValidationContext();
    validationRules[field as keyof typeof validationRules]?.forEach(rule =>
      context.addRule(rule)
    );
    const result = context.validate(formData[field as keyof typeof formData]);
    setErrors(prev => ({ ...prev, [field]: result.error || '' }));
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors = formValidator.validateForm(formData, validationRules);
    setErrors(newErrors);
    setTouched({ notes: true });
    return Object.keys(newErrors).length === 0;
  };

  // Handle check-in submission
  const handleCheckIn = async () => {
    hapticFeedback.medium();

    if (!currentLocation) {
      showToast('Please enable location services to check in.', 'error');
      return;
    }

    if (!validateForm()) {
      showToast('Please fix the errors before checking in.', 'error');
      return;
    }

    try {
      const payload: CheckinRequest = {
        doctor_id: doctorId,
        latitude: currentLocation.lat,
        longitude: currentLocation.lng,
        notes: formData.notes.trim() || undefined,
      };

      const _result = await dispatch(submitCheckIn(payload));

      if (_result.payload) {
        const checkInResult = _result.payload as any;

        if (checkInResult.is_valid) {
          showToast(`You have successfully checked in with ${doctorName || 'the doctor'}.`, 'success');
          onCheckInSuccess?.(checkInResult);
        } else {
          showToast(`You are too far from the doctor's location. Distance: ${checkInResult.distance_meters}m`, 'warning');
          onCheckInError?.(
            `Distance exceeded: ${checkInResult.distance_meters}m`
          );
        }
      }
    } catch (error) {
      if (__DEV__) {
        console.error('Check-in failed:', error);
      }
      onCheckInError?.(error as string);
    }
  };

  // Clear error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  // Render loading skeleton
  if (loading && !employeeProfile) {
    return (
      <View style={style}>
        {[...Array(4)].map((_, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={80} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView showsVerticalScrollIndicator={false} style={style}>
        <AyskaTitleComponent
          level={2}
          weight="bold"
          style={{ marginBottom: 24 }}
        >
          Check-in with Doctor
        </AyskaTitleComponent>

        {/* Doctor Information */}
        <Card style={{ marginBottom: 24 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Doctor Information
          </AyskaTitleComponent>

          <AyskaTextComponent
            variant="bodyLarge"
            weight="semibold"
            style={{ marginBottom: 4 }}
          >
            {doctorName || 'Doctor Name'}
          </AyskaTextComponent>

          {doctorSpecialization && (
            <AyskaTextComponent
              variant="body"
              color="textSecondary"
              style={{ marginBottom: 8 }}
            >
              {doctorSpecialization}
            </AyskaTextComponent>
          )}

          <AyskaTextComponent variant="bodySmall" color="textSecondary">
            Doctor ID: {doctorId}
          </AyskaTextComponent>
        </Card>

        {/* Location Status */}
        <Card style={{ marginBottom: 24 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 12 }}
          >
            Location Status
          </AyskaTitleComponent>

          {currentLocation ? (
            <View>
              <AyskaTextComponent
                variant="body"
                color="success"
                style={{ marginBottom: 8 }}
              >
                ✓ Location detected
              </AyskaTextComponent>
              <AyskaTextComponent variant="bodySmall" color="textSecondary">
                Latitude: {currentLocation.lat.toFixed(6)}
              </AyskaTextComponent>
              <AyskaTextComponent variant="bodySmall" color="textSecondary">
                Longitude: {currentLocation.lng.toFixed(6)}
              </AyskaTextComponent>
            </View>
          ) : (
            <AyskaTextComponent variant="body" color="error">
              ⚠ Location not available
            </AyskaTextComponent>
          )}
        </Card>

        {/* Employee Profile */}
        {employeeProfile && (
          <Card style={{ marginBottom: 24 }}>
            <AyskaTitleComponent
              level={3}
              weight="semibold"
              style={{ marginBottom: 12 }}
            >
              Your Performance
            </AyskaTitleComponent>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              <View style={{ flex: 1, marginRight: 8, marginBottom: 8 }}>
                <AyskaTextComponent variant="bodySmall" color="textSecondary">
                  Total Check-ins
                </AyskaTextComponent>
                <AyskaTextComponent variant="bodyLarge" weight="semibold">
                  {employeeProfile.total_checkins}
                </AyskaTextComponent>
              </View>

              <View style={{ flex: 1, marginLeft: 8, marginBottom: 8 }}>
                <AyskaTextComponent variant="bodySmall" color="textSecondary">
                  Success Rate
                </AyskaTextComponent>
                <AyskaTextComponent
                  variant="bodyLarge"
                  weight="semibold"
                  color="success"
                >
                  {(employeeProfile.success_rate * 100).toFixed(1)}%
                </AyskaTextComponent>
              </View>

              <View style={{ flex: 1, marginRight: 8 }}>
                <AyskaTextComponent variant="bodySmall" color="textSecondary">
                  Active Assignments
                </AyskaTextComponent>
                <AyskaTextComponent variant="bodyLarge" weight="semibold">
                  {employeeProfile.active_assignments}
                </AyskaTextComponent>
              </View>

              <View style={{ flex: 1, marginLeft: 8 }}>
                <AyskaTextComponent variant="bodySmall" color="textSecondary">
                  Completed
                </AyskaTextComponent>
                <AyskaTextComponent
                  variant="bodyLarge"
                  weight="semibold"
                  color="primary"
                >
                  {employeeProfile.completed_assignments}
                </AyskaTextComponent>
              </View>
            </View>
          </Card>
        )}

        {/* Check-in Form */}
        <Card style={{ marginBottom: 24 }}>
          <AyskaTitleComponent
            level={3}
            weight="semibold"
            style={{ marginBottom: 16 }}
          >
            Check-in Details
          </AyskaTitleComponent>

          <Input
            label="Notes (Optional)"
            placeholder="Add any notes about this visit..."
            value={formData.notes}
            onChangeText={value => handleInputChange('notes', value)}
            onBlur={() => handleInputBlur('notes')}
            error={errors.notes}
            multiline
            numberOfLines={3}
            style={{ marginBottom: 16 }}
          />

          <AyskaTextComponent
            variant="bodySmall"
            color="textSecondary"
            style={{ marginBottom: 16 }}
          >
            Make sure you are within the doctor&apos;s location radius before
            checking in.
          </AyskaTextComponent>
        </Card>

        {/* Check-in Button */}
        <AyskaActionButtonComponent
          variant="primary"
          size="lg"
          onPress={handleCheckIn}
          loading={loading}
          disabled={loading || !currentLocation}
          style={{ marginBottom: 16 }}
          {...getA11yProps('Submit check-in for this doctor')}
        >
          {loading ? 'Checking In...' : 'Check In'}
        </AyskaActionButtonComponent>

        {/* Last Check-in Result */}
        {lastCheckIn && (
          <Card
            style={{
              backgroundColor: lastCheckIn.is_valid ? '#f0f9ff' : '#fef2f2',
            }}
          >
            <AyskaTitleComponent
              level={4}
              weight="semibold"
              style={{ marginBottom: 8 }}
            >
              Last Check-in Result
            </AyskaTitleComponent>

            <AyskaTextComponent
              variant="body"
              color={lastCheckIn.is_valid ? 'success' : 'error'}
              style={{ marginBottom: 4 }}
            >
              {lastCheckIn.is_valid ? '✓ Valid Check-in' : '✗ Invalid Check-in'}
            </AyskaTextComponent>

            <AyskaTextComponent variant="bodySmall" color="textSecondary">
              Distance: {lastCheckIn.distance_meters}m
            </AyskaTextComponent>

            {lastCheckIn.assignment_progress !== undefined && (
              <AyskaTextComponent
                variant="bodySmall"
                color="textSecondary"
                style={{ marginTop: 4 }}
              >
                Progress: {lastCheckIn.assignment_progress}/
                {lastCheckIn.assignment_target || 'N/A'}
              </AyskaTextComponent>
            )}
          </Card>
        )}
      </ScrollView>
    </ErrorBoundary>
  );
};
