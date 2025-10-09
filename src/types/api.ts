export interface Activity {
  id: string;
  employeeId: string;
  type: 'visit' | 'call' | 'sale' | 'note';
  timestamp: string;
  notes?: string;
  amount?: number;
}

export interface SubmitActivityRequest {
  employeeId: string;
  type: Activity['type'];
  timestamp: string;
  notes?: string;
  amount?: number;
}

export interface SubmitActivityResponse {
  success: boolean;
  activity: Activity;
}

export interface TeamSales {
  teamId: string;
  totalSales: number;
  members: Array<{
    employeeId: string;
    name: string;
    sales: number;
  }>;
}

export interface ReportItem {
  date: string; // YYYY-MM-DD
  totalVisits: number;
  totalSales: number;
}

export interface ReportsResponse {
  start: string;
  end: string;
  items: ReportItem[];
}


