import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe(paths.CONTACT_US, () => {
  describe('GET', () => {
    it('should render contact us page', async () => {
      const response = await request(app).get(paths.CONTACT_US).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain('Contact us');
    });
  });
});
