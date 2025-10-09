import { useState, useEffect } from 'react';
import { localDataService, type Doctor } from '../src/services/LocalDataService';

export function useDoctors(employeeId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDoctors();
  }, [employeeId]);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (employeeId) {
        const assignedDoctors = localDataService.getAssignedDoctors(employeeId);
        setDoctors(assignedDoctors);
      } else {
        const allDoctors = localDataService.getAll<Doctor>('doctors');
        setDoctors(allDoctors);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch doctors');
    } finally {
      setLoading(false);
    }
  };

  const searchDoctors = (query: string) => {
    if (!query.trim()) {
      fetchDoctors();
      return;
    }

    const filtered = doctors.filter((doctor) =>
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

    const filtered = doctors.filter((doctor) =>
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

