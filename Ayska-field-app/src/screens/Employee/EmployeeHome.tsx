import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService, type Doctor } from '../../services/LocalDataService';
import type { RootState } from '../../store';

export default function EmployeeHome() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState({ totalDays: 0, completedDays: 0, totalVisits: 0, completedVisits: 0 });
  const [isDayStarted, setIsDayStarted] = useState(false);
  const { userId } = useSelector((s: RootState) => s.auth);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (userId) {
      const assignedDoctors = localDataService.getAssignedDoctors(userId);
      const employeeStats = localDataService.getEmployeeStats(userId);
      const todayAttendance = localDataService.getAll('attendance').find(
        a => a.employeeId === userId && a.date === new Date().toISOString().split('T')[0]
      );
      
      setDoctors(assignedDoctors);
      setStats(employeeStats);
      setIsDayStarted(!!todayAttendance);
    }
  }, [userId]);

  const startDay = () => {
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      const attendance = {
        id: `at_${Date.now()}`,
        employeeId: userId,
        startTime: new Date().toISOString(),
        date: today,
        status: 'active' as const,
      };
      localDataService.add('attendance', attendance);
      setIsDayStarted(true);
    }
  };

  const endDay = () => {
    if (userId) {
      const today = new Date().toISOString().split('T')[0];
      const attendance = localDataService.getAll('attendance').find(
        a => a.employeeId === userId && a.date === today && a.status === 'active'
      );
      if (attendance) {
        localDataService.update('attendance', attendance.id, {
          endTime: new Date().toISOString(),
          status: 'completed',
        });
        setIsDayStarted(false);
      }
    }
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 20 }}>
          Dashboard
        </Text>
        
        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Days Worked" value={stats.totalDays} color="primary" />
          <StatsCard title="Visits Today" value={stats.completedVisits} color="secondary" />
        </View>

        {/* Day Actions */}
        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Today's Work
          </Text>
          {!isDayStarted ? (
            <ButtonPrimary title="Start Day" onPress={startDay} />
          ) : (
            <View>
              <Text style={{ color: theme.text, marginBottom: 12 }}>Day started - Good luck!</Text>
              <ButtonSecondary title="End Day" onPress={endDay} />
            </View>
          )}
        </Card>

        {/* Assigned Doctors */}
        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
          Assigned Doctors
        </Text>
        {doctors.length === 0 ? (
          <Card>
            <Text style={{ color: theme.text, textAlign: 'center' }}>No doctors assigned today</Text>
          </Card>
        ) : (
          doctors.map((doctor) => (
            <Card key={doctor.id} onPress={() => console.log('Navigate to doctor detail', doctor.id)}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                {doctor.name}
              </Text>
              <Text style={{ color: theme.text, opacity: 0.7, marginBottom: 8 }}>
                {doctor.specialization}
              </Text>
              <Text style={{ color: theme.text, opacity: 0.6, fontSize: 14 }}>
                📍 {doctor.location.lat.toFixed(4)}, {doctor.location.lng.toFixed(4)}
              </Text>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}


