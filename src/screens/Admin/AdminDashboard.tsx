import { Colors, Typography, Spacing, BorderRadius, Shadows } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService } from '../../services/LocalDataService';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';
import { ThemeToggle } from '../../../components/ThemeToggle';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, totalDoctors: 0, totalVisits: 0, activeAttendance: 0 });
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const { name } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const handleLogout = () => {
    dispatch(logout());
    router.replace('/login');
  };

  useEffect(() => {
    const adminStats = localDataService.getAdminStats();
    const visits = localDataService.getAll('visits').slice(-5).reverse();
    setStats(adminStats);
    setRecentVisits(visits);
  }, []);

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
              Admin Dashboard
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
        
        {/* Stats Overview */}
        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatsCard 
              title="Employees" 
              value={stats.totalEmployees} 
              color="primary"
              icon={<Ionicons name="people" size={20} color={theme.primary} />}
            />
            <StatsCard 
              title="Doctors" 
              value={stats.totalDoctors} 
              color="secondary"
              icon={<Ionicons name="medical" size={20} color={theme.secondary} />}
            />
          </View>
          <View style={styles.statsRow}>
            <StatsCard 
              title="Total Visits" 
              value={stats.totalVisits} 
              color="success"
              icon={<Ionicons name="bar-chart" size={20} color={theme.success} />}
            />
            <StatsCard 
              title="Active Today" 
              value={stats.activeAttendance} 
              color="warning"
              icon={<Ionicons name="time" size={20} color={theme.warning} />}
            />
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.sectionHeader}>
          <Text style={[Typography.h4, { color: theme.text }]}>
            Recent Activity
          </Text>
          <TouchableOpacity>
            <Text style={[Typography.bodySmall, { color: theme.primary }]}>
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {recentVisits.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons name="time-outline" size={48} color={theme.textSecondary} style={{ opacity: 0.3 }} />
            <Text style={[Typography.body, { color: theme.textSecondary, marginTop: Spacing.md, textAlign: 'center' }]}>
              No recent activity
            </Text>
          </Card>
        ) : (
          recentVisits.map((visit) => {
            const doctor = localDataService.getById('doctors', visit.doctorId);
            const employee = localDataService.getById('employees', visit.employeeId);
            const isCompleted = visit.status === 'completed';
            
            return (
              <Card key={visit.id} variant="elevated" style={{ marginBottom: Spacing.md }}>
                <View style={styles.activityCard}>
                  <View style={[
                    styles.activityIcon, 
                    { backgroundColor: isCompleted ? theme.success + '15' : theme.warning + '15' }
                  ]}>
                    <Ionicons 
                      name={isCompleted ? "checkmark-circle" : "hourglass"} 
                      size={24} 
                      color={isCompleted ? theme.success : theme.warning} 
                    />
                  </View>
                  <View style={styles.activityInfo}>
                    <Text style={[Typography.body, { color: theme.text, fontWeight: '600' }]}>
                      {employee?.name || 'Unknown'} → {doctor?.name || 'Unknown'}
                    </Text>
                    <View style={styles.activityMeta}>
                      <Ionicons name="time-outline" size={14} color={theme.icon} />
                      <Text style={[Typography.caption, { color: theme.textSecondary, marginLeft: Spacing.xs }]}>
                        {new Date(visit.checkInTime).toLocaleString()}
                      </Text>
                    </View>
                  </View>
                  <View style={[
                    styles.statusBadge,
                    { backgroundColor: isCompleted ? theme.success : theme.warning }
                  ]}>
                    <Text style={[Typography.caption, { color: '#FFFFFF', fontWeight: '600' }]}>
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
  statsGrid: {
    marginBottom: Spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  activityMeta: {
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


