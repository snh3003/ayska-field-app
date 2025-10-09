import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Card } from '../../components/ui/Card';
import { localDataService, type Employee } from '../../services/LocalDataService';

export default function EmployeeList() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    const employeeList = localDataService.getAll<Employee>('employees');
    setEmployees(employeeList);
  }, []);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 24, fontWeight: '700', color: theme.text, marginBottom: 20 }}>
          Employees
        </Text>
        
        {employees.length === 0 ? (
          <Card>
            <Text style={{ color: theme.text, textAlign: 'center' }}>No employees found</Text>
          </Card>
        ) : (
          employees.map((employee) => {
            const stats = localDataService.getEmployeeStats(employee.id);
            return (
              <Card key={employee.id} style={{ marginBottom: 12 }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                  {employee.name}
                </Text>
                <Text style={{ color: theme.text, opacity: 0.7, marginBottom: 8 }}>
                  {employee.email}
                </Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <Text style={{ color: theme.text, opacity: 0.6, fontSize: 14 }}>
                    Days: {stats.totalDays} | Visits: {stats.totalVisits}
                  </Text>
                  <View style={{ 
                    backgroundColor: stats.totalDays > 0 ? '#10B981' : '#6B7280',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 12
                  }}>
                    <Text style={{ color: 'white', fontSize: 12, fontWeight: '600' }}>
                      {stats.totalDays > 0 ? 'Active' : 'Inactive'}
                    </Text>
                  </View>
                </View>
              </Card>
            );
          })
        )}
      </View>
    </ScrollView>
  );
}


