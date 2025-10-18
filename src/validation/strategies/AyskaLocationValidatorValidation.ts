import { ILocationValidator } from '../../interfaces/AyskaPatternsInterface';
import { Location } from '../../types/AyskaModelsType';
import { ValidationResult } from '../../interfaces/AyskaValidationInterface';

export class ProximityValidator implements ILocationValidator {
  validateProximity(
    loc1: Location,
    loc2: Location,
    tolerance: number
  ): ValidationResult {
    const distance = this.haversineDistance(loc1, loc2);
    if (distance <= tolerance) {
      return { isValid: true };
    }
    return {
      isValid: false,
      error: `Distance: ${Math.round(distance)}m. Must be within ${tolerance}m`,
    };
  }

  validate(_value: any): ValidationResult {
    // Implements IValidationStrategy - not used for location validation
    return { isValid: true };
  }

  private haversineDistance(loc1: Location, loc2: Location): number {
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
