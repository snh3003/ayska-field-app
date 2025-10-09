import type { Activity, ReportsResponse, TeamSales } from '../types/api';

export const mockActivities: Activity[] = [
  { id: 'a1', employeeId: 'e1', type: 'visit', timestamp: '2025-01-01T10:00:00Z', notes: 'Visited client A' },
  { id: 'a2', employeeId: 'e1', type: 'sale', timestamp: '2025-01-02T11:00:00Z', amount: 200 },
];

export const mockTeamSales: TeamSales = {
  teamId: 't1',
  totalSales: 300,
  members: [
    { employeeId: 'e1', name: 'Alice', sales: 100 },
    { employeeId: 'e2', name: 'Bob', sales: 200 },
  ],
};

export const mockReports: ReportsResponse = {
  start: '2025-01-01',
  end: '2025-01-31',
  items: [
    { date: '2025-01-01', totalVisits: 5, totalSales: 2 },
    { date: '2025-01-02', totalVisits: 3, totalSales: 1 },
  ],
};


