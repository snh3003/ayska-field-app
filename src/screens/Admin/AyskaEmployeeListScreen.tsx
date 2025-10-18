import { Colors, Spacing } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import React, { useEffect, useState } from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../../components/ui/AyskaCardComponent';
import { localDataService } from '../../services/AyskaLocalDataServiceService';
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          padding: Spacing.lg,
          paddingBottom: Spacing.xxl,
        }}
      >
        {/* Header */}
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$lg"
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: theme.card,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <TamaguiText fontSize="$6" fontWeight="700" color="$text">
            Employees
          </TamaguiText>
          <TamaguiView width={44} />
        </TamaguiView>

        {/* Employee Count */}
        <TamaguiText
          fontSize="$4"
          lineHeight="$6"
          color="$textSecondary"
          marginBottom="$md"
        >
          {employees.length} employee{employees.length !== 1 ? 's' : ''} total
        </TamaguiText>

        {employees.length === 0 ? (
          <Card style={{ alignItems: 'center', padding: Spacing.xl }}>
            <Ionicons
              name="people-outline"
              size={48}
              color={theme.textSecondary}
              style={{ opacity: 0.3 }}
            />
            <TamaguiText
              fontSize="$4"
              lineHeight="$6"
              color="$textSecondary"
              marginTop="$md"
              textAlign="center"
            >
              No employees found
            </TamaguiText>
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
                <TamaguiView flexDirection="row" alignItems="center">
                  <TamaguiView
                    width={48}
                    height={48}
                    borderRadius="$md"
                    justifyContent="center"
                    alignItems="center"
                    backgroundColor={theme.avatarBg}
                  >
                    <Ionicons name="person" size={24} color={theme.primary} />
                  </TamaguiView>
                  <TamaguiView flex={1} marginLeft="$md">
                    <TamaguiText
                      fontSize="$4"
                      lineHeight="$6"
                      color="$text"
                      fontWeight="600"
                    >
                      {employee.name}
                    </TamaguiText>
                    <TamaguiText
                      fontSize="$2"
                      lineHeight="$4"
                      color="$textSecondary"
                      marginTop="$xs"
                    >
                      {employee.email}
                    </TamaguiText>
                    <TamaguiView flexDirection="row" marginTop="$sm" gap="$md">
                      <TamaguiView flexDirection="row" alignItems="center">
                        <Ionicons
                          name="calendar-outline"
                          size={14}
                          color={theme.icon}
                        />
                        <TamaguiText
                          fontSize="$2"
                          lineHeight="$4"
                          color="$textSecondary"
                          marginLeft="$xs"
                        >
                          {stats.totalDays} days
                        </TamaguiText>
                      </TamaguiView>
                      <TamaguiView flexDirection="row" alignItems="center">
                        <Ionicons
                          name="people-outline"
                          size={14}
                          color={theme.icon}
                        />
                        <TamaguiText
                          fontSize="$2"
                          lineHeight="$4"
                          color="$textSecondary"
                          marginLeft="$xs"
                        >
                          {stats.totalVisits} visits
                        </TamaguiText>
                      </TamaguiView>
                    </TamaguiView>
                  </TamaguiView>
                  <TamaguiView alignItems="flex-end">
                    <TamaguiView
                      paddingHorizontal="$sm"
                      paddingVertical="$xs"
                      borderRadius="$sm"
                      backgroundColor={isActive ? '$success' : '$textSecondary'}
                    >
                      <TamaguiText
                        fontSize="$2"
                        lineHeight="$4"
                        color="#FFFFFF"
                        fontWeight="600"
                      >
                        {isActive ? 'Active' : 'Inactive'}
                      </TamaguiText>
                    </TamaguiView>
                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={theme.icon}
                      style={{ marginTop: Spacing.xs }}
                    />
                  </TamaguiView>
                </TamaguiView>
              </Card>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
