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
import { localDataService } from '../../services/LocalDataService';
import { Employee, Visit } from '../../types';
import { ThemeToggle } from '../../components/layout/ThemeToggle';
import { Logo } from '../../components/layout/Logo';
import { SearchBar } from '../../components/forms/SearchBar';
import { EmptyState } from '../../components/feedback/EmptyState';
import { ListItemSkeleton } from '../../components/feedback/SkeletonLoader';
import { useAuth } from '../../../hooks/useAuth';
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

export default function AdminDashboard() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [recentVisits, setRecentVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { user, logout: handleLogout } = useAuth();
  const toast = useToast();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const allEmployees = localDataService.getAll<Employee>('employees');
      const allVisits = localDataService.getAll<Visit>('visits');
      const sortedVisits = allVisits
        .sort(
          (a, b) =>
            new Date(b.checkInTime).getTime() -
            new Date(a.checkInTime).getTime()
        )
        .slice(0, 5);

      setEmployees(allEmployees);
      setRecentVisits(sortedVisits);
    } catch {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [toast]);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(() => {
    hapticFeedback.light();
    loadData();
  }, [loadData]);

  const handleEmployeePress = (employeeId: string) => {
    hapticFeedback.light();
    router.push(`/employee/${employeeId}` as any);
  };

  const handleLogoutPress = () => {
    hapticFeedback.medium();
    handleLogout();
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(
    employee =>
      employee.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const stats = {
    totalEmployees: employees.length,
    activeToday: employees.filter(e => {
      const today = new Date().toISOString().split('T')[0];
      const attendance = localDataService
        .getAll('attendance')
        .find((a: any) => a.employeeId === e.id && a.date === today);
      return !!attendance;
    }).length,
    totalVisits: localDataService.getAll<Visit>('visits').length,
    todayVisits: localDataService.getAll<Visit>('visits').filter(v => {
      const today = new Date().toISOString().split('T')[0];
      const visitDate = new Date(v.checkInTime).toISOString().split('T')[0];
      return visitDate === today;
    }).length,
  };

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
              <Ionicons name="people-outline" size={24} color={theme.primary} />
            }
            title="Total Employees"
            value={stats.totalEmployees.toString()}
          />
          <StatsCard
            icon={
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color={theme.success}
              />
            }
            title="Active Today"
            value={stats.activeToday.toString()}
            color="success"
          />
        </View>

        <View style={styles.statsRow}>
          <StatsCard
            icon={
              <Ionicons
                name="location-outline"
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
            title="Today's Visits"
            value={stats.todayVisits.toString()}
            color="info"
          />
        </View>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search employees..."
          onSearch={setSearchQuery}
        />

        {/* Employees List */}
        <View style={styles.section}>
          <Text
            style={[
              Typography.h4,
              { color: theme.text, marginBottom: Spacing.md },
            ]}
          >
            Employees ({filteredEmployees.length})
          </Text>

          {loading ? (
            <ListItemSkeleton />
          ) : filteredEmployees.length === 0 ? (
            <EmptyState
              icon="people-outline"
              title={searchQuery ? 'No Results' : 'No Employees'}
              message={
                searchQuery
                  ? 'Try a different search term'
                  : 'No employees found'
              }
            />
          ) : (
            filteredEmployees.map(employee => (
              <Card
                key={employee.id}
                onPress={() => handleEmployeePress(employee.id)}
                variant="elevated"
              >
                <View style={styles.employeeCard}>
                  <View
                    style={[
                      styles.employeeIcon,
                      { backgroundColor: theme.secondary + '15' },
                    ]}
                  >
                    <Ionicons name="person" size={24} color={theme.secondary} />
                  </View>
                  <View style={styles.employeeInfo}>
                    <Text
                      style={[
                        Typography.body,
                        { color: theme.text, fontWeight: '600' },
                      ]}
                    >
                      {employee.name}
                    </Text>
                    <Text
                      style={[
                        Typography.bodySmall,
                        { color: theme.textSecondary, marginTop: Spacing.xs },
                      ]}
                    >
                      {employee.email}
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
            Recent Visits
          </Text>
          {recentVisits.length === 0 ? (
            <EmptyState
              icon="time-outline"
              title="No Recent Activity"
              message="Recent visits will appear here"
            />
          ) : (
            recentVisits.map(visit => {
              const employee = employees.find(e => e.id === visit.employeeId);
              return (
                <Card key={visit.id} variant="outlined">
                  <View style={styles.activityItem}>
                    <View
                      style={[
                        styles.activityDot,
                        {
                          backgroundColor:
                            visit.status === 'completed'
                              ? theme.success
                              : theme.warning,
                        },
                      ]}
                    />
                    <View style={styles.activityContent}>
                      <Text style={[Typography.body, { color: theme.text }]}>
                        {employee?.name || 'Unknown'} - {visit.status}
                      </Text>
                      <Text
                        style={[
                          Typography.caption,
                          { color: theme.textSecondary, marginTop: Spacing.xs },
                        ]}
                      >
                        {formatRelativeTime(visit.checkInTime)}
                      </Text>
                    </View>
                  </View>
                </Card>
              );
            })
          )}
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
  section: {
    marginTop: Spacing.lg,
  },
  employeeCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  employeeIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  employeeInfo: {
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
