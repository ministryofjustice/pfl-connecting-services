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
      const lists = dom.window.document.querySelectorAll('.govuk-list--bullet');
      const allListContent = Array.from(lists).map(list => list.textContent).join(' ');

      expect(allListContent).toContain('Initial meeting');
      expect(allListContent).toContain('Cost');
      expect(allListContent).toContain('You stay in control');
      expect(allListContent).toContain('Child-inclusive mediation');
      expect(allListContent).toContain('Court is still an option');
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
