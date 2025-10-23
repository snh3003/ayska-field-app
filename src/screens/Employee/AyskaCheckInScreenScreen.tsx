import React, { useEffect, useState } from 'react';
import { Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { submitCheckIn } from '../../store/slices/AyskaCheckInSlice';
import { fetchAllDoctors } from '../../store/slices/AyskaOnboardingSlice';
import { CheckInButton } from '../../components/business/AyskaCheckInButtonComponent';
import { useAuth } from '../../../hooks/useAuth';
import { Location } from '../../types/AyskaModelsType';

export default function CheckInScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { doctors } = useSelector((state: RootState) => state.onboarding);
  const { loading } = useSelector((state: RootState) => state.checkIn);
  const { doctorId } = useLocalSearchParams<{ doctorId: string }>();

  const [doctor, setDoctor] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchAllDoctors());
  }, [dispatch]);

  useEffect(() => {
    if (doctorId && doctors.length > 0) {
      const foundDoctor = doctors.find(doc => doc.id === doctorId);
      setDoctor(foundDoctor);
    }
  }, [doctorId, doctors]);

  const handleCheckIn = async (location: Location, notes?: string) => {
    if (!user?.id || !doctor) {
      Alert.alert('Error', 'Missing user or doctor information');
      return;
    }

    try {
      await dispatch(
        submitCheckIn({
          employeeId: user.id,
          doctorId: doctor.id,
          location: location,
          ...(notes && { notes }),
        } as any)
      ).unwrap();

      Alert.alert('Success', 'Check-in completed successfully!');
      router.back();
    } catch {
      Alert.alert('Error', 'Failed to check in. Please try again.');
    }
  };

  if (!doctor) {
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
            Check-in
          </TamaguiText>
        </TamaguiView>

        <TamaguiView
          flex={1}
          justifyContent="center"
          alignItems="center"
          padding="$md"
        >
          <Ionicons name="medical-outline" size={48} color="#ccc" />
          <TamaguiText fontSize="$4" color="$textSecondary" marginTop="$sm">
            Doctor not found
          </TamaguiText>
        </TamaguiView>
      </SafeAreaView>
    );
  }

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
          Check-in
        </TamaguiText>
      </TamaguiView>

      <ScrollView style={{ flex: 1 }}>
        <TamaguiView padding="$md">
          {/* Doctor Info */}
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
              <Ionicons name="medical" size={24} color="#4CAF50" />
              <TamaguiText
                fontSize="$5"
                fontWeight="bold"
                color="$text"
                marginLeft="$sm"
              >
                Doctor Information
              </TamaguiText>
            </TamaguiView>

            <TamaguiView marginBottom="$sm">
              <TamaguiText
                fontSize="$4"
                fontWeight="bold"
                color="$text"
                marginBottom="$xs"
              >
                {doctor.name}
              </TamaguiText>
              <TamaguiText
                fontSize="$3"
                color="$textSecondary"
                marginBottom="$xs"
              >
                Specialization: {doctor.specialization}
              </TamaguiText>
              {doctor.phone && (
                <TamaguiText
                  fontSize="$3"
                  color="$textSecondary"
                  marginBottom="$xs"
                >
                  Phone: {doctor.phone}
                </TamaguiText>
              )}
            </TamaguiView>

            <TamaguiView
              backgroundColor="$background"
              padding="$md"
              borderRadius="$md"
              borderWidth={1}
              borderColor="$border"
            >
              <TamaguiView
                flexDirection="row"
                alignItems="center"
                marginBottom="$xs"
              >
                <Ionicons name="location" size={16} color="#666" />
                <TamaguiText
                  fontSize="$3"
                  color="$textSecondary"
                  marginLeft="$sm"
                >
                  Location
                </TamaguiText>
              </TamaguiView>
              <TamaguiText fontSize="$3" color="$text">
                Latitude: {doctor.location.lat.toFixed(6)}
              </TamaguiText>
              <TamaguiText fontSize="$3" color="$text">
                Longitude: {doctor.location.lng.toFixed(6)}
              </TamaguiText>
            </TamaguiView>
          </TamaguiView>

          {/* Check-in Instructions */}
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
              <Ionicons name="information-circle" size={24} color="#2196F3" />
              <TamaguiText
                fontSize="$5"
                fontWeight="bold"
                color="$text"
                marginLeft="$sm"
              >
                Check-in Instructions
              </TamaguiText>
            </TamaguiView>

            <TamaguiView marginBottom="$sm">
              <TamaguiView
                flexDirection="row"
                alignItems="flex-start"
                marginBottom="$xs"
              >
                <TamaguiText fontSize="$3" color="$text" marginRight="$sm">
                  1.
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary" flex={1}>
                  Make sure you are within 50 meters of the doctor&apos;s
                  location
                </TamaguiText>
              </TamaguiView>
              <TamaguiView
                flexDirection="row"
                alignItems="flex-start"
                marginBottom="$xs"
              >
                <TamaguiText fontSize="$3" color="$text" marginRight="$sm">
                  2.
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary" flex={1}>
                  Tap &quot;Get Location&quot; to get your current position
                </TamaguiText>
              </TamaguiView>
              <TamaguiView
                flexDirection="row"
                alignItems="flex-start"
                marginBottom="$xs"
              >
                <TamaguiText fontSize="$3" color="$text" marginRight="$sm">
                  3.
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary" flex={1}>
                  Add any notes about your visit (optional)
                </TamaguiText>
              </TamaguiView>
              <TamaguiView flexDirection="row" alignItems="flex-start">
                <TamaguiText fontSize="$3" color="$text" marginRight="$sm">
                  4.
                </TamaguiText>
                <TamaguiText fontSize="$3" color="$textSecondary" flex={1}>
                  Tap &quot;Check In&quot; to complete the process
                </TamaguiText>
              </TamaguiView>
            </TamaguiView>
          </TamaguiView>

          {/* Check-in Button */}
          <CheckInButton
            doctor={doctor}
            employeeId={user?.id || ''}
            onCheckIn={handleCheckIn}
            loading={loading}
          />
        </TamaguiView>
      </ScrollView>
    </SafeAreaView>
  );
}
