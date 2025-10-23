import { IGeolocationService } from '../interfaces/AyskaOnboardingInterface';
import { Location } from '../types/AyskaModelsType';
import * as LocationService from 'expo-location';

export class GeolocationService implements IGeolocationService {
  async getCurrentLocation(): Promise<Location> {
    try {
      const { status } =
        await LocationService.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }

      const location = await LocationService.getCurrentPositionAsync({
        accuracy: LocationService.Accuracy.High,
      });

      return {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
    } catch (error) {
      if (__DEV__) console.error('Geolocation error:', error);
      throw new Error('Failed to get current location');
    }
  }

  calculateDistance(loc1: Location, loc2: Location): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (loc1.lat * Math.PI) / 180;
    const φ2 = (loc2.lat * Math.PI) / 180;
    const Δφ = ((loc2.lat - loc1.lat) * Math.PI) / 180;
    const Δλ = ((loc2.lng - loc1.lng) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }
}
