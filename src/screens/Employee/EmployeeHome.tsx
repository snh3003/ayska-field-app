import { BorderRadius, Colors, Spacing, Typography } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import {
  type Attendance,
  localDataService,
} from '../../services/LocalDataService';
import { ThemeToggle } from '../../components/layout/ThemeToggle';
import { Logo } from '../../components/layout/Logo';
import { SearchBar } from '../../components/forms/SearchBar';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ListItemSkeleton } from '../../components/feedback/SkeletonLoader';
import { useAuth } from '../../../hooks/useAuth';
import { useDoctors } from '../../../hooks/useDoctors';
import { useToast } from '../../../contexts/ToastContext';
import { formatRelativeTime } from '../../../utils/dateTime';
import { hapticFeedback } from '../../../utils/haptics';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Dynamic spacing based on platform and screen size
const getResponsiveSpacing = () => {
  const isTablet = SCREEN_WIDTH >= 768;
  const isSmallScreen = SCREEN_WIDTH < 375;
  const platformMultiplier = Platform.OS === 'ios' ? 1.1 : 1;

  return {
    headerMargin: isTablet
      ? Spacing.xl
      : isSmallScreen
        ? Spacing.md
        : Spacing.lg * platformMultiplier,
    logoMargin: isTablet
      ? Spacing.lg
      : isSmallScreen
        ? Spacing.sm
        : Spacing.md * platformMultiplier,
    buttonGap: isTablet
      ? Spacing.md
      : isSmallScreen
        ? Spacing.xs
        : Spacing.sm * platformMultiplier,
  };
};

