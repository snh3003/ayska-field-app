import { useCallback, useEffect, useState } from 'react';
import { localDataService } from '../src/services/AyskaLocalDataService';
import { Doctor } from '../src/types';

export function useDoctors(_employeeId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const data = await localDataService.getAll<Doctor>('doctors');
      setDoctors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const searchDoctors = (query: string) => {
    if (!query.trim()) {
      fetchDoctors();
      return;
    }

    const filtered = doctors.filter(
      doctor =>
        doctor.name.toLowerCase().includes(query.toLowerCase()) ||
        doctor.specialization.toLowerCase().includes(query.toLowerCase())
    );
    setDoctors(filtered);
  };

  const filterBySpecialization = (specialization: string) => {
    if (!specialization) {
      fetchDoctors();
      return;
    }

    const filtered = doctors.filter(
      doctor =>
        doctor.specialization.toLowerCase() === specialization.toLowerCase()
    );
    setDoctors(filtered);
  };

  return {
    doctors,
    loading,
    error,
    refresh: fetchDoctors,
    searchDoctors,
    filterBySpecialization,
  };
}
