import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Terms and Conditions', () => {
  describe(`GET ${paths.TERMS_AND_CONDITIONS}`, () => {
    it('should render terms and conditions page with correct heading', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Terms and conditions');
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display "Responsibility for the service" section', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Responsibility for the service');
      expect(response.text).toContain('Ministry of Justice (MOJ)');
      expect(response.text).toContain('MoJ accepts no liability for');
    });

    it('should display liability bullet points', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('.govuk-list');

      expect(list).toHaveTextContent('unable to access the service');
      expect(list).toHaveTextContent('indirect damages');
      expect(list).toHaveTextContent('external websites');
    });

    it('should display "Information about you and your site visits" section', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Information about you and your site visits');
      expect(response.text).toContain('collect and process information');
      expect(response.text).toContain('By using this service you agree');
    });

    it('should display links to privacy notice and cookie policy', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);
      const dom = new JSDOM(response.text);

      const privacyLink = dom.window.document.querySelector('a[href="/privacy-notice"]');
      const cookieLink = dom.window.document.querySelector('a[href="/cookies"]');

      expect(privacyLink).not.toBeNull();
      expect(cookieLink).not.toBeNull();
    });

    it('should display "Limitations of the service" section', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Limitations of the service');
      expect(response.text).toContain('does not guarantee');
    });

    it('should display "Misuse" section', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Misuse');
      expect(response.text).toContain('must not impersonate another person');
    });

    it('should display "Restrictions on use" section', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Restrictions on use');
      expect(response.text).toContain('court order in place');
      expect(response.text).toContain('legal consequences');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.TERMS_AND_CONDITIONS).expect(200);
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent('Terms and conditions');
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });
  });
});
