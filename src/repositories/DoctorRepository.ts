import { Doctor, IDoctorRepository } from '../interfaces/onboarding';
import { LocalDataRepository } from './LocalDataRepository';

export class DoctorRepository implements IDoctorRepository {
  private dataRepository: LocalDataRepository<any>;

  constructor(dataRepository: LocalDataRepository<any>) {
    this.dataRepository = dataRepository;
  }

  async getAll(): Promise<Doctor[]> {
    return this.dataRepository.getAll('doctors');
  }

  async getById(id: string): Promise<Doctor | null> {
    return this.dataRepository.getById('doctors', id);
  }

  async create(item: Doctor): Promise<Doctor> {
    return this.dataRepository.create('doctors', item);
  }

  async update(id: string, updates: Partial<Doctor>): Promise<Doctor | null> {
    return this.dataRepository.update('doctors', id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.dataRepository.delete('doctors', id);
  }

  async getByLocation(
    lat: number,
    lng: number,
    radiusKm: number
  ): Promise<Doctor[]> {
    const doctors = await this.getAll();
    return doctors.filter(doctor => {
      const distance = this.haversineDistance({ lat, lng }, doctor.location);
      return distance <= radiusKm * 1000; // Convert km to meters
    });
  }

  private haversineDistance(
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ): number {
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
