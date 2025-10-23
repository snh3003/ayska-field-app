import { BorderRadius, Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/AyskaCardComponent';
import { StatsCard } from '../../components/ui/AyskaStatsCardComponent';
import { localDataService } from '../../services/AyskaLocalDataService';
import { Attendance, Doctor, Employee, Visit } from '../../types';

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
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <TamaguiView
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        >
          <Ionicons name="alert-circle" size={64} color={theme.textSecondary} />
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$textSecondary"
            marginTop="$md"
          >
            Employee not found
          </TamaguiText>
        </TamaguiView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingBottom: Spacing.xxl,
        }}
      >
        {/* Header */}
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$lg"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: BorderRadius.full,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.card,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <TamaguiText fontSize="$6" fontWeight="700" color="$text">
            Employee Details
          </TamaguiText>
          <TamaguiView width={44} />
        </TamaguiView>

        {/* Employee Profile Card */}
        <Card variant="elevated" style={{ padding: Spacing.lg }}>
          <TamaguiView alignItems="center">
            <TamaguiView
              width={96}
              height={96}
              borderRadius="$xl"
              justifyContent="center"
              alignItems="center"
              marginBottom="$md"
              backgroundColor={theme.avatarBg}
            >
              <Ionicons name="person" size={48} color={theme.primary} />
            </TamaguiView>
            <TamaguiView alignItems="center">
              <TamaguiText fontSize="$7" fontWeight="700" color="$text">
                {employee.name}
              </TamaguiText>
              <TamaguiText
                fontSize="$4"
                lineHeight="$6"
                color="$textSecondary"
                marginTop="$xs"
              >
                {employee.email}
              </TamaguiText>
            </TamaguiView>
          </TamaguiView>

          {/* Status Indicator */}
          {todayAttendance && (
            <TamaguiView
              flexDirection="row"
              alignItems="center"
              justifyContent="center"
              marginTop="$md"
              paddingHorizontal="$md"
              paddingVertical="$sm"
              borderRadius="$md"
              backgroundColor={
                todayAttendance.status === 'active'
                  ? theme.successBg
                  : theme.iconBg
              }
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
              <TamaguiText
                fontSize="$3"
                lineHeight="$5"
                color={
                  todayAttendance.status === 'active'
                    ? theme.success
                    : theme.textSecondary
                }
                marginLeft="$sm"
                fontWeight="600"
              >
                {todayAttendance.status === 'active'
                  ? 'Active Today'
                  : 'Day Completed'}
              </TamaguiText>
            </TamaguiView>
          )}
        </Card>

        {/* Stats Overview */}
        <TamaguiView
          flexDirection="row"
          gap="$md"
          marginTop="$lg"
          marginBottom="$lg"
        >
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
        </TamaguiView>

        {/* Assigned Doctors */}
        <TamaguiView marginTop="$lg" marginBottom="$md">
          <TamaguiText fontSize="$5" fontWeight="600" color="$text">
            Assigned Doctors
          </TamaguiText>
          <TamaguiText fontSize="$2" lineHeight="$4" color="$textSecondary">
            {assignedDoctors.length} doctor
            {assignedDoctors.length !== 1 ? 's' : ''}
          </TamaguiText>
        </TamaguiView>

        {assignedDoctors.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="medical"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color="$textSecondary"
              marginTop="$md"
              textAlign="center"
            >
              No doctors assigned
            </TamaguiText>
          </Card>
        ) : (
          assignedDoctors.map(doctor => (
            <Card
              key={doctor.id}
              variant="outlined"
              style={{ marginBottom: Spacing.sm }}
            >
              <TamaguiView
                style={{ flexDirection: 'row', alignItems: 'center' }}
              >
                <TamaguiView
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: BorderRadius.sm,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: theme.primaryBg,
                  }}
                >
                  <Ionicons name="person" size={24} color={theme.primary} />
                </TamaguiView>
                <TamaguiView style={{ flex: 1, marginLeft: Spacing.md }}>
                  <TamaguiText
                    fontSize="$4"
                    lineHeight="$6"
                    color="$text"
                    fontWeight="600"
                  >
                    {doctor.name}
                  </TamaguiText>
                  <TamaguiText
                    fontSize="$2"
                    lineHeight="$4"
                    color="$textSecondary"
                    marginTop="$xs"
                  >
                    {doctor.specialization}
                  </TamaguiText>
                </TamaguiView>
                <Ionicons name="chevron-forward" size={20} color={theme.icon} />
              </TamaguiView>
            </Card>
          ))
        )}

        {/* Recent Activity */}
        <TamaguiView
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: Spacing.lg,
            marginBottom: Spacing.md,
          }}
        >
          <TamaguiText fontSize="$5" fontWeight="600" color="$text">
            Recent Activity
          </TamaguiText>
          <TamaguiText fontSize="$2" lineHeight="$4" color="$textSecondary">
            Last {recentVisits.length} visits
          </TamaguiText>
        </TamaguiView>

        {recentVisits.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="time-outline"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color="$textSecondary"
              marginTop="$md"
              textAlign="center"
            >
              No recent activity
            </TamaguiText>
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
                <TamaguiView
                  style={{ flexDirection: 'row', alignItems: 'center' }}
                >
                  <TamaguiView
                    style={{
                      width: 48,
                      height: 48,
                      borderRadius: BorderRadius.md,
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: isCompleted
                        ? theme.successBg
                        : theme.warningBg,
                    }}
                  >
                    <Ionicons
                      name={isCompleted ? 'checkmark-circle' : 'hourglass'}
                      size={24}
                      color={isCompleted ? theme.success : theme.warning}
                    />
                  </TamaguiView>
                  <TamaguiView style={{ flex: 1, marginLeft: Spacing.md }}>
                    <TamaguiText
                      fontSize="$4"
                      lineHeight="$6"
                      color="$text"
                      fontWeight="600"
                    >
                      Visit to {doctor?.name || 'Unknown Doctor'}
                    </TamaguiText>
                    <TamaguiView
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: Spacing.xs,
                      }}
                    >
                      <Ionicons
                        name="time-outline"
                        size={14}
                        color={theme.icon}
                      />
                      <TamaguiText
                        fontSize="$2"
                        lineHeight="$4"
                        color="$textSecondary"
                        marginLeft="$xs"
                      >
                        {new Date(visit.checkInTime).toLocaleString()}
                      </TamaguiText>
                    </TamaguiView>
                    {visit.notes && (
                      <TamaguiText
                        fontSize="$3"
                        lineHeight="$5"
                        color="$textSecondary"
                        marginTop="$xs"
                      >
                        {visit.notes}
                      </TamaguiText>
                    )}
                  </TamaguiView>
                  <TamaguiView
                    style={{
                      paddingHorizontal: Spacing.sm,
                      paddingVertical: Spacing.xs,
                      borderRadius: BorderRadius.sm,
                      backgroundColor: isCompleted ? '$success' : '$warning',
                    }}
                  >
                    <TamaguiText
                      fontSize="$2"
                      lineHeight="$4"
                      color="#FFFFFF"
                      fontWeight="600"
                    >
                      {isCompleted ? 'Done' : 'Active'}
                    </TamaguiText>
                  </TamaguiView>
                </TamaguiView>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
