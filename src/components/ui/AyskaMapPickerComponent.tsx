import React, { useState } from 'react';
import { Alert, TouchableOpacity } from 'react-native';
import { View as TamaguiView } from '@tamagui/core';
import { Button } from '@tamagui/button';
import { Input } from '@tamagui/input';
import { AyskaTextComponent } from './AyskaTextComponent';
import { AyskaCaptionComponent } from './AyskaCaptionComponent';
import { AyskaTitleComponent } from './AyskaTitleComponent';
import { Location } from '../../types/AyskaModelsType';
import { MapsConfig } from '../../config/maps';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../../utils/theme';

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
  const theme = useTheme();

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
      <Ionicons name="map" size={48} color={theme.textSecondary} />
      <AyskaTextComponent
        variant="body"
        color="textSecondary"
        style={{ marginTop: 8 }}
      >
        Map View ({MapsConfig.provider})
      </AyskaTextComponent>
      <AyskaCaptionComponent color="textSecondary" style={{ marginTop: 4 }}>
        Tap to select location
      </AyskaCaptionComponent>
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
      <AyskaTitleComponent
        level={3}
        weight="bold"
        color="textSecondary"
        style={{ marginBottom: 16 }}
      >
        {title}
      </AyskaTitleComponent>

      <TamaguiView marginBottom="$md">
        <AyskaTextComponent
          variant="bodyLarge"
          color="textSecondary"
          style={{ marginBottom: 8 }}
        >
          Search Address
        </AyskaTextComponent>
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
            <AyskaTextComponent
              color="textSecondary"
              variant="bodyLarge"
              weight="semibold"
              style={{ color: 'white', marginLeft: 4 }}
            >
              Search
            </AyskaTextComponent>
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
          <AyskaTextComponent variant="bodyLarge" color="text">
            Map View
          </AyskaTextComponent>
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
              <AyskaCaptionComponent
                color="textSecondary"
                style={{ color: 'white', marginLeft: 4, fontWeight: '600' }}
              >
                {MapsConfig.provider.toUpperCase()}
              </AyskaCaptionComponent>
            </TouchableOpacity>
          </TamaguiView>
        </TamaguiView>

        <TamaguiView onPress={handleMapPress}>
          <MockMapView />
        </TamaguiView>
      </TamaguiView>

      {selectedLocation && (
        <TamaguiView marginBottom="$md">
          <AyskaTextComponent
            variant="bodyLarge"
            color="textSecondary"
            style={{ marginBottom: 8 }}
          >
            Selected Location
          </AyskaTextComponent>
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
              <Ionicons name="location" size={16} color={theme.success} />
              <AyskaTextComponent
                variant="body"
                color="textSecondary"
                style={{ marginLeft: 8 }}
              >
                Latitude: {selectedLocation.lat.toFixed(6)}
              </AyskaTextComponent>
            </TamaguiView>
            <TamaguiView flexDirection="row" alignItems="center">
              <Ionicons name="location" size={16} color={theme.success} />
              <AyskaTextComponent
                variant="body"
                color="textSecondary"
                style={{ marginLeft: 8 }}
              >
                Longitude: {selectedLocation.lng.toFixed(6)}
              </AyskaTextComponent>
            </TamaguiView>
          </TamaguiView>
        </TamaguiView>
      )}

      <Button
        onPress={handleConfirmLocation}
        backgroundColor={selectedLocation ? theme.success : theme.textSecondary}
        color="white"
        disabled={!selectedLocation || loading}
      >
        {loading ? 'Loading...' : 'Confirm Location'}
      </Button>
    </TamaguiView>
  );
};
