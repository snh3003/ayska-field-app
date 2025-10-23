import React, { useEffect } from 'react';
import { RefreshControl, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchEmployeeAssignments } from '../../store/slices/AyskaAssignmentSlice';
import { fetchAllDoctors } from '../../store/slices/AyskaOnboardingSlice';
import { AssignmentCard } from '../../components/business/AyskaAssignmentCardComponent';
import { useAuth } from '../../../hooks/useAuth';

export default function MyAssignmentsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { doctors } = useSelector((state: RootState) => state.onboarding);
  const { assignments: employeeAssignments, loading } = useSelector(
    (state: RootState) => state.assignment
  );

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchEmployeeAssignments(user.id));
    }
    dispatch(fetchAllDoctors());
  }, [dispatch, user?.id]);

  const handleRefresh = () => {
    if (user?.id) {
      dispatch(fetchEmployeeAssignments(user.id));
    }
  };

  const getDoctorName = (doctorId: string) => {
    const doctor = doctors.find(doc => doc.id === doctorId);
    return doctor?.name || `Doctor ${doctorId}`;
  };

  const getTotalProgress = () => {
    return employeeAssignments.reduce(
      (sum: number, assignment: any) => sum + assignment.currentProgress,
      0
    );
  };

  const getTotalTarget = () => {
    return employeeAssignments.reduce(
      (sum: number, assignment: any) => sum + assignment.target,
      0
    );
  };

  const getCompletionRate = () => {
    const total = getTotalTarget();
    return total > 0 ? (getTotalProgress() / total) * 100 : 0;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      <TamaguiView
        flexDirection="row"
        alignItems="center"
        padding="$md"
        backgroundColor="white"
        borderBottomWidth={1}
        borderBottomColor="#e0e0e0"
      >
        <TamaguiView
          onPress={() => router.back()}
          padding="$sm"
          marginRight="$sm"
        >
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TamaguiView>
        <TamaguiText fontSize="$6" fontWeight="bold" color="$text">
          My Assignments
        </TamaguiText>
      </TamaguiView>

      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={handleRefresh} />
        }
      >
        <TamaguiView padding="$md">
          {/* Summary Stats */}
          <TamaguiView
            backgroundColor="white"
            borderRadius="$md"
            padding="$md"
            marginBottom="$md"
          >
            <TamaguiView
              flexDirection="row"
              alignItems="center"
              marginBottom="$md"
            >
              <Ionicons name="analytics" size={24} color="#2196F3" />
              <TamaguiText
                fontSize="$5"
                fontWeight="bold"
                color="$text"
                marginLeft="$sm"
              >
                Progress Summary
              </TamaguiText>
            </TamaguiView>

            <TamaguiView
              flexDirection="row"
              justifyContent="space-between"
              marginBottom="$sm"
            >
              <TamaguiView flex={1} marginRight="$sm">
                <TamaguiView
                  flexDirection="row"
                  alignItems="center"
                  marginBottom="$xs"
                >
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <TamaguiText
                    fontSize="$3"
                    color="$textSecondary"
                    marginLeft="$xs"
                  >
                    Completed
                  </TamaguiText>
                </TamaguiView>
                <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
                  {getTotalProgress()}
                </TamaguiText>
              </TamaguiView>

              <TamaguiView flex={1} marginLeft="$sm">
                <TamaguiView
                  flexDirection="row"
                  alignItems="center"
                  marginBottom="$xs"
                >
                  <Ionicons name="flag" size={16} color="#FF9800" />
                  <TamaguiText
                    fontSize="$3"
                    color="$textSecondary"
                    marginLeft="$xs"
                  >
                    Target
                  </TamaguiText>
                </TamaguiView>
                <TamaguiText fontSize="$4" fontWeight="bold" color="$text">
                  {getTotalTarget()}
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>

            <TamaguiView marginBottom="$sm">
              <TamaguiView
                flexDirection="row"
                justifyContent="space-between"
                marginBottom="$xs"
              >
                <TamaguiText fontSize="$4" color="$text">
                  Overall Progress
                </TamaguiText>
                <TamaguiText fontSize="$4" color="$text" fontWeight="bold">
                  {Math.round(getCompletionRate())}%
                </TamaguiText>
              </TamaguiView>

              <TamaguiView
                height={8}
                backgroundColor="$border"
                borderRadius="$sm"
                overflow="hidden"
              >
                <TamaguiView
                  height="100%"
                  backgroundColor="#4CAF50"
                  width={`${Math.min(getCompletionRate(), 100)}%`}
                />
              </TamaguiView>
            </TamaguiView>
          </TamaguiView>

          {/* Assignments List */}
          <TamaguiView backgroundColor="white" borderRadius="$md" padding="$md">
            <TamaguiView
              flexDirection="row"
              alignItems="center"
              marginBottom="$md"
            >
              <Ionicons name="list" size={24} color="#FF9800" />
              <TamaguiText
                fontSize="$5"
                fontWeight="bold"
                color="$text"
                marginLeft="$sm"
              >
                Doctor Assignments
              </TamaguiText>
            </TamaguiView>

            {employeeAssignments.length === 0 ? (
              <TamaguiView alignItems="center" padding="$lg">
                <Ionicons name="document-outline" size={48} color="#ccc" />
                <TamaguiText
                  fontSize="$4"
                  color="$textSecondary"
                  marginTop="$sm"
                >
                  No assignments yet
                </TamaguiText>
                <TamaguiText
                  fontSize="$3"
                  color="$textSecondary"
                  marginTop="$xs"
                  textAlign="center"
                >
                  Your admin will assign doctors to you soon
                </TamaguiText>
              </TamaguiView>
            ) : (
              employeeAssignments.map((assignment: any) => (
                <AssignmentCard
                  key={assignment.id}
                  assignment={assignment}
                  doctorName={getDoctorName(assignment.doctorId)}
                  onPress={() => {
                    // Navigate to check-in screen for this doctor
                    router.push({
                      pathname: '/employee/checkin' as any,
                      params: { doctorId: assignment.doctorId },
                    });
                  }}
                />
              ))
            )}
          </TamaguiView>
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
