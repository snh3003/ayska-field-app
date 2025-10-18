import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSelector } from 'react-redux';
import { Card } from '../../components/ui/AyskaCardComponent';
import { localDataService } from '../../services/AyskaLocalDataServiceService';
import { Visit } from '../../types';
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
      <TamaguiView padding="$md">
        <TamaguiText
          fontSize="$6"
          fontWeight="700"
          color="$text"
          marginBottom="$lg"
        >
          Visit History
        </TamaguiText>

        {visits.length === 0 ? (
          <Card>
            <TamaguiText color="$text" textAlign="center">
              No visits recorded yet
            </TamaguiText>
          </Card>
        ) : (
          visits.map(visit => {
            const doctor = localDataService.getById('doctors', visit.doctorId);
            return (
              <Card key={visit.id} style={{ marginBottom: 12 }}>
                <TamaguiView
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <TamaguiView flex={1}>
                    <TamaguiText
                      fontSize="$5"
                      fontWeight="600"
                      color="$text"
                      marginBottom="$xs"
                    >
                      {(doctor as any)?.name || 'Unknown Doctor'}
                    </TamaguiText>
                    <TamaguiText color="$text" opacity={0.7} marginBottom="$sm">
                      {(doctor as any)?.specialization || 'Unknown Specialty'}
                    </TamaguiText>
                    <TamaguiText color="$text" opacity={0.6} fontSize="$3">
                      Check-in: {new Date(visit.checkInTime).toLocaleString()}
                    </TamaguiText>
                    {visit.checkOutTime && (
                      <TamaguiText color="$text" opacity={0.6} fontSize="$3">
                        Check-out:{' '}
                        {new Date(visit.checkOutTime).toLocaleString()}
                      </TamaguiText>
                    )}
                    {visit.notes && (
                      <TamaguiText
                        color="$text"
                        opacity={0.8}
                        fontSize="$3"
                        marginTop="$sm"
                        fontStyle="italic"
                      >
                        &ldquo;{visit.notes}&rdquo;
                      </TamaguiText>
                    )}
                  </TamaguiView>
                  <TamaguiView
                    backgroundColor={
                      visit.status === 'completed' ? '$success' : '$warning'
                    }
                    paddingHorizontal="$sm"
                    paddingVertical="$xs"
                    borderRadius="$md"
                    marginLeft="$sm"
                  >
                    <TamaguiText color="white" fontSize="$2" fontWeight="600">
                      {visit.status === 'completed'
                        ? 'Completed'
                        : 'In Progress'}
                    </TamaguiText>
                  </TamaguiView>
                </TamaguiView>
              </Card>
            );
          })
        )}
      </TamaguiView>
    </ScrollView>
  );
}
