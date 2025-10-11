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
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/Card';
import { localDataService } from '../../services/LocalDataService';
import { Employee } from '../../types';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    const employeeList = localDataService.getAll<Employee>('employees');
    setEmployees(employeeList);
  }, []);

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
          <Text style={[Typography.h3, { color: theme.text }]}>Employees</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Employee Count */}
        <Text
          style={[
            Typography.body,
            { color: theme.textSecondary, marginBottom: Spacing.md },
          ]}
        >
          {employees.length} employee{employees.length !== 1 ? 's' : ''} total
        </Text>

        {employees.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="people-outline"
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
              No employees found
            </Text>
          </Card>
        ) : (
          employees.map(employee => {
            const stats = localDataService.getEmployeeStats(employee.id);
            const isActive = stats.totalDays > 0;

            return (
              <Card
                key={employee.id}
                variant="elevated"
                onPress={() => router.push(`/employee/${employee.id}` as any)}
                style={{ marginBottom: Spacing.md }}
              >
                <View style={styles.employeeCard}>
                  <View
                    style={[
                      styles.employeeIcon,
                      { backgroundColor: theme.primary + '15' },
                    ]}
                  >
                    <Ionicons name="person" size={24} color={theme.primary} />
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
                        Typography.caption,
                        { color: theme.textSecondary, marginTop: Spacing.xs },
                      ]}
                    >
                      {employee.email}
                    </Text>
                    <View style={styles.statsRow}>
                      <View style={styles.statItem}>
                        <Ionicons
                          name="calendar-outline"
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
                          {stats.totalDays} days
                        </Text>
                      </View>
                      <View style={styles.statItem}>
                        <Ionicons
                          name="people-outline"
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
                          {stats.totalVisits} visits
                        </Text>
                      </View>
                    </View>
                  </View>
                  <View style={styles.employeeRight}>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: isActive
                            ? theme.success
                            : theme.textSecondary,
                        },
                      ]}
                    >
                      <Text
                        style={[
                          Typography.caption,
                          { color: '#FFFFFF', fontWeight: '600' },
                        ]}
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </Text>
                    </View>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.icon}
                      style={{ marginTop: Spacing.xs }}
                    />
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
  },
  employeeInfo: {
    flex: 1,
    marginLeft: Spacing.md,
  },
  employeeRight: {
    alignItems: 'flex-end',
  },
  statsRow: {
    flexDirection: 'row',
    marginTop: Spacing.sm,
    gap: Spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
});
