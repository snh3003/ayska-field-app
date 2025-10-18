import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { AdminService } from '../../src/services/AyskaAdminServiceService';
import type { TeamSales } from '../../src/types/AyskaApiType';

describe('AdminService', () => {
  const mock = new MockAdapter(axios);
  const service = new AdminService(axios);

  afterEach(() => mock.reset());

  it('gets team sales successfully', async () => {
    const data: TeamSales = {
      teamId: 't1',
      totalSales: 300,
      members: [
        { employeeId: 'e1', name: 'Alice', sales: 100 },
        { employeeId: 'e2', name: 'Bob', sales: 200 },
      ],
    };
    mock.onGet('/api/teams/t1/sales').reply(200, data);

    const res = await service.getTeamSales('t1');
    expect(res).toEqual(data);
  });

  it('propagates errors', async () => {
    mock.onGet('/api/teams/t1/sales').reply(404);
    await expect(service.getTeamSales('t1')).rejects.toBeTruthy();
  });
});
