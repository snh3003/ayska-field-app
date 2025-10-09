import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService } from '../../services/LocalDataService';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalEmployees: 0, totalDoctors: 0, totalVisits: 0, activeAttendance: 0 });
  const [recentVisits, setRecentVisits] = useState<any[]>([]);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    const adminStats = localDataService.getAdminStats();
    const visits = localDataService.getAll('visits').slice(-5).reverse();
    setStats(adminStats);
    setRecentVisits(visits);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 20 }}>
          Admin Dashboard
        </Text>
        
        {/* Stats Overview */}
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Employees" value={stats.totalEmployees} color="primary" />
          <StatsCard title="Doctors" value={stats.totalDoctors} color="secondary" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Total Visits" value={stats.totalVisits} color="success" />
          <StatsCard title="Active Today" value={stats.activeAttendance} color="warning" />
        </View>

        {/* Recent Activity */}
        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
          Recent Activity
        </Text>
        {recentVisits.length === 0 ? (
          <Card>
            <Text style={{ color: theme.text, textAlign: 'center' }}>No recent activity</Text>
          </Card>
        ) : (
          recentVisits.map((visit) => {
            const doctor = localDataService.getById('doctors', visit.doctorId);
            const employee = localDataService.getById('employees', visit.employeeId);
            return (
              <Card key={visit.id} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                  {employee?.name || 'Unknown Employee'} visited {doctor?.name || 'Unknown Doctor'}
                </Text>
                <Text style={{ color: theme.text, opacity: 0.7, fontSize: 14 }}>
                  {new Date(visit.checkInTime).toLocaleString()}
                </Text>
                <View style={{ 
                  backgroundColor: visit.status === 'completed' ? '#10B981' : '#F59E0B',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  alignSelf: 'flex-start',
                  marginTop: 8
                }}>
                  <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                    {visit.status === 'completed' ? 'Completed' : 'In Progress'}
                  </Text>
                </View>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}


