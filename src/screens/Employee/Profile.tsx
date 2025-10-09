import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { ButtonSecondary } from '../../components/ui/ButtonSecondary';
import { Card } from '../../components/ui/Card';
import { StatsCard } from '../../components/ui/StatsCard';
import { localDataService } from '../../services/LocalDataService';
import type { RootState } from '../../store';
import { logout } from '../../store/slices/authSlice';

export default function Profile() {
  const { name, role, userId } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  const stats = userId ? localDataService.getEmployeeStats(userId) : { totalDays: 0, completedDays: 0, totalVisits: 0, completedVisits: 0 };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 20 }}>
          Profile
        </Text>
        
        <Card style={{ marginBottom: 20 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
            Personal Information
          </Text>
          <Text style={{ color: theme.text, marginBottom: 4 }}>Name: {name}</Text>
          <Text style={{ color: theme.text, marginBottom: 12 }}>Role: {role}</Text>
        </Card>

        <Text style={{ fontSize: 20, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
          Performance Stats
        </Text>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Total Days" value={stats.totalDays} color="primary" />
          <StatsCard title="Completed Days" value={stats.completedDays} color="success" />
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <StatsCard title="Total Visits" value={stats.totalVisits} color="secondary" />
          <StatsCard title="Completed Visits" value={stats.completedVisits} color="success" />
        </View>

        <Card>
          <ButtonSecondary title="Sign Out" onPress={() => { console.log('Logout user'); dispatch(logout()); }} />
        </Card>
      </View>
    </ScrollView>
  );
}


