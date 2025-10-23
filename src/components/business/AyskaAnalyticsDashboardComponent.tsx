// Analytics Dashboard Component - Complete UI for analytics overview
// Implements dashboard with KPIs, trends, and performance metrics

import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useToast } from '../../../contexts/ToastContext';
import { hapticFeedback } from '../../../utils/haptics';
import { getA11yProps } from '../../../utils/accessibility';
import { AyskaTitleComponent } from '../ui/AyskaTitleComponent';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaActionButtonComponent } from '../ui/AyskaActionButtonComponent';
import { Card } from '../ui/AyskaCardComponent';
import { Skeleton } from '../feedback/AyskaSkeletonLoaderComponent';
import { ErrorBoundary } from '../feedback/AyskaErrorBoundaryComponent';
import {
  clearError,
  fetchAssignmentAnalytics,
  fetchCheckinAnalytics,
  fetchDailyTrends,
  fetchDashboard,
  fetchEmployeePerformance,
  fetchKPIs,
  selectAnalyticsError,
  selectAnalyticsLoading,
  selectAssignmentAnalytics,
  selectCheckinAnalytics,
  selectDailyTrends,
  selectDashboard,
  selectEmployeePerformance,
  selectKPIs,
} from '../../store/slices/AyskaAnalyticsSlice';
import type { AppDispatch } from '../../store';

interface AnalyticsDashboardComponentProps {
  onViewDetails?: (_section: string) => void;
  onGenerateReport?: () => void;
  style?: any;
  _accessibilityHint?: string;
}

export const AnalyticsDashboardComponent: React.FC<
  AnalyticsDashboardComponentProps
