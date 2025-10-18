import React, { useState } from 'react';
import { Alert } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { AyskaTextComponent } from '../ui/AyskaTextComponent';
import { AyskaCaptionComponent } from '../ui/AyskaCaptionComponent';
import { useTheme } from '../../../utils/theme';
import { Doctor } from '../../types/AyskaModelsType';
import { Ionicons } from '@expo/vector-icons';

interface CheckInButtonProps {
  doctor: Doctor;
  employeeId: string;
  onCheckIn: (
    _location: { lat: number; lng: number },
    _notes?: string
  ) => Promise<void>;
  loading?: boolean;
}

export const CheckInButton: React.FC<CheckInButtonProps> = ({
  doctor,
  employeeId: _employeeId,
  onCheckIn,
  loading = false,
}) => {
  const theme = useTheme();

  const [notes, setNotes] = useState('');
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [isValidLocation, setIsValidLocation] = useState(false);

  const getCurrentLocation = async () => {
    try {
      // Mock location for demo - in real app, use GeolocationService
      const mockLocation = {
        lat: 28.6139 + (Math.random() - 0.5) * 0.01, // Random location near Delhi
        lng: 77.209 + (Math.random() - 0.5) * 0.01,
      };

      setCurrentLocation(mockLocation);

      // Calculate distance (mock calculation)
      const calculatedDistance = Math.random() * 100; // 0-100 meters
      setDistance(calculatedDistance);
      setIsValidLocation(calculatedDistance <= 50);

      if (__DEV__) {
        console.log('Current location:', mockLocation);
        console.log('Distance to doctor:', calculatedDistance, 'meters');
      }
    } catch {
      Alert.alert('Error', 'Failed to get current location');
    }
  };

  const handleCheckIn = async () => {
    if (!currentLocation) {
      Alert.alert('Error', 'Please get your current location first');
      return;
    }

    if (!isValidLocation) {
      Alert.alert(
        'Error',
        `You are ${Math.round(distance || 0)}m away. Must be within 50m of the doctor.`
      );
      return;
    }

    try {
      await onCheckIn(currentLocation, notes.trim() || undefined);
      setNotes('');
      setCurrentLocation(null);
      setDistance(null);
      setIsValidLocation(false);
    } catch {
      Alert.alert('Error', 'Failed to check in');
    }
  };

  return (
    <TamaguiView
      padding="$md"
      backgroundColor="$card"
      borderRadius="$md"
      marginBottom="$md"
    >
      <AyskaTextComponent
        variant="bodyLarge"
        weight="bold"
        color="text"
        style={{ marginBottom: 16 }}
      >
        Check-in with {doctor.name}
      </AyskaTextComponent>

      <TamaguiView marginBottom="$md">
        <TamaguiView flexDirection="row" alignItems="center" marginBottom="$sm">
          <Ionicons name="location" size={20} color={theme.textSecondary} />
          <AyskaTextComponent color="text" style={{ marginLeft: 8 }}>
            Doctor Location
          </AyskaTextComponent>
        </TamaguiView>
        <AyskaCaptionComponent color="textSecondary">
          Lat: {doctor.location.lat.toFixed(4)}, Lng:{' '}
          {doctor.location.lng.toFixed(4)}
        </AyskaCaptionComponent>
      </TamaguiView>

      {currentLocation && (
        <TamaguiView marginBottom="$md">
          <TamaguiView
            flexDirection="row"
            alignItems="center"
            marginBottom="$sm"
          >
            <Ionicons
              name={isValidLocation ? 'checkmark-circle' : 'close-circle'}
              size={20}
              color={isValidLocation ? theme.success : theme.error}
            />
            <AyskaTextComponent color="text" style={{ marginLeft: 8 }}>
              Your Location
            </AyskaTextComponent>
          </TamaguiView>
          <AyskaCaptionComponent
            color="textSecondary"
            style={{ marginBottom: 4 }}
          >
            Lat: {currentLocation.lat.toFixed(4)}, Lng:{' '}
            {currentLocation.lng.toFixed(4)}
          </AyskaCaptionComponent>
          <AyskaCaptionComponent
            color={isValidLocation ? 'success' : 'error'}
            style={{ fontWeight: 'bold' }}
          >
            Distance: {Math.round(distance || 0)}m{' '}
            {isValidLocation ? '(Valid)' : '(Too far)'}
          </AyskaCaptionComponent>
        </TamaguiView>
      )}

      <TamaguiView marginBottom="$md">
        <AyskaTextComponent color="text" style={{ marginBottom: 8 }}>
          Notes (Optional)
        </AyskaTextComponent>
        <Input
          value={notes}
          onChangeText={(e: any) => setNotes(e)}
          placeholder="Add any notes about this visit..."
          multiline
          numberOfLines={3}
        />
      </TamaguiView>

      <TamaguiView flexDirection="row" gap="$sm">
        <Button
          onPress={getCurrentLocation}
          backgroundColor="$primary"
          color="white"
          flex={1}
          disabled={loading}
        >
          Get Location
        </Button>

        <Button
          onPress={handleCheckIn}
          backgroundColor={
            isValidLocation ? theme.success : theme.textSecondary
          }
          color="white"
          flex={1}
          disabled={!isValidLocation || loading}
        >
          {loading ? 'Checking In...' : 'Check In'}
        </Button>
      </TamaguiView>
    </TamaguiView>
  );
};
