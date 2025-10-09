import type { AxiosInstance } from 'axios';
import type { Activity, SubmitActivityRequest, SubmitActivityResponse } from '../types/api';

/** Employee-related API calls */
export class EmployeeService {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /** Fetch activities for a given employee */
  async getActivities(employeeId: string): Promise<Activity[]> {
    const { data } = await this.http.get<Activity[]>(`/api/employees/${employeeId}/activities`);
    return Array.isArray(data) ? data : [];
  }

  /** Submit a new activity */
  async submitActivity(payload: SubmitActivityRequest): Promise<SubmitActivityResponse> {
    const { data } = await this.http.post<SubmitActivityResponse>(`/api/activities`, payload);
    return data;
  }
}


