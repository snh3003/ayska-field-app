import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import {
  type Attendance,
  type Doctor,
  type Employee,
  localDataService,
  type Visit,
} from '../../services/LocalDataService';

export default function EmployeeDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [stats, setStats] = useState({
    totalDays: 0,
    completedDays: 0,
    totalVisits: 0,
    completedVisits: 0,
  });
  const [assignedDoctors, setAssignedDoctors] = useState<Doctor[]>([]);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(
    null
  );
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (id) {
      const employeeData = localDataService.getById<Employee>('employees', id);
      setEmployee(employeeData);

      const employeeStats = localDataService.getEmployeeStats(id);
      setStats(employeeStats);

      const doctors = localDataService.getAssignedDoctors(id);
      setAssignedDoctors(doctors);

      const allVisits = localDataService.getAll<Visit>('visits');
      const empVisits = allVisits
        .filter((v: Visit) => v.employeeId === id)
        .slice(-5)
        .reverse();
      setRecentVisits(empVisits);

      const today = new Date().toISOString().split('T')[0];
      const attendance = localDataService
        .getAll<Attendance>('attendance')
        .find((a: Attendance) => a.employeeId === id && a.date === today);
      setTodayAttendance(attendance || null);
    }
  }, [id]);

  if (!employee) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: theme.background }]}
      >
        <View style={styles.centerContent}>
          <Ionicons name="alert-circle" size={64} color={theme.textSecondary} />
          <Text
            style={[
              Typography.h4,
              { color: theme.textSecondary, marginTop: Spacing.md },
            ]}
          >
            Employee not found
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={[styles.backButton, { backgroundColor: theme.card }]}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[Typography.h3, { color: theme.text }]}>
            Employee Details
          </Text>
          <View style={styles.placeholder} />
        </View>

        {/* Employee Profile Card */}
        <Card variant="elevated" style={styles.profileCard}>
          <View style={styles.profileHeader}>
            <View
              style={[
                styles.avatarLarge,
                { backgroundColor: theme.primary + '15' },
              ]}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </View>
            <View style={styles.profileInfo}>
              <Text style={[Typography.h2, { color: theme.text }]}>
                {employee.name}
              </Text>
              <Text
                style={[
                  Typography.body,
                  { color: theme.textSecondary, marginTop: Spacing.xs },
                ]}
              >
                {employee.email}
              </Text>
            </View>
          </View>

          {/* Status Indicator */}
          {todayAttendance && (
            <View
              style={[
                styles.statusContainer,
                {
                  backgroundColor:
                    todayAttendance.status === 'active'
                      ? theme.success + '15'
                      : theme.textSecondary + '15',
                },
              ]}
            >
              <Ionicons
                name={
                  todayAttendance.status === 'active'
                    ? 'checkmark-circle'
                    : 'time'
                }
                size={20}
                color={
                  todayAttendance.status === 'active'
                    ? theme.success
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  Typography.bodySmall,
                  {
                    color:
                      todayAttendance.status === 'active'
                        ? theme.success
                        : theme.textSecondary,
                    marginLeft: Spacing.sm,
                    fontWeight: '600',
                  },
                ]}
              >
                {todayAttendance.status === 'active'
                  ? 'Active Today'
                  : 'Day Completed'}
              </Text>
            </View>
          )}
        </Card>

        {/* Stats Overview */}
        <View style={styles.statsGrid}>
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
            icon={
              <Ionicons name="bar-chart" size={20} color={theme.secondary} />
            }
          />
        </View>

        {/* Assigned Doctors */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h4, { color: theme.text }]}>
            Assigned Doctors
          </Text>
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>
            {assignedDoctors.length} doctor
            {assignedDoctors.length !== 1 ? 's' : ''}
          </Text>
        </View>

        {assignedDoctors.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="medical"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text
              style={[
                Typography.body,
                {
                  color: theme.textSecondary,
                  marginTop: Spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              No doctors assigned
            </Text>
          </Card>
        ) : (
          assignedDoctors.map(doctor => (
            <Card
              key={doctor.id}
              variant="outlined"
              style={{ marginBottom: Spacing.sm }}
            >
              <View style={styles.doctorRow}>
                <View
                  style={[
                    styles.doctorIcon,
                    { backgroundColor: theme.primary + '15' },
                  ]}
                >
                  <Ionicons name="person" size={24} color={theme.primary} />
                </View>
                <View style={styles.doctorInfo}>
                  <Text
                    style={[
                      Typography.body,
                      { color: theme.text, fontWeight: '600' },
                    ]}
                  >
                    {doctor.name}
                  </Text>
                  <Text
                    style={[
                      Typography.caption,
                      { color: theme.textSecondary, marginTop: Spacing.xs },
                    ]}
                  >
                    {doctor.specialization}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </View>
            </Card>
          ))
        )}

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h4, { color: theme.text }]}>
            Recent Activity
          </Text>
          <Text style={[Typography.caption, { color: theme.textSecondary }]}>
            Last {recentVisits.length} visits
          </Text>
        </View>

        {recentVisits.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="time-outline"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <Text
              style={[
                Typography.body,
                {
                  color: theme.textSecondary,
                  marginTop: Spacing.md,
                  textAlign: 'center',
                },
              ]}
            >
              No recent activity
            </Text>
          </Card>
        ) : (
          recentVisits.map(visit => {
            const doctor = localDataService.getById<Doctor>(
              'doctors',
              visit.doctorId
            );
            const isCompleted = visit.status === 'completed';

            return (
              <Card
                key={visit.id}
                variant="outlined"
                style={{ marginBottom: Spacing.sm }}
              >
                <View style={styles.visitRow}>
                  <View
                    style={[
                      styles.visitIcon,
                      {
                        backgroundColor: isCompleted
                          ? theme.success + '15'
                          : theme.warning + '15',
                      },
                    ]}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'hourglass'}
                      size={24}
                      color={isCompleted ? theme.success : theme.warning}
                    />
                  </View>
                  <View style={styles.visitInfo}>
                    <Text
                      style={[
                        Typography.body,
                        { color: theme.text, fontWeight: '600' },
                      ]}
                    >
                      Visit to {doctor?.name || 'Unknown Doctor'}
                    </Text>
                    <View style={styles.visitMeta}>
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.icon}
                      />
                      <Text
                        style={[
                          Typography.caption,
                          {
                            color: theme.textSecondary,
                            marginLeft: Spacing.xs,
                          },
                        ]}
                      >
                        {new Date(visit.checkInTime).toLocaleString()}
                      </Text>
                    </View>
                    {visit.notes && (
                      <Text
                        style={[
                          Typography.bodySmall,
                          { color: theme.textSecondary, marginTop: Spacing.xs },
                        ]}
                      >
                        {visit.notes}
                      </Text>
                    )}
                  </View>
                  <View
                    style={[
                      styles.statusBadge,
                      {
                        backgroundColor: isCompleted
                          ? theme.success
                          : theme.warning,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        Typography.caption,
                        { color: '#FFFFFF', fontWeight: '600' },
                      ]}
                    >
                      {isCompleted ? 'Done' : 'Active'}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })
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
    paddingBottom: Spacing.xxl,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 44,
  },
  profileCard: {
    padding: Spacing.lg,
  },
  profileHeader: {
    alignItems: 'center',
  },
  avatarLarge: {
    width: 96,
    height: 96,
    borderRadius: BorderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
  },
  statsGrid: {
    flexDirection: 'row',
    marginTop: Spacing.lg,
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorIcon: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  doctorInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  visitIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  visitInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  visitMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
});
