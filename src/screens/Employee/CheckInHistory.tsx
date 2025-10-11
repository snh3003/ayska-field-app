import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/Card';
import { localDataService, type Visit } from '../../services/LocalDataService';
import type { RootState } from '../../store';

export default function CheckInHistory() {
  const [visits, setVisits] = useState<Visit[]>([]);
  const { userId } = useSelector((s: RootState) => s.auth);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  useEffect(() => {
    if (userId) {
      const userVisits = localDataService
        .getAll('visits')
        .filter((v: any) => v.employeeId === userId);
      setVisits(userVisits as Visit[]);
    }
  }, [userId]);

  return (
    <ScrollView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={{ padding: 16 }}>
        <Text
          style={{
            fontSize: 24,
            fontWeight: '700',
            color: theme.text,
            marginBottom: 20,
          }}
        >
          Visit History
        </Text>

        {visits.length === 0 ? (
          <Card>
            <Text style={{ color: theme.text, textAlign: 'center' }}>
              No visits recorded yet
            </Text>
          </Card>
        ) : (
          visits.map(visit => {
            const doctor = localDataService.getById('doctors', visit.doctorId);
            return (
              <Card key={visit.id} style={{ marginBottom: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontWeight: '600',
                        color: theme.text,
                        marginBottom: 4,
                      }}
                    >
                      {(doctor as any)?.name || 'Unknown Doctor'}
                    </Text>
                    <Text
                      style={{
                        color: theme.text,
                        opacity: 0.7,
                        marginBottom: 8,
                      }}
                    >
                      {(doctor as any)?.specialization || 'Unknown Specialty'}
                    </Text>
                    <Text
                      style={{ color: theme.text, opacity: 0.6, fontSize: 14 }}
                    >
                      Check-in: {new Date(visit.checkInTime).toLocaleString()}
                    </Text>
                    {visit.checkOutTime && (
                      <Text
                        style={{
                          color: theme.text,
                          opacity: 0.6,
                          fontSize: 14,
                        }}
                      >
                        Check-out:{' '}
                        {new Date(visit.checkOutTime).toLocaleString()}
                      </Text>
                    )}
                    {visit.notes && (
                      <Text
                        style={{
                          color: theme.text,
                          opacity: 0.8,
                          fontSize: 14,
                          marginTop: 8,
                          fontStyle: 'italic',
                        }}
                      >
                        &ldquo;{visit.notes}&rdquo;
                      </Text>
                    )}
                  </View>
                  <View
                    style={{
                      backgroundColor:
                        visit.status === 'completed' ? '#10B981' : '#F59E0B',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      marginLeft: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 12,
                        fontWeight: '600',
                      }}
                    >
                      {visit.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
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
