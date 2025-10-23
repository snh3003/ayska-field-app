import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { ButtonPrimary } from '../../components/ui/AyskaButtonPrimaryComponent';
import { Card } from '../../components/ui/AyskaCardComponent';
import { Input } from '../../components/ui/AyskaInputComponent';
import { localDataService } from '../../services/AyskaLocalDataService';
import { Doctor, Employee } from '../../types';

export default function ManualCheckIn() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    const employeeList = localDataService.getAll<Employee>('employees');
    const doctorList = localDataService.getAll<Doctor>('doctors');
    setEmployees(employeeList);
    setDoctors(doctorList);
    // eslint-disable-next-line no-console
    console.log(
      'Loaded employees:',
      employees.length,
      'doctors:',
      doctors.length
    );
  }, [setEmployees, setDoctors, employees.length, doctors.length]);

  const handleManualCheckIn = async () => {
    if (!selectedEmployee || !selectedDoctor) return;

    setIsSubmitting(true);
    const visit = {
      id: `v_${Date.now()}`,
      employeeId: selectedEmployee,
      doctorId: selectedDoctor,
      checkInTime: new Date().toISOString(),
      checkOutTime: new Date().toISOString(),
      notes: notes.trim() || undefined,
      status: 'completed' as const,
    };

    localDataService.add('visits', visit);
    // eslint-disable-next-line no-console
    console.log('Manual check-in created:', visit);

    // Reset form
    setSelectedEmployee('');
    setSelectedDoctor('');
    setNotes('');
    setIsSubmitting(false);
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <TamaguiView padding="$md">
        <TamaguiText
          fontSize="$6"
          fontWeight="700"
          color="$text"
          marginBottom="$lg"
        >
          Manual Check-In
        </TamaguiText>

        <Card>
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Create Manual Visit
          </TamaguiText>

          <Input
            label="Select Employee"
            placeholder="Choose an employee..."
            value={selectedEmployee}
            onChangeText={setSelectedEmployee}
          />

          <Input
            label="Select Doctor"
            placeholder="Choose a doctor..."
            value={selectedDoctor}
            onChangeText={setSelectedDoctor}
          />

          <Input
            label="Visit Notes (Optional)"
            placeholder="Add notes about this visit..."
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={3}
          />

          <ButtonPrimary
            title={isSubmitting ? 'Creating...' : 'Create Manual Visit'}
            onPress={handleManualCheckIn}
            disabled={!selectedEmployee || !selectedDoctor || isSubmitting}
          />
        </Card>
      </TamaguiView>
    </ScrollView>
  );
}
