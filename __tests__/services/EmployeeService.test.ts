import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { EmployeeService } from '../../src/services/AyskaEmployeeService';
import type {
  Activity,
  SubmitActivityRequest,
} from '../../src/types/AyskaApiType';

describe('EmployeeService', () => {
  const mock = new MockAdapter(axios);
  const service = new EmployeeService(axios);

  afterEach(() => mock.reset());

  it('gets activities successfully', async () => {
    const activities: Activity[] = [
      {
        id: '1',
        employeeId: 'e1',
        type: 'visit',
        timestamp: '2025-01-01T10:00:00Z',
      },
    ];
    mock.onGet('/api/employees/e1/activities').reply(200, activities);

    const res = await service.getActivities('e1');
    expect(res).toEqual(activities);
  });

  it('submits activity successfully', async () => {
    const payload: SubmitActivityRequest = {
      employeeId: 'e1',
      type: 'sale',
      timestamp: '2025-01-01T10:00:00Z',
      amount: 100,
    };
    mock
      .onPost('/api/activities', payload)
      .reply(200, { success: true, activity: { id: '2', ...payload } });

    const res = await service.submitActivity(payload);
    expect(res.success).toBe(true);
    expect(res.activity.id).toBe('2');
  });

  it('propagates errors', async () => {
    mock.onGet('/api/employees/e1/activities').reply(500);
    await expect(service.getActivities('e1')).rejects.toBeTruthy();
  });
});
