import type { AxiosInstance } from 'axios';
import type { ReportsResponse } from '../types/api';

/** Reporting endpoints */
export class ReportService {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /** Fetch reports between start and end inclusive (YYYY-MM-DD) */
  async getReports(start: string, end: string): Promise<ReportsResponse> {
    const { data } = await this.http.get<ReportsResponse>(`/api/reports`, {
      params: { start, end },
    });
    return data;
  }
}


