import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe(paths.PRIVACY_NOTICE, () => {
  describe('GET', () => {
    it('should render privacy notice page', async () => {
      const response = await request(app).get(paths.PRIVACY_NOTICE).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain('Privacy notice');
    });
  });
});
