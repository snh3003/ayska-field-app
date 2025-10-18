import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { Text as TamaguiText, View as TamaguiView } from '@tamagui/core';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { Location } from '../../types/models';
import { MapsConfig } from '../../config/maps';
import { Ionicons } from '@expo/vector-icons';
import { useColorScheme } from '../../../hooks/use-color-scheme';
import { Colors } from '../../../constants/theme';

interface MapPickerProps {
  onLocationSelect: (_location: Location) => void;
  initialLocation?: Location;
  title?: string;
}

export const MapPicker: React.FC<MapPickerProps> = ({
  onLocationSelect,
  initialLocation,
  title = 'Select Location',
}) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    initialLocation || null
  );
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const scheme = useColorScheme() ?? 'light';
  const theme = Colors[scheme];

  // Mock map component - in real app, this would be react-native-maps
  const MockMapView = () => (
    <TamaguiView
      height={200}
      backgroundColor="$border"
      borderRadius="$md"
      justifyContent="center"
      alignItems="center"
      marginBottom="$md"
    >
      <Ionicons name="map" size={48} color="#666" />
      <TamaguiText fontSize="$3" color="$textSecondary" marginTop="$sm">
        Map View ({MapsConfig.provider})
      </TamaguiText>
      <TamaguiText fontSize="$2" color="$textSecondary" marginTop="$xs">
        Tap to select location
      </TamaguiText>
    </TamaguiView>
  );

  const handleMapPress = (_event: any) => {
    // Mock location selection - in real app, use event.nativeEvent.coordinate
    const mockLocation: Location = {
      lat: 28.6139 + (Math.random() - 0.5) * 0.1,
      lng: 77.209 + (Math.random() - 0.5) * 0.1,
    };

    setSelectedLocation(mockLocation);
    setAddress(
      `Selected: ${mockLocation.lat.toFixed(4)}, ${mockLocation.lng.toFixed(4)}`
    );
  };

  const handleAddressSearch = async () => {
    if (!address.trim()) return;

    setLoading(true);
    try {
      // Mock geocoding - in real app, use MapProvider
      const mockLocation: Location = {
        lat: 28.6139 + (Math.random() - 0.5) * 0.1,
        lng: 77.209 + (Math.random() - 0.5) * 0.1,
      };

      setSelectedLocation(mockLocation);

      if (__DEV__) {
        console.log(
          `[${MapsConfig.provider}] Geocoded "${address}" to:`,
          mockLocation
        );
      }
    } catch {
      Alert.alert('Error', 'Failed to find location');
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) {
      Alert.alert('Error', 'Please select a location first');
      return;
    }

    onLocationSelect(selectedLocation);
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      // Mock current location - in real app, use GeolocationService
      const mockLocation: Location = {
        lat: 28.6139 + (Math.random() - 0.5) * 0.01,
        lng: 77.209 + (Math.random() - 0.5) * 0.01,
      };

      setSelectedLocation(mockLocation);
      setAddress(
        `Current: ${mockLocation.lat.toFixed(4)}, ${mockLocation.lng.toFixed(4)}`
      );

      if (__DEV__) {
        console.log('Current location:', mockLocation);
      }
    } catch {
      Alert.alert('Error', 'Failed to get current location');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TamaguiView>
      <TamaguiText
        fontSize="$5"
        fontWeight="bold"
        marginBottom="$md"
        color="$text"
      >
        {title}
      </TamaguiText>

      <TamaguiView marginBottom="$md">
        <TamaguiText fontSize="$4" marginBottom="$sm" color="$text">
          Search Address
        </TamaguiText>
        <TamaguiView flexDirection="row" gap="$sm">
          <Input
            value={address}
            onChangeText={(e: any) => setAddress(e)}
            placeholder="Enter address to search..."
          />
          <TouchableOpacity
            onPress={handleAddressSearch}
            disabled={loading || !address.trim()}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 16,
              paddingVertical: 12,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: loading || !address.trim() ? 0.6 : 1,
            }}
          >
            <Ionicons name="search" size={18} color="white" />
            <TamaguiText
              color="white"
              fontSize="$4"
              fontWeight="600"
              marginLeft="$xs"
            >
              Search
            </TamaguiText>
          </TouchableOpacity>
        </TamaguiView>
      </TamaguiView>

      <TamaguiView marginBottom="$md">
        <TamaguiView
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="$sm"
        >
          <TamaguiText fontSize="$4" color="$text">
            Map View
          </TamaguiText>
          <TamaguiView flexDirection="row" gap="$xs">
            <TouchableOpacity
              onPress={handleGetCurrentLocation}
              disabled={loading}
              style={{
                backgroundColor: theme.success,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: loading ? 0.6 : 1,
              }}
            >
              <Ionicons name="locate" size={16} color="white" />
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: theme.primary,
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 8,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="logo-google" size={16} color="white" />
              <TamaguiText
                fontSize="$2"
                color="white"
                marginLeft="$xs"
                fontWeight="600"
              >
                {MapsConfig.provider.toUpperCase()}
              </TamaguiText>
            </TouchableOpacity>
          </TamaguiView>
        </TamaguiView>

        <TamaguiView onPress={handleMapPress}>
          <MockMapView />
        </TamaguiView>
      </TamaguiView>

      {selectedLocation && (
        <TamaguiView marginBottom="$md">
          <TamaguiText fontSize="$4" marginBottom="$sm" color="$text">
            Selected Location
          </TamaguiText>
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
              <Ionicons name="location" size={16} color="#4CAF50" />
              <TamaguiText fontSize="$3" color="$text" marginLeft="$sm">
                Latitude: {selectedLocation.lat.toFixed(6)}
              </TamaguiText>
            </TamaguiView>
            <TamaguiView flexDirection="row" alignItems="center">
              <Ionicons name="location" size={16} color="#4CAF50" />
              <TamaguiText fontSize="$3" color="$text" marginLeft="$sm">
                Longitude: {selectedLocation.lng.toFixed(6)}
              </TamaguiText>
            </TamaguiView>
          </TamaguiView>
        </TamaguiView>
      )}

      <Button
        onPress={handleConfirmLocation}
        backgroundColor={selectedLocation ? '#4CAF50' : '#9E9E9E'}
        color="white"
        disabled={!selectedLocation || loading}
      >
        {loading ? 'Loading...' : 'Confirm Location'}
      </Button>
    </TamaguiView>
  );
};
