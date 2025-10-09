import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { localDataService, type Doctor, type Visit } from '../../services/LocalDataService';
import type { RootState } from '../../store';

interface DoctorDetailProps {
  doctorId: string;
}

export default function DoctorDetail({ doctorId }: DoctorDetailProps) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [currentVisit, setCurrentVisit] = useState<Visit | null>(null);
  const [notes, setNotes] = useState('');
  const { userId } = useSelector((s: RootState) => s.auth);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  React.useEffect(() => {
    const doctorData = localDataService.getById<Doctor>('doctors', doctorId);
    setDoctor(doctorData);
    
    // Check for active visit
    const activeVisit = localDataService.getAll('visits').find(
      v => v.doctorId === doctorId && v.employeeId === userId && v.status === 'in_progress'
    );
    setCurrentVisit(activeVisit || null);
  }, [doctorId, userId]);

  const checkIn = () => {
    if (userId && doctor) {
      const visit: Visit = {
        id: `v_${Date.now()}`,
        employeeId: userId,
        doctorId: doctor.id,
        checkInTime: new Date().toISOString(),
        status: 'in_progress',
      };
      localDataService.add('visits', visit);
      setCurrentVisit(visit);
    }
  };

  const checkOut = () => {
    if (currentVisit) {
      localDataService.update('visits', currentVisit.id, {
        checkOutTime: new Date().toISOString(),
        status: 'completed',
        notes: notes.trim() || undefined,
      });
      setCurrentVisit(null);
      setNotes('');
    }
  };

  if (!doctor) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>Doctor not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Card>
          <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 8 }}>
            {doctor.name}
          </Text>
          <Text style={{ fontSize: 16, color: theme.text, opacity: 0.7, marginBottom: 12 }}>
            {doctor.specialization}
          </Text>
          <Text style={{ fontSize: 14, color: theme.text, opacity: 0.6 }}>
            📍 {doctor.location.lat.toFixed(4)}, {doctor.location.lng.toFixed(4)}
          </Text>
          {doctor.phone && (
            <Text style={{ fontSize: 14, color: theme.text, opacity: 0.6, marginTop: 4 }}>
              📞 {doctor.phone}
            </Text>
          )}
        </Card>

        <Card style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Visit Status
          </Text>
          {!currentVisit ? (
            <View>
              <Text style={{ color: theme.text, marginBottom: 12 }}>Ready to check in</Text>
              <ButtonPrimary title="Check In" onPress={checkIn} />
            </View>
          ) : (
            <View>
              <Text style={{ color: theme.text, marginBottom: 12 }}>
                Visit in progress since {new Date(currentVisit.checkInTime).toLocaleTimeString()}
              </Text>
              <Input
                label="Visit Notes"
                placeholder="Add notes about this visit..."
                value={notes}
                onChangeText={setNotes}
                multiline
                numberOfLines={3}
              />
              <View style={{ flexDirection: 'row', marginTop: 12 }}>
                <ButtonPrimary title="Check Out" onPress={checkOut} style={{ flex: 1, marginRight: 8 }} />
                <ButtonSecondary title="Cancel" onPress={() => setCurrentVisit(null)} style={{ flex: 1 }} />
              </View>
            </View>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}


