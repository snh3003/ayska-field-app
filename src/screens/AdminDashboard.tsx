import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchTeamSales, selectAdminError, selectAdminLoading, selectTeamSales } from '../store/slices/adminSlice';
import { TeamCard } from '../components/business/TeamCard';

interface Props {
  teamId: string;
}

export const AdminDashboard: React.FC<Props> = ({ teamId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAdminLoading);
  const error = useSelector(selectAdminError);
  const teamSales = useSelector(selectTeamSales);

  useEffect(() => {
    dispatch(fetchTeamSales({ teamId }));
  }, [dispatch, teamId]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Admin Dashboard</Text>
      {loading && <ActivityIndicator />}
      {!loading && error && <Text accessibilityRole="alert">{error}</Text>}
      {!loading && !error && !teamSales && <Text>No team sales.</Text>}
      {!loading && !error && teamSales && (
        <ScrollView>
          <TeamCard team={teamSales} />
        </ScrollView>
      )}
    </View>
  );
};

export default AdminDashboard;


