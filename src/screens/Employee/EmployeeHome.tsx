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
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService } from '../../services/LocalDataService';
import { Attendance } from '../../types';
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
        </TamaguiView>

        <TamaguiView flexDirection="row" gap="$md" marginBottom="$md">
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
        </TamaguiView>

        {/* Day Control */}
        <Card variant="elevated">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <TamaguiView flex={1}>
              <TamaguiText
                fontSize="$5"
                fontWeight="600"
                color="$text"
                marginBottom="$xs"
              >
                {isDayStarted ? 'Day In Progress' : 'Start Your Day'}
              </TamaguiText>
              <TamaguiText fontSize="$3" lineHeight="$5" color="$textSecondary">
                {isDayStarted
                  ? 'Track your visits and activities'
                  : 'Begin tracking your field activities'}
              </TamaguiText>
            </TamaguiView>
            <TouchableOpacity
              onPress={isDayStarted ? endDay : startDay}
              style={{
                width: 56,
                height: 56,
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: isDayStarted
                  ? theme.error + '15'
                  : theme.success + '15',
              }}
            >
              <Ionicons
                name={isDayStarted ? 'stop-circle' : 'play-circle'}
                size={24}
                color={isDayStarted ? theme.error : theme.success}
              />
            </TouchableOpacity>
          </TamaguiView>
        </Card>

        {/* Search Bar */}
        <SearchBar placeholder="Search doctors..." onSearch={setSearchQuery} />

        {/* Assigned Doctors */}
        <TamaguiView marginTop="$lg">
          <TamaguiText
            fontSize="$5"
            fontWeight="600"
            color="$text"
            marginBottom="$md"
          >
            Assigned Doctors ({filteredDoctors.length})
          </TamaguiText>

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
                <TamaguiView flexDirection="row" alignItems="center">
                  <TamaguiView
                    width={48}
                    height={48}
                    borderRadius="$md"
                    justifyContent="center"
                    alignItems="center"
                    marginRight="$md"
                    backgroundColor={theme.primaryBg}
                  >
                    <Ionicons name="person" size={24} color={theme.primary} />
                  </TamaguiView>
                  <TamaguiView flex={1}>
                    <TamaguiText
                      fontSize="$4"
                      lineHeight="$6"
                      color="$text"
                      fontWeight="600"
                    >
                      {doctor.name}
                    </TamaguiText>
                    <TamaguiText
                      fontSize="$3"
                      lineHeight="$5"
                      color="$textSecondary"
                      marginTop="$xs"
                    >
                      {doctor.specialization}
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
            Recent Activity
          </TamaguiText>
          <Card variant="outlined">
            <TamaguiView flexDirection="row" alignItems="flex-start">
              <TamaguiView
                width={8}
                height={8}
                borderRadius={4}
                marginTop={6}
                marginRight="$md"
                backgroundColor="$success"
              />
              <TamaguiView flex={1}>
                <TamaguiText fontSize="$4" lineHeight="$6" color="$text">
                  Day started
                </TamaguiText>
                <TamaguiText
                  fontSize="$2"
                  lineHeight="$4"
                  color="$textSecondary"
                  marginTop="$xs"
                >
                  {formatRelativeTime(new Date().toISOString())}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
          </Card>
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
