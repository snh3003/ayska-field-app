import { GeolocationService } from '../../src/services/AyskaGeolocationServiceService';
import { Location } from '../../src/types/AyskaModelsType';

import * as LocationModule from 'expo-location';

// Mock expo-location
jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn(),
  getCurrentPositionAsync: jest.fn(),
}));

describe('GeolocationService', () => {
  let geolocationService: GeolocationService;

  beforeEach(() => {
    jest.clearAllMocks();
    geolocationService = new GeolocationService();
  });

  describe('getCurrentLocation', () => {
    it('should return current location when permission is granted', async () => {
      // Arrange
      const mockLocation = {
        coords: {
          latitude: 28.6139,
          longitude: 77.209,
          altitude: null,
          accuracy: 10,
          altitudeAccuracy: null,
          heading: null,
          speed: null,
        },
        timestamp: Date.now(),
      };

      (
        LocationModule.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: 'granted',
      });
      (LocationModule.getCurrentPositionAsync as jest.Mock).mockResolvedValue(
        mockLocation
      );

      // Act
      const result = await geolocationService.getCurrentLocation();

      // Assert
      expect(result).toEqual({
        lat: 28.6139,
        lng: 77.209,
      });
      expect(
        LocationModule.requestForegroundPermissionsAsync
      ).toHaveBeenCalled();
      expect(LocationModule.getCurrentPositionAsync).toHaveBeenCalled();
    });

    it('should throw error when permission is denied', async () => {
      // Arrange
      (
        LocationModule.requestForegroundPermissionsAsync as jest.Mock
      ).mockResolvedValue({
        status: 'denied',
      });

      // Act & Assert
      await expect(geolocationService.getCurrentLocation()).rejects.toThrow(
        'Permission to access location was denied'
      );
    });
  });

  describe('validateProximity', () => {
    it('should return valid when locations are within tolerance', async () => {
      // Arrange
      const location1: Location = { lat: 28.6139, lng: 77.209 };
      const location2: Location = { lat: 28.614, lng: 77.2091 }; // Very close
      const toleranceMeters = 50;

      // Act
      const distance = geolocationService.calculateDistance(
        location1,
        location2
      );

      // Assert
      expect(distance).toBeLessThanOrEqual(toleranceMeters);
      expect(distance).toBeLessThan(toleranceMeters);
    });

    it('should return invalid when locations are outside tolerance', async () => {
      // Arrange
      const location1: Location = { lat: 28.6139, lng: 77.209 };
      const location2: Location = { lat: 28.62, lng: 77.22 }; // Far away
      const toleranceMeters = 50;

      // Act
      const distance = geolocationService.calculateDistance(
        location1,
        location2
      );

      // Assert
      expect(distance).toBeGreaterThan(toleranceMeters);
    });
  });
});
