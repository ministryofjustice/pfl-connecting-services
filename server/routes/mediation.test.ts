import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Mediation', () => {
  describe(`GET ${paths.MEDIATION}`, () => {
    it('should render mediation page with correct heading', async () => {
      const response = await request(app).get(paths.MEDIATION).expect('Content-Type', /html/);
      const html = response.text;

      expect(html).toContain(
          'Explore: Mediation',
      );
      expect(html).not.toContain('h2.govuk-error-summary__title');
    });

    it('should display examples of abuse as bullet list', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);
      const html = response.text;

      expect(html).toContain('Initial meeting');
      expect(html).toContain('Cost');
      expect(html).toContain('You stay in control');
      expect(html).toContain('Child-inclusive mediation');
      expect(html).toContain('Court is still an option');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);
      const html = response.text;
      expect(html).toContain('Print this page');
    });
  });
});
