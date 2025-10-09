import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService } from '../../services/LocalDataService';

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
    
    const completedVisits = visits.filter(v => v.status === 'completed').length;
    const activeVisits = visits.filter(v => v.status === 'in_progress').length;
    const activeEmployees = attendance.filter(a => a.status === 'active').length;
    
    // Calculate top performers
    const employeeStats = employees.map(emp => {
      const stats = localDataService.getEmployeeStats(emp.id);
      return { ...emp, ...stats };
    }).sort((a, b) => b.totalVisits - a.totalVisits).slice(0, 3);
    
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
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 20 }}>
          Reports & Analytics
        </Text>
        
        {/* Summary Stats */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Total Visits" value={reportData.totalVisits} color="primary" />
          <StatsCard title="Completed" value={reportData.completedVisits} color="success" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Active Visits" value={reportData.activeVisits} color="warning" />
          <StatsCard title="Active Employees" value={reportData.activeEmployees} color="secondary" />
        </View>

        {/* Top Performers */}
        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
          Top Performers
        </Text>
        {topPerformers.length === 0 ? (
          <Card>
            <Text style={{ color: theme.text, textAlign: 'center' }}>No performance data available</Text>
          </Card>
        ) : (
          topPerformers.map((employee, index) => (
            <Card key={employee.id} style={{ marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                    #{index + 1} {employee.name}
                  </Text>
                  <Text style={{ color: theme.text, opacity: 0.7, fontSize: 14 }}>
                    {employee.email}
                  </Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={{ fontSize: 18, fontWeight: '700', color: theme.primary }}>
                    {employee.totalVisits}
                  </Text>
                  <Text style={{ color: theme.text, opacity: 0.6, fontSize: 12 }}>
                    visits
                  </Text>
                </View>
              </View>
            </Card>
          ))
        )}
      </View>
    </ScrollView>
  );
}


