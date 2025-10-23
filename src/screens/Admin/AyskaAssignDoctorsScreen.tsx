import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Input } from '../../components/ui/AyskaInputComponent';
import { ButtonPrimary } from '../../components/ui/AyskaButtonPrimaryComponent';
import { Dropdown } from '../../components/ui/AyskaDropdownComponent';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  createAssignment,
  fetchAssignments,
} from '../../store/slices/AyskaAssignmentSlice';
import {
  fetchAllDoctors,
  fetchAllEmployees,
} from '../../store/slices/AyskaOnboardingSlice';
import { AssignmentCard } from '../../components/business/AyskaAssignmentCardComponent';
import { CommonValidators } from '../../validation/AyskaCommonValidators';
import { FormValidator } from '../../validation/AyskaFormValidator';
import { ValidationContext } from '../../validation/AyskaValidationContext';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { hapticFeedback } from '../../../utils/haptics';
import { useToast } from '../../../contexts/ToastContext';

export default function AssignDoctorsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees, doctors } = useSelector(
    (state: RootState) => state.onboarding
  );
  const { assignments, loading } = useSelector(
    (state: RootState) => state.assignment
  );
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const [formData, setFormData] = useState({
    employee_id: '',
    doctorId: '',
    target: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchAllEmployees());
    dispatch(fetchAllDoctors());
    dispatch(fetchAssignments());
  }, [dispatch]);

  const validationRules = {
    employee_id: [CommonValidators.required('Please select an employee')],
    doctorId: [CommonValidators.required('Please select a doctor')],
    target: [CommonValidators.required('Target is required')],
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
      employee_id: true,
      doctorId: true,
      target: true,
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
    return allFieldsFilled && noErrors;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData, errors]);

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
        createAssignment({
          employee_id: formData.employeeId,
          doctor_ids: [formData.doctor_id],
          targets: [parseInt(formData.target)],
          adminId: 'a1', // Default admin ID
        })
      ).unwrap();

      // Get employee and doctor names for toast
      const employee = employees.find(emp => emp.id === formData.employeeId);
      const doctor = doctors.find(doc => doc.id === formData.doctor_id);

      // Show success toast with names and specialization
      toast.success(
        `Doctor ${doctor?.name || 'Unknown'} (${doctor?.specialization || 'Unknown'}) assigned to Employee ${employee?.name || 'Unknown'}`
      );
      hapticFeedback.success();
      setFormData({ employee_id: '', doctorId: '', target: '' });
      setErrors({});
      setTouched({});

      // Close modal instantly after successful assignment
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to assign doctor');
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

  // const selectedEmployee = employees.find(emp => emp.id === formData.employeeId);
  // const selectedDoctor = doctors.find(doc => doc.id === formData.doctor_id);

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
            Assign Doctors
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
            {/* Assignment Form */}
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
                <Ionicons name="link" size={24} color={theme.warning} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  New Assignment
                </TamaguiText>
              </TamaguiView>

              <TamaguiText
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$md"
              >
                Assign a doctor to an employee with a target number of visits.
              </TamaguiText>

              <Dropdown
                label="Employee"
                placeholder="Select employee"
                value={formData.employeeId}
                items={employees.map(emp => ({
                  id: emp.id,
                  name: emp.name,
                  subtitle: emp.email,
                }))}
                onSelect={id => handleFieldChange('employeeId', id)}
                icon={
                  <Ionicons
                    name="person-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
                error={touched.employeeId ? errors.employeeId || '' : ''}
              />

              <Dropdown
                label="Doctor"
                placeholder="Select doctor"
                value={formData.doctor_id}
                items={doctors.map(doc => ({
                  id: doc.id,
                  name: doc.name,
                  subtitle: doc.specialization,
                }))}
                onSelect={id => handleFieldChange('doctorId', id)}
                icon={
                  <Ionicons
                    name="medical-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
                error={touched.doctor_id ? errors.doctor_id || '' : ''}
              />

              <Input
                label="Target Visits"
                value={formData.target}
                onChangeText={value => handleFieldChange('target', value)}
                onBlur={() => handleFieldBlur('target')}
                placeholder="Enter target number of visits"
                keyboardType="numeric"
                icon={
                  <Ionicons
                    name="flag-outline"
                    size={20}
                    color={theme.textSecondary}
                  />
                }
                error={touched.target ? errors.target || '' : ''}
              />

              <ButtonPrimary
                title={loading ? 'Assigning...' : 'Assign Doctor'}
                onPress={handleSubmit}
                loading={loading}
                disabled={!isFormValid}
                accessibilityHint="Double tap to assign the doctor"
              />
            </TamaguiView>

            {/* Existing Assignments */}
            <TamaguiView
              backgroundColor="$card"
              borderRadius="$md"
              padding="$md"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$md"
              >
                <Ionicons name="list" size={24} color={theme.primary} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  Existing Assignments
                </TamaguiText>
              </TamaguiView>

              {assignments.length === 0 ? (
                <TamaguiView alignItems="center" padding="$lg">
                  <Ionicons
                    name="document-outline"
                    size={48}
                    color={theme.textSecondary}
                  />
                  <TamaguiText
                    fontSize="$4"
                    color="$textSecondary"
                    marginTop="$sm"
                  >
                    No assignments yet
                  </TamaguiText>
                </TamaguiView>
              ) : (
                assignments.map(assignment => {
                  const doctor = doctors.find(
                    doc => doc.id === assignment.doctor_id
                  );
                  return (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      doctorName={doctor?.name || 'Unknown'}
                    />
                  );
                })
              )}
            </TamaguiView>
          </TamaguiView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