export default function EmployeeHome() {
  const [isDayStarted, setIsDayStarted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout: handleLogout } = useAuth();
  const { doctors, loading, refresh } = useDoctors(user.id ?? undefined);
  const toast = useToast();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  // Stats calculation
  const stats = user.id
    ? localDataService.getEmployeeStats(user.id)
    : { totalDays: 0, completedDays: 0, totalVisits: 0, completedVisits: 0 };

  // Check if day is started
  React.useEffect(() => {
    if (user.id) {
      const todayAttendance = localDataService
        .getAll<Attendance>('attendance')
        .find(
          (a: Attendance) =>
            a.employeeId === user.id &&
            a.date === new Date().toISOString().split('T')[0]
        );
      setIsDayStarted(!!todayAttendance);
    }
  }, [user.id]);

  const onRefresh = useCallback(() => {
    hapticFeedback.light();
    refresh();
  }, [refresh]);

  const startDay = () => {
    if (user.id) {
      const today = new Date().toISOString().split('T')[0];
      const attendance = {
        id: `at_${Date.now()}`,
        employeeId: user.id,
        startTime: new Date().toISOString(),
        date: today,
        status: 'active' as const,
      };
      localDataService.add('attendance', attendance);
      setIsDayStarted(true);
      hapticFeedback.success();
      toast.success('Day started successfully!');
    }
  };

  const endDay = () => {
    if (user.id) {
      const today = new Date().toISOString().split('T')[0];
      const attendance = localDataService
        .getAll<Attendance>('attendance')
        .find(
          (a: Attendance) =>
            a.employeeId === user.id &&
            a.date === today &&
            a.status === 'active'
        );
      if (attendance) {
        localDataService.update<Attendance>('attendance', attendance.id, {
          endTime: new Date().toISOString(),
          status: 'completed',
        });
        setIsDayStarted(false);
        hapticFeedback.success();
        toast.success('Day ended successfully!');
      }
    }
  };

  const handleDoctorPress = (doctorId: string) => {
    hapticFeedback.light();
    router.push(`/doctor/${doctorId}` as any);
  };

  const handleLogoutPress = () => {
    hapticFeedback.medium();
    handleLogout();
  };

  // Filter doctors based on search
  const filteredDoctors = doctors.filter(
    doctor =>
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
          />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          {/* Logo Row */}
          <View style={styles.logoRow}>
            <Logo size="responsive" style={styles.dashboardLogo} />
          </View>

          {/* Welcome & Actions Row */}
          <View style={styles.welcomeRow}>
            {user.name && (
              <Text
                style={[Typography.bodySmall, { color: theme.textSecondary }]}
              >
                Welcome, {user.name}
              </Text>
            )}
            <View style={styles.headerActions}>
              <ThemeToggle />
              <TouchableOpacity
                onPress={handleLogoutPress}
                style={[styles.iconButton, { backgroundColor: theme.card }]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={theme.error}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsRow}>
          <StatsCard
            icon={
              <Ionicons
                name="calendar-outline"
                size={24}
                color={theme.primary}
              />
            }
            title="Total Days"
            value={stats.totalDays.toString()}
          />
          <StatsCard
            icon={
              <Ionicons
                name="checkmark-done-outline"
                size={24}
                color={theme.success}
              />
            }
            title="Completed"
            value={stats.completedDays.toString()}
            color="success"
          />
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            icon={
              <Ionicons
                name="people-outline"
                size={24}
                color={theme.secondary}
              />
            }
            title="Total Visits"
            value={stats.totalVisits.toString()}
            color="secondary"
          />
          <StatsCard
            icon={
              <Ionicons
                name="trending-up-outline"
                size={24}
                color={theme.info}
              />
            }
            title="Finished"
            value={stats.completedVisits.toString()}
            color="info"
          />
        </View>

        {/* Day Control */}
        <Card variant="elevated">
          <View style={styles.dayControl}>
            <View style={styles.dayControlText}>
              <Text
                style={[
                  Typography.h4,
                  { color: theme.text, marginBottom: Spacing.xs },
                ]}
              >
                {isDayStarted ? 'Day In Progress' : 'Start Your Day'}
              </Text>
              <Text
                style={[Typography.bodySmall, { color: theme.textSecondary }]}
              >
                {isDayStarted
                  ? 'Track your visits and activities'
                  : 'Begin tracking your field activities'}
              </Text>
            </View>
            <TouchableOpacity
              onPress={isDayStarted ? endDay : startDay}
              style={[
                styles.dayButton,
                {
                  backgroundColor: isDayStarted
                    ? theme.error + '15'
                    : theme.success + '15',
                },
              ]}
            >
              <Ionicons
                name={isDayStarted ? 'stop-circle' : 'play-circle'}
                size={24}
                color={isDayStarted ? theme.error : theme.success}
              />
            </TouchableOpacity>
          </View>
        </Card>

        {/* Search Bar */}
        <SearchBar placeholder="Search doctors..." onSearch={setSearchQuery} />

        {/* Assigned Doctors */}
        <View style={styles.section}>
          <Text
            style={[
              Typography.h4,
              { color: theme.text, marginBottom: Spacing.md },
            ]}
          >
            Assigned Doctors ({filteredDoctors.length})
          </Text>

          {loading ? (
            <ListItemSkeleton />
          ) : filteredDoctors.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title={searchQuery ? 'No Results' : 'No Assigned Doctors'}
              message={
                searchQuery
                  ? 'Try a different search term'
                  : 'You have no doctors assigned yet'
              }
            />
          ) : (
            filteredDoctors.map(doctor => (
              <Card
                key={doctor.id}
                onPress={() => handleDoctorPress(doctor.id)}
                variant="elevated"
              >
                <View style={styles.doctorCard}>
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
                        Typography.bodySmall,
                        { color: theme.textSecondary, marginTop: Spacing.xs },
                      ]}
                    >
                      {doctor.specialization}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textSecondary}
                  />
                </View>
              </Card>
            ))
          )}
        </View>

        {/* Recent Activity */}
        <View style={styles.section}>
          <Text
            style={[
              Typography.h4,
              { color: theme.text, marginBottom: Spacing.md },
            ]}
          >
            Recent Activity
          </Text>
          <Card variant="outlined">
            <View style={styles.activityItem}>
              <View
                style={[styles.activityDot, { backgroundColor: theme.success }]}
              />
              <View style={styles.activityContent}>
                <Text style={[Typography.body, { color: theme.text }]}>
                  Day started
                </Text>
                <Text
                  style={[
                    Typography.caption,
                    { color: theme.textSecondary, marginTop: Spacing.xs },
                  ]}
                >
                  {formatRelativeTime(new Date().toISOString())}
                </Text>
              </View>
            </View>
          </Card>
        </View>
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
    marginBottom: getResponsiveSpacing().headerMargin,
  },
  logoRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  dashboardLogo: {
    alignSelf: 'center',
  },
  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerActions: {
    flexDirection: 'row',
    gap: getResponsiveSpacing().buttonGap,
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  dayControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayControlText: {
    flex: 1,
  },
  dayButton: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.lg,
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
    marginRight: Spacing.md,
  },
  doctorInfo: {
    flex: 1,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginTop: 6,
    marginRight: Spacing.md,
  },
  activityContent: {
    flex: 1,
  },
});
