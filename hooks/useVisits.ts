import { useCallback, useEffect, useState } from 'react';
import { localDataService } from '../src/services/LocalDataService';
import { Visit } from '../src/types';

export function useVisits(employeeId?: string) {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchVisits = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      if (employeeId) {
        const allVisits = localDataService.getAll<Visit>('visits');
        const employeeVisits = allVisits.filter(
          (v: Visit) => v.employeeId === employeeId
        );
        setVisits(employeeVisits);
      } else {
        const allVisits = localDataService.getAll<Visit>('visits');
        setVisits(allVisits);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  }, [employeeId]);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  const createVisit = (doctorId: string, notes?: string) => {
    if (!employeeId) return null;

    const visit: Visit = {
      id: `v_${Date.now()}`,
      employeeId,
      doctorId,
      checkInTime: new Date().toISOString(),
      status: 'in_progress',
      notes: notes || '',
    };

    localDataService.add('visits', visit);
    fetchVisits();
    return visit;
  };

  const completeVisit = (visitId: string, notes?: string) => {
    const updatedVisit = localDataService.update<Visit>('visits', visitId, {
      checkOutTime: new Date().toISOString(),
      status: 'completed',
      notes: notes || '',
    });

    fetchVisits();
    return updatedVisit;
  };

  const filterByStatus = (status: 'in_progress' | 'completed') => {
    const allVisits = localDataService.getAll<Visit>('visits');
    const filtered = allVisits.filter((v: Visit) => v.status === status);
    setVisits(filtered);
  };

  const filterByDate = (startDate: Date, endDate: Date) => {
    const allVisits = localDataService.getAll<Visit>('visits');
    const filtered = allVisits.filter((v: Visit) => {
      const visitDate = new Date(v.checkInTime);
      return visitDate >= startDate && visitDate <= endDate;
    });
    setVisits(filtered);
  };

  return {
    visits,
    loading,
    error,
    refresh: fetchVisits,
    createVisit,
    completeVisit,
    filterByStatus,
    filterByDate,
  };
}
