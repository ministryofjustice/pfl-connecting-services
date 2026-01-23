import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Safeguarding Page', () => {
  describe(`GET ${paths.SAFEGUARDING}`, () => {
    it('should render safeguarding page with correct heading', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Support is available');
      expect(response.status).toBe(200);
    });

    it('should display Exit This Page button prominently', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display 999 warning for immediate danger', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text__text');

      expect(warningText?.textContent).toContain('999');
      expect(warningText?.textContent).toContain('immediate danger');
    });

    it('should display National Domestic Abuse Helpline', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('National Domestic Abuse Helpline');
      expect(response.text).toContain('0808 2000 247');
    });

    it('should display Women\'s Aid link', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Women\'s Aid');
      expect(response.text).toContain('https://www.womensaid.org.uk/');
    });

    it('should display Men\'s Advice Line', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Men\'s Advice Line');
      expect(response.text).toContain('0808 801 0327');
    });

    it('should explain legal protections including non-molestation orders', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Non-molestation order');
      expect(response.text).toContain('Occupation order');
      expect(response.text).toContain('Legal protection');
    });

    it('should explain why mediation may not be suitable', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('mediation may not be right for you');
      expect(response.text).toContain('imbalance of power');
    });

    it('should provide link to court option', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain(paths.COURT);
      expect(response.text).toContain('Apply to court');
    });

    it('should acknowledge disclosure sensitively', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Thank you for sharing this information');
      expect(response.text).toContain('may have been difficult');
    });
  });
});
