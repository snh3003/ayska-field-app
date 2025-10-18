import type { AxiosInstance } from 'axios';
import type { TeamSales } from '../types/AyskaApiType';

/** Admin-related API calls */
export class AdminService {
  private http: AxiosInstance;

  constructor(http: AxiosInstance) {
    this.http = http;
  }

  /** Fetch sales summary for a team */
  async getTeamSales(teamId: string): Promise<TeamSales> {
    const { data } = await this.http.get<TeamSales>(
      `/api/teams/${teamId}/sales`
    );
    return data;
  }
}
