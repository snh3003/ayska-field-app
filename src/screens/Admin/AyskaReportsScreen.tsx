import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Card } from '../../components/ui/AyskaCardComponent';
import { StatsCard } from '../../components/ui/AyskaStatsCardComponent';
import { localDataService } from '../../services/AyskaLocalDataService';

export default function Reports() {
  const [reportData, setReportData] = useState({
    totalVisits: 0,
    completedVisits: 0,
    activeVisits: 0,
    totalEmployees: 0,
    activeEmployees: 0,
  });
  const [topPerformers, setTopPerformers] = useState<any[]>([]);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    const visits = localDataService.getAll('visits');
    const employees = localDataService.getAll('employees');
    const attendance = localDataService.getAll('attendance');

    const completedVisits = visits.filter(
      (v: any) => v.status === 'completed'
    ).length;
    const activeVisits = visits.filter(
      (v: any) => v.status === 'in_progress'
    ).length;
    const activeEmployees = attendance.filter(
      (a: any) => a.status === 'active'
    ).length;

    // Calculate top performers
    const employeeStats = employees
      .map((emp: any) => {
        const stats = localDataService.getEmployeeStats(emp.id);
        return { ...emp, ...stats };
      })
      .sort((a: any, b: any) => b.totalVisits - a.totalVisits)
      .slice(0, 3);

    setReportData({
      totalVisits: visits.length,
      completedVisits,
      activeVisits,
      totalEmployees: employees.length,
      activeEmployees,
    });
    setTopPerformers(employeeStats);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <TamaguiView padding="$md">
        <TamaguiText
          fontSize="$6"
          fontWeight="700"
          color="$text"
          marginBottom="$lg"
        >
          Reports & Analytics
        </TamaguiText>

        {/* Summary Stats */}
        <TamaguiView flexDirection="row" marginBottom="$lg" gap="$md">
          <StatsCard
            title="Total Visits"
            value={reportData.totalVisits}
            color="primary"
          />
          <StatsCard
            title="Completed"
            value={reportData.completedVisits}
            color="success"
          />
        </TamaguiView>
        <TamaguiView flexDirection="row" marginBottom="$lg" gap="$md">
          <StatsCard
            title="Active Visits"
            value={reportData.activeVisits}
            color="warning"
          />
          <StatsCard
            title="Active Employees"
            value={reportData.activeEmployees}
            color="secondary"
          />
        </TamaguiView>

        {/* Top Performers */}
        <TamaguiText
          fontSize="$5"
          fontWeight="600"
          color="$text"
          marginBottom="$md"
        >
          Top Performers
        </TamaguiText>
        {topPerformers.length === 0 ? (
          <Card>
            <TamaguiText color="$text" textAlign="center">
              No performance data available
            </TamaguiText>
          </Card>
        ) : (
          topPerformers.map((employee, index) => (
            <Card key={employee.id} style={{ marginBottom: 12 }}>
              <TamaguiView
                flexDirection="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <TamaguiView flex={1}>
                  <TamaguiText
                    fontSize="$4"
                    fontWeight="600"
                    color="$text"
                    marginBottom="$xs"
                  >
                    #{index + 1} {employee.name}
                  </TamaguiText>
                  <TamaguiText color="$text" opacity={0.7} fontSize="$3">
                    {employee.email}
                  </TamaguiText>
                </TamaguiView>
                <TamaguiView alignItems="flex-end">
                  <TamaguiText fontSize="$5" fontWeight="700" color="$primary">
                    {employee.totalVisits}
                  </TamaguiText>
                  <TamaguiText color="$text" opacity={0.6} fontSize="$2">
                    visits
                  </TamaguiText>
                </TamaguiView>
              </TamaguiView>
            </Card>
          ))
        )}
      </TamaguiView>
    </ScrollView>
  );
}
