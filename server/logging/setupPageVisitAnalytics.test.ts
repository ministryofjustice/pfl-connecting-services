import request from 'supertest';

import * as analyticsService from '../services/analyticsService';
import testAppSetup from '../test-utils/testAppSetup';


jest.mock('../services/analyticsService', () => ({
  logPageVisit: jest.fn(),
}));

const app = testAppSetup();


describe('setupPageVisitAnalytics Middleware', () => {
  beforeEach(() => {
    (analyticsService.logPageVisit as jest.Mock).mockClear();
  });

  it('should log a page_visit event for a successful GET request', async () => {
    await request(app).get('/').expect(200);

    expect(analyticsService.logPageVisit).toHaveBeenCalledTimes(1);
  });

  it('should NOT log requests to excluded paths like /health', async () => {
    await request(app).get('/health').expect(200);

    expect(analyticsService.logPageVisit).not.toHaveBeenCalled();
  });
});