> = ({ onViewDetails, onGenerateReport, style }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { showToast } = useToast();

  const dashboard = useSelector(selectDashboard);
  const kpis = useSelector(selectKPIs);
  const employeePerformance = useSelector(selectEmployeePerformance);
  const assignmentAnalytics = useSelector(selectAssignmentAnalytics);
  const checkinAnalytics = useSelector(selectCheckinAnalytics);
  // @ts-expect-error - Reserved for daily trends chart feature
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _dailyTrends = useSelector(selectDailyTrends);
  const loading = useSelector(selectAnalyticsLoading);
  const error = useSelector(selectAnalyticsError);

  const [refreshing, setRefreshing] = useState(false);

  // Load analytics data on mount
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        await Promise.all([
          dispatch(fetchDashboard()),
          dispatch(fetchKPIs()),
          dispatch(fetchEmployeePerformance()),
          dispatch(fetchAssignmentAnalytics()),
          dispatch(fetchCheckinAnalytics()),
          dispatch(fetchDailyTrends(7)),
        ]);
      } catch (error) {
        if (__DEV__) {
          console.error('Failed to load analytics:', error);
        }
      }
    };

    loadAnalytics();
  }, [dispatch]);

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    hapticFeedback.light();
    try {
      await Promise.all([
        dispatch(fetchDashboard()),
        dispatch(fetchKPIs()),
        dispatch(fetchEmployeePerformance()),
        dispatch(fetchAssignmentAnalytics()),
        dispatch(fetchCheckinAnalytics()),
        dispatch(fetchDailyTrends(7)),
      ]);
    } catch (error) {
      if (__DEV__) {
        console.error('Failed to refresh analytics:', error);
      }
    } finally {
      setRefreshing(false);
    }
  };

  // Handle view details
  const handleViewDetails = (_section: string) => {
    hapticFeedback.light();
    onViewDetails?.(_section);
  };

  // Handle generate report
  const handleGenerateReport = () => {
    hapticFeedback.light();
    onGenerateReport?.();
  };

  // Clear error
  useEffect(() => {
    if (error) {
      showToast(error, 'error');
      dispatch(clearError());
    }
  }, [error, showToast, dispatch]);

  // Render KPI card
  const renderKPICard = (
    title: string,
    value: string | number,
    subtitle?: string,
    color?:
      | 'text'
      | 'textSecondary'
      | 'primary'
      | 'primaryRed'
      | 'secondary'
      | 'success'
      | 'warning'
      | 'error'
      | 'info'
  ) => (
    <Card
      style={{
        flex: 1,
        margin: 4,
        minHeight: 100,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      {...getA11yProps(`${title}: ${value}${subtitle ? `, ${subtitle}` : ''}`)}
    >
      <AyskaTextComponent
        variant="bodyLarge"
        weight="bold"
        color={(color as any) || 'primary'}
        style={{ marginBottom: 4 }}
      >
        {value}
      </AyskaTextComponent>
      <AyskaTextComponent
        variant="bodySmall"
        color="textSecondary"
        align="center"
        style={{ marginBottom: subtitle ? 4 : 0 }}
      >
        {title}
      </AyskaTextComponent>
      {subtitle && (
        <AyskaTextComponent
          variant="bodySmall"
          color="textSecondary"
          align="center"
        >
          {subtitle}
        </AyskaTextComponent>
      )}
    </Card>
  );

  // Render loading skeleton
  if (loading && !dashboard) {
    return (
      <View style={style}>
        {[...Array(6)].map((_, i) => (
          <View key={i} style={{ marginBottom: 12 }}>
            <Skeleton height={120} />
          </View>
        ))}
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        <AyskaTitleComponent
          level={1}
          weight="bold"
          style={{ marginBottom: 24 }}
        >
          Analytics Dashboard
        </AyskaTitleComponent>

        {/* Overview KPIs */}
        {dashboard && (
          <Card style={{ marginBottom: 24 }}>
            <AyskaTitleComponent
              level={2}
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              Overview
            </AyskaTitleComponent>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {renderKPICard('Total Employees', dashboard.total_employees)}
              {renderKPICard('Active Employees', dashboard.active_employees)}
              {renderKPICard('Total Doctors', dashboard.total_doctors)}
              {renderKPICard('Total Assignments', dashboard.total_assignments)}
            </View>

            <View
              style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 16 }}
            >
              {renderKPICard(
                'Active Assignments',
                dashboard.active_assignments
              )}
              {renderKPICard('Completed', dashboard.completed_assignments)}
              {renderKPICard('Check-ins', dashboard.total_checkins)}
              {renderKPICard('Valid Check-ins', dashboard.valid_checkins)}
            </View>
          </Card>
        )}

        {/* Performance KPIs */}
        {kpis && (
          <Card style={{ marginBottom: 24 }}>
            <AyskaTitleComponent
              level={2}
              weight="semibold"
              style={{ marginBottom: 16 }}
            >
              Key Performance Indicators
            </AyskaTitleComponent>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {renderKPICard(
                'Completion Rate',
                `${(kpis.assignment_completion_rate * 100).toFixed(1)}%`,
                'Assignments',
                'success'
              )}
              {renderKPICard(
                'Success Rate',
                `${(kpis.checkin_success_rate * 100).toFixed(1)}%`,
                'Check-ins',
                'success'
              )}
              {renderKPICard(
                'Productivity',
                `${(kpis.employee_productivity * 100).toFixed(1)}%`,
                'Score',
                'primary'
              )}
              {renderKPICard(
                'System Uptime',
                `${(kpis.system_uptime * 100).toFixed(1)}%`,
                'Availability',
                'info'
              )}
            </View>
          </Card>
        )}

        {/* Assignment Analytics */}
        {assignmentAnalytics && (
          <Card style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <AyskaTitleComponent level={2} weight="semibold">
                Assignment Analytics
              </AyskaTitleComponent>
              <AyskaActionButtonComponent
                label="View Details"
                variant="secondary"
                size="sm"
                onPress={() => handleViewDetails('assignments')}
                {...getA11yProps('View detailed assignment analytics')}
              />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {renderKPICard('Total', assignmentAnalytics.total_assignments)}
              {renderKPICard('Active', assignmentAnalytics.active_assignments)}
              {renderKPICard(
                'Completed',
                assignmentAnalytics.completed_assignments
              )}
              {renderKPICard(
                'Cancelled',
                assignmentAnalytics.cancelled_assignments
              )}
            </View>
          </Card>
        )}

        {/* Check-in Analytics */}
        {checkinAnalytics && (
          <Card style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <AyskaTitleComponent level={2} weight="semibold">
                Check-in Analytics
              </AyskaTitleComponent>
              <AyskaActionButtonComponent
                label="View Details"
                variant="secondary"
                size="sm"
                onPress={() => handleViewDetails('checkins')}
                {...getA11yProps('View detailed check-in analytics')}
              />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {renderKPICard('Total', checkinAnalytics.total_checkins)}
              {renderKPICard('Valid', checkinAnalytics.valid_checkins)}
              {renderKPICard('Invalid', checkinAnalytics.invalid_checkins)}
              {renderKPICard(
                'Success Rate',
                `${(checkinAnalytics.success_rate * 100).toFixed(1)}%`,
                undefined,
                'success'
              )}
            </View>
          </Card>
        )}

        {/* Employee Performance */}
        {employeePerformance && (
          <Card style={{ marginBottom: 24 }}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 16,
              }}
            >
              <AyskaTitleComponent level={2} weight="semibold">
                Employee Performance
              </AyskaTitleComponent>
              <AyskaActionButtonComponent
                label="View Details"
                variant="secondary"
                size="sm"
                onPress={() => handleViewDetails('employees')}
                {...getA11yProps('View detailed employee performance')}
              />
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {renderKPICard(
                'Total Employees',
                employeePerformance.total_employees
              )}
              {renderKPICard(
                'Avg Completion',
                `${(employeePerformance.average_completion_rate * 100).toFixed(1)}%`,
                'Rate'
              )}
              {renderKPICard(
                'Avg Success',
                `${(employeePerformance.average_success_rate * 100).toFixed(1)}%`,
                'Rate'
              )}
              {renderKPICard(
                'Top Performer',
                employeePerformance.top_performer
              )}
            </View>
          </Card>
        )}

        {/* Action Buttons */}
        <View style={{ flexDirection: 'row', marginTop: 24, marginBottom: 20 }}>
          <AyskaActionButtonComponent
            label="Generate Report"
            variant="primary"
            onPress={handleGenerateReport}
            style={{ flex: 1, marginRight: 8 }}
            {...getA11yProps('Generate analytics report')}
          />

          <AyskaActionButtonComponent
            label="Refresh"
            variant="secondary"
            onPress={handleRefresh}
            style={{ flex: 1, marginLeft: 8 }}
            loading={refreshing}
            {...getA11yProps('Refresh analytics data')}
          />
        </View>
      </ScrollView>
    </ErrorBoundary>
  );
};
