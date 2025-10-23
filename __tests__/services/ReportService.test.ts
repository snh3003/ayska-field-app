import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { ReportService } from '../../src/services/AyskaReportService';
import type { ReportsResponse } from '../../src/types/AyskaApiType';

describe('ReportService', () => {
  const mock = new MockAdapter(axios);
  const service = new ReportService(axios);

  afterEach(() => mock.reset());

  it('gets reports successfully', async () => {
    const data: ReportsResponse = {
      start: '2025-01-01',
      end: '2025-01-31',
      items: [
        { date: '2025-01-01', totalVisits: 5, totalSales: 2 },
        { date: '2025-01-02', totalVisits: 3, totalSales: 1 },
      ],
    };
    mock
      .onGet('/api/reports', {
        params: { start: '2025-01-01', end: '2025-01-31' },
      } as any)
      .reply(200, data);

    const res = await service.getReports('2025-01-01', '2025-01-31');
    expect(res).toEqual(data);
  });

  it('propagates errors', async () => {
    mock.onGet('/api/reports').reply(500);
    await expect(
      service.getReports('2025-01-01', '2025-01-31')
    ).rejects.toBeTruthy();
  });
});
