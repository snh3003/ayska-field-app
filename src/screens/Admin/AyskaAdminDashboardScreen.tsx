import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useCallback, useState } from 'react';
import {
  Dimensions,
  Platform,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/AyskaCardComponent';
import { StatsCard } from '../../components/ui/AyskaStatsCardComponent';
import { localDataService } from '../../services/AyskaLocalDataService';
import { Employee, Visit } from '../../types';
import { ThemeToggle } from '../../components/layout/AyskaThemeToggleComponent';
import { Logo } from '../../components/layout/AyskaLogoComponent';
import { SearchBar } from '../../components/forms/AyskaSearchBarComponent';
import { EmptyState } from '../../components/feedback/AyskaEmptyStateComponent';
import { ListItemSkeleton } from '../../components/feedback/AyskaSkeletonLoaderComponent';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: Spacing.lg }}
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
        <TamaguiView marginBottom={getResponsiveSpacing().headerMargin}>
          {/* Logo Row */}
          <TamaguiView
            alignItems="center"
            justifyContent="center"
            marginBottom="$sm"
          >
            <Logo size="responsive" style={{ alignSelf: 'center' }} />
          </TamaguiView>

          {/* Welcome & Actions Row */}
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {user.name && (
              <TamaguiText fontSize="$3" lineHeight="$5" color="$textSecondary">
                Welcome, {user.name}
              </TamaguiText>
            )}
            <TamaguiView
              flexDirection="row"
              gap={getResponsiveSpacing().buttonGap}
              alignItems="center"
            >
              <ThemeToggle />
              <TouchableOpacity
                onPress={handleLogoutPress}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: theme.card,
                }}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={theme.error}
                />
              </TouchableOpacity>
            </TamaguiView>
          </TamaguiView>
        </TamaguiView>

        {/* Stats Cards */}
        <TamaguiView flexDirection="row" gap="$md" marginBottom="$md">
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
        </TamaguiView>

        <TamaguiView flexDirection="row" gap="$md" marginBottom="$md">
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
        </TamaguiView>

        {/* Quick Actions */}
        <TamaguiView marginBottom="$md">
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Quick Actions
          </TamaguiText>

          <TamaguiView flexDirection="row" gap="$sm" marginBottom="$sm">
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.primary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                hapticFeedback.light();
                router.push('/admin/onboard-employee' as any);
              }}
            >
              <Ionicons name="person-add" size={20} color="white" />
              <TamaguiText
                color="white"
                fontSize="$4"
                fontWeight="600"
                marginLeft="$xs"
              >
                Add Employee
              </TamaguiText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.secondary,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                hapticFeedback.light();
                router.push('/admin/onboard-doctor' as any);
              }}
            >
              <Ionicons name="medical" size={20} color="white" />
              <TamaguiText
                color="white"
                fontSize="$4"
                fontWeight="600"
                marginLeft="$xs"
              >
                Add Doctor
              </TamaguiText>
            </TouchableOpacity>
          </TamaguiView>

          <TamaguiView flexDirection="row" gap="$sm">
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.info,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                hapticFeedback.light();
                router.push('/admin/analytics' as any);
              }}
            >
              <Ionicons name="analytics" size={20} color="white" />
              <TamaguiText
                color="white"
                fontSize="$4"
                fontWeight="600"
                marginLeft="$xs"
              >
                Analytics
              </TamaguiText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: theme.warning,
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={() => {
                hapticFeedback.light();
                router.push('/admin/assign-doctors' as any);
              }}
            >
              <Ionicons name="link" size={20} color="white" />
              <TamaguiText
                color="white"
                fontSize="$4"
                fontWeight="600"
                marginLeft="$xs"
              >
                Assign Doctors
              </TamaguiText>
            </TouchableOpacity>
          </TamaguiView>
        </TamaguiView>

        {/* Search Bar */}
        <SearchBar
          placeholder="Search employees..."
          onSearch={setSearchQuery}
        />

        {/* Employees List */}
        <TamaguiView marginTop="$lg">
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Employees ({filteredEmployees.length})
          </TamaguiText>

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
                <TamaguiView flexDirection="row" alignItems="center">
                  <TamaguiView
                    width={48}
                    height={48}
                    borderRadius="$md"
                    justifyContent="center"
                    alignItems="center"
                    marginRight="$md"
                    backgroundColor={theme.secondaryBg}
                  >
                    <Ionicons name="person" size={24} color={theme.secondary} />
                  </TamaguiView>
                  <TamaguiView flex={1}>
                    <TamaguiText
                      fontSize="$4"
                      lineHeight="$6"
                      color="$text"
                      fontWeight="600"
                    >
                      {employee.name}
                    </TamaguiText>
                    <TamaguiText
                      fontSize="$3"
                      lineHeight="$5"
                      color="$textSecondary"
                      marginTop="$xs"
                    >
                      {employee.email}
                    </TamaguiText>
                  </TamaguiView>
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.textSecondary}
                  />
                </TamaguiView>
              </Card>
            ))
          )}
        </TamaguiView>

        {/* Recent Activity */}
        <TamaguiView marginTop="$lg">
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Recent Visits
          </TamaguiText>
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
                  <TamaguiView flexDirection="row" alignItems="flex-start">
                    <TamaguiView
                      width={8}
                      height={8}
                      borderRadius={4}
                      marginTop={6}
                      marginRight="$md"
                      backgroundColor={
                        visit.status === 'completed' ? '$success' : '$warning'
                      }
                    />
                    <TamaguiView flex={1}>
                      <TamaguiText fontSize="$4" lineHeight="$6" color="$text">
                        {employee?.name || 'Unknown'} - {visit.status}
                      </TamaguiText>
                      <TamaguiText
                        fontSize="$2"
                        lineHeight="$4"
                        color="$textSecondary"
                        marginTop="$xs"
                      >
                        {formatRelativeTime(visit.checkInTime)}
                      </TamaguiText>
                    </TamaguiView>
                  </TamaguiView>
                </Card>
              );
            })
          )}
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
