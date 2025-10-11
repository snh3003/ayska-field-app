import { API_ENDPOINTS } from '../constants/constants';
import type { CheckIn, Doctor } from '../types';

/**
 * Fetches doctors assigned to the logged-in employee for the day.
 * Later, integrate with GET /assigned-doctors
 */
export const fetchAssignedDoctors = async (): Promise<Doctor[]> => {
  console.log('API call → GET', API_ENDPOINTS.ASSIGNED_DOCTORS);
  return [];
};

/**
 * Performs a check-in for the specified doctor.
 * Later, integrate with POST /checkin
 */
export const performCheckIn = async (
  doctorId: string
): Promise<{ success: boolean }> => {
  console.log('API call → POST', API_ENDPOINTS.CHECKIN, { doctorId });
  return { success: true };
};

/**
 * Retrieves check-in history for the current employee.
 * Later, integrate with GET /checkin-history
 */
export const fetchCheckInHistory = async (): Promise<CheckIn[]> => {
  console.log('API call → GET', API_ENDPOINTS.HISTORY);
  return [];
};

/**
 * Manually triggers a check-in on behalf of an employee.
 * Later, integrate with POST /manual-checkin
 */
export const manualCheckIn = async (
  employeeId: string,
  doctorId: string
): Promise<{ success: boolean }> => {
  console.log('API call → POST', API_ENDPOINTS.MANUAL_CHECKIN, {
    employeeId,
    doctorId,
  });
  return { success: true };
};
