import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Options no contact', () => {
  describe(`GET ${paths.OPTIONS_NO_CONTACT}`, () => {
    it('should render options no contact page with correct heading', async () => {
      const response = await request(app).get(paths.OPTIONS_NO_CONTACT).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Options to explore if you are not comfortable contacting your ex-partner',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });
  });
});
