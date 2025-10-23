import React, { useEffect } from 'react';
import {
  Modal,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Button } from '@tamagui/button';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import {
  fetchAllAnalytics,
  generateRoundup,
} from '../../store/slices/AyskaAnalyticsSlice';
import { fetchAllEmployees } from '../../store/slices/AyskaOnboardingSlice';
import { AnalyticsCard } from '../../components/business/AyskaAnalyticsCardComponent';
import { RoundupCard } from '../../components/business/AyskaRoundupCardComponent';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';
import { hapticFeedback } from '../../../utils/haptics';

export default function EmployeeAnalyticsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { employees } = useSelector((state: RootState) => state.onboarding);
  const { allAnalytics, roundups, loading } = useSelector(
    (state: RootState) => state.analytics
  );
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    dispatch(fetchAllEmployees());
    dispatch(fetchAllAnalytics());
  }, [dispatch]);

  const handleRefresh = () => {
    dispatch(fetchAllAnalytics());
  };

  const handleGenerateDailyRoundup = async () => {
    try {
      await dispatch(generateRoundup({ period: 'daily' })).unwrap();
      hapticFeedback.success();
    } catch {
      // Error handling
    }
  };

  const handleGenerateWeeklyRoundup = async () => {
    try {
      await dispatch(generateRoundup({ period: 'weekly' })).unwrap();
      hapticFeedback.success();
    } catch {
      // Error handling
    }
  };

  const handleBack = () => {
    hapticFeedback.light();
    router.back();
  };

  const handleClose = () => {
    hapticFeedback.medium();
    router.back();
  };

  return (
    <Modal
      visible={true}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Custom Header */}
        <TamaguiView
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
          padding="$md"
          backgroundColor="$card"
          borderBottomWidth={1}
          borderBottomColor="$border"
        >
          <TouchableOpacity
            onPress={handleBack}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>

          <TamaguiText fontSize="$6" fontWeight="600" color="$text">
            Employee Analytics
          </TamaguiText>

          <TouchableOpacity
            onPress={handleClose}
            style={{
              padding: 8,
              borderRadius: 8,
              backgroundColor: theme.background,
            }}
          >
            <Ionicons name="close" size={24} color={theme.text} />
          </TouchableOpacity>
        </TamaguiView>

        <ScrollView
          style={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
          }
        >
          <TamaguiView padding="$md">
            {/* Roundup Generation */}
            <TamaguiView
              backgroundColor="$card"
              borderRadius="$md"
              padding="$md"
              marginBottom="$md"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$md"
              >
                <Ionicons name="analytics" size={24} color={theme.accent} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  Generate Reports
                </TamaguiText>
              </TamaguiView>

              <TamaguiText
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$md"
              >
                Generate daily or weekly activity roundups for all employees.
              </TamaguiText>

              <TamaguiView flexDirection="row" gap="$sm">
                <Button
                  onPress={handleGenerateDailyRoundup}
                  backgroundColor="$accent"
                  color="white"
                  flex={1}
                  disabled={loading}
                >
                  Daily Roundup
                </Button>
                <Button
                  onPress={handleGenerateWeeklyRoundup}
                  backgroundColor="$accent"
                  color="white"
                  flex={1}
                  disabled={loading}
                >
                  Weekly Roundup
                </Button>
              </TamaguiView>
            </TamaguiView>

            {/* Recent Roundups */}
            {roundups.length > 0 && (
              <TamaguiView
                backgroundColor="$card"
                borderRadius="$md"
                padding="$md"
                marginBottom="$md"
              >
                <TamaguiView
                  flexDirection="row"
                  alignItems="center"
                  marginBottom="$md"
                >
                  <Ionicons
                    name="document-text"
                    size={24}
                    color={theme.warning}
                  />
                  <TamaguiText
                    fontSize="$5"
                    fontWeight="bold"
                    color="$text"
                    marginLeft="$sm"
                  >
                    Recent Roundups
                  </TamaguiText>
                </TamaguiView>

                {roundups.slice(0, 3).map((roundup: any) => (
                  <RoundupCard key={roundup.id} roundup={roundup} />
                ))}
              </TamaguiView>
            )}

            {/* Employee Analytics */}
            <TamaguiView
              backgroundColor="white"
              borderRadius="$md"
              padding="$md"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$md"
              >
                <Ionicons name="people" size={24} color={theme.primary} />
                <TamaguiText
                  fontSize="$5"
                  fontWeight="bold"
                  color="$text"
                  marginLeft="$sm"
                >
                  Employee Performance
                </TamaguiText>
              </TamaguiView>

              {allAnalytics.length === 0 ? (
                <TamaguiView alignItems="center" padding="$lg">
                  <Ionicons
                    name="analytics-outline"
                    size={48}
                    color={theme.textSecondary}
                  />
                  <TamaguiText
                    fontSize="$4"
                    color="$textSecondary"
                    marginTop="$sm"
                  >
                    No analytics data available
                  </TamaguiText>
                </TamaguiView>
              ) : (
                allAnalytics.map((analytics: any) => {
                  const employee = employees.find(
                    emp => emp.id === analytics.employeeId
                  );
                  return (
                    <AnalyticsCard
                      key={analytics.employeeId}
                      analytics={analytics}
                      employeeName={employee?.name || 'Unknown'}
                    />
                  );
                })
              )}
            </TamaguiView>
          </TamaguiView>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
