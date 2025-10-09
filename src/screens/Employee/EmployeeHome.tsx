import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ButtonPrimary } from '../../components/ui/ButtonPrimary';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService, type Doctor, type Attendance } from '../../services/LocalDataService';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function EmployeeHome() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [stats, setStats] = useState({ totalDays: 0, completedDays: 0, totalVisits: 0, completedVisits: 0 });
  const [isDayStarted, setIsDayStarted] = useState(false);
  const { userId, name } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  useEffect(() => {
    if (userId) {
      const assignedDoctors = localDataService.getAssignedDoctors(userId);
      const employeeStats = localDataService.getEmployeeStats(userId);
      const todayAttendance = localDataService.getAll<Attendance>('attendance').find(
        (a: Attendance) => a.employeeId === userId && a.date === new Date().toISOString().split('T')[0]
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
      const attendance = localDataService.getAll<Attendance>('attendance').find(
        (a: Attendance) => a.employeeId === userId && a.date === today && a.status === 'active'
      );
      if (attendance) {
        localDataService.update<Attendance>('attendance', attendance.id, {
          endTime: new Date().toISOString(),
          status: 'completed',
        });
        setIsDayStarted(false);
      }
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[Typography.h3, { color: theme.text }]}>
              Dashboard
            </Text>
            {name && (
              <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: Spacing.xs }]}>
                Welcome back, {name}
              </Text>
            )}
          </View>
          <View style={styles.headerActions}>
            <ThemeToggle />
            <TouchableOpacity 
              onPress={handleLogout}
              style={[styles.iconButton, { backgroundColor: theme.card }]}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.error} />
            </TouchableOpacity>
          </View>
        </View>
        
        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <StatsCard 
            title="Days Worked" 
            value={stats.totalDays} 
            color="primary"
            icon={<Ionicons name="calendar" size={20} color={theme.primary} />}
          />
          <StatsCard 
            title="Total Visits" 
            value={stats.totalVisits} 
            color="secondary"
            icon={<Ionicons name="people" size={20} color={theme.secondary} />}
          />
        </View>

        {/* Day Status Card */}
        <Card variant="elevated" style={{ marginBottom: Spacing.lg }}>
          <View style={styles.dayStatusHeader}>
            <View style={[styles.statusIndicator, { 
              backgroundColor: isDayStarted ? theme.success + '15' : theme.warning + '15' 
            }]}>
              <Ionicons 
                name={isDayStarted ? "checkmark-circle" : "time"} 
                size={24} 
                color={isDayStarted ? theme.success : theme.warning} 
              />
            </View>
            <View style={{ flex: 1, marginLeft: Spacing.md }}>
              <Text style={[Typography.h4, { color: theme.text }]}>
                {isDayStarted ? "Day in Progress" : "Start Your Day"}
              </Text>
              <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: Spacing.xs }]}>
                {isDayStarted ? "Track your visits and activities" : "Begin tracking your work today"}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: Spacing.md }}>
            {!isDayStarted ? (
              <ButtonPrimary title="Start Day" onPress={startDay} />
            ) : (
              <ButtonSecondary title="End Day" onPress={endDay} />
            )}
          </View>
        </Card>

        {/* Assigned Doctors */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h4, { color: theme.text }]}>
            Assigned Doctors
          </Text>
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>
            {doctors.length} doctor{doctors.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {doctors.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons name="medical" size={48} color={theme.textSecondary} style={{ opacity: 0.3 }} />
            <Text style={[Typography.body, { color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center' }]}>
              No doctors assigned today
            </Text>
          </Card>
        ) : (
          doctors.map((doctor) => (
            <Card 
              key={doctor.id} 
              onPress={() => router.push(`/doctor/${doctor.id}` as any)}
              variant="elevated"
            >
              <View style={styles.doctorCard}>
                <View style={[styles.doctorIcon, { backgroundColor: theme.primary + '15' }]}>
                  <Ionicons name="person" size={24} color={theme.primary} />
                </View>
                <View style={styles.doctorInfo}>
                  <Text style={[Typography.h4, { color: theme.text, fontSize: 18 }]}>
                    {doctor.name}
                  </Text>
                  <Text style={[Typography.bodySmall, { color: theme.textSecondary, marginTop: Spacing.xs }]}>
                    {doctor.specialization}
                  </Text>
                  <View style={styles.locationContainer}>
                    <Ionicons name="location" size={14} color={theme.icon} />
                    <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: Spacing.xs }]}>
                      {doctor.location.lat.toFixed(4)}, {doctor.location.lng.toFixed(4)}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </View>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: Spacing.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  dayStatusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
});


