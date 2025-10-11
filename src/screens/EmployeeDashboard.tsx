import React, { useEffect } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../store';
import { fetchActivities, selectActivities, selectEmployeeError, selectEmployeeLoading } from '../store/slices/employeeSlice';
import { ActivityCard } from '../components/business/ActivityCard';

interface Props {
  employeeId: string;
}

export const EmployeeDashboard: React.FC<Props> = ({ employeeId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectEmployeeLoading);
  const error = useSelector(selectEmployeeError);
  const activities = useSelector(selectActivities);

  useEffect(() => {
    dispatch(fetchActivities({ employeeId }));
  }, [dispatch, employeeId]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', marginBottom: 12 }}>Employee Dashboard</Text>
      {loading && <ActivityIndicator />}
      {!loading && error && <Text accessibilityRole="alert">{error}</Text>}
      {!loading && !error && activities.length === 0 && <Text>No activities yet.</Text>}
      {!loading && !error && activities.length > 0 && (
        <ScrollView>
          {activities.map((a) => (
            <ActivityCard key={a.id} activity={a} />)
          )}
        </ScrollView>
      )}
    </View>
  );
};

export default EmployeeDashboard;


