import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Mediation', () => {
  describe(`GET ${paths.MEDIATION}`, () => {
    it('should render mediation page with correct heading', async () => {
      const response = await request(app).get(paths.MEDIATION).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
          'Explore: Mediation',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display examples of abuse as bullet list', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('.govuk-list');

      expect(list).toHaveTextContent('Initial meeting');
      expect(list).toHaveTextContent('Cost');
      expect(list).toHaveTextContent('You stay in control');
      expect(list).toHaveTextContent('Child-inclusive mediation');
      expect(list).toHaveTextContent('Court is still an option');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);
      const dom = new JSDOM(response.text);
      const button = dom.window.document.querySelector('#print-this-page-button');      
      expect(button).toHaveTextContent('Print this page');
    });
  });
});
