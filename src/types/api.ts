// API request/response types

export interface Activity {
  id: string;
  title?: string;
  description?: string;
  timestamp: string;
  type: 'checkin' | 'checkout' | 'visit' | 'sale';
  status?: 'completed' | 'pending' | 'cancelled';
  employeeId: string;
  notes?: string;
  amount?: number;
}

export interface TeamSales {
  id?: string;
  teamName?: string;
  totalSales: number;
  targetSales?: number;
  members: TeamMember[];
  performance?: number; // percentage
  teamId: string;
}

export interface TeamMember {
  id?: string;
  name: string;
  role?: string;
  sales: number;
  target?: number;
  employeeId: string;
}

export interface SubmitActivityRequest {
  employeeId: string;
  activity?: Activity;
  type: string;
  timestamp: string;
  amount?: number;
}

export interface SubmitActivityResponse {
  success: boolean;
  message: string;
  activity: Activity;
}

export interface ReportsResponse {
  totalVisits?: number;
  completedVisits?: number;
  activeVisits?: number;
  activeEmployees?: number;
  topPerformers?: any[];
  start: string;
  end: string;
  items: any[];
}
