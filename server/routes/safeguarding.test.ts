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

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Getting help');
      expect(response.status).toBe(200);
    });

    it('should display Exit This Page button', async () => {
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

    it('should display introductory text about abuse', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('You may have been in an abusive relationship');
      expect(response.text).toContain('Domestic abuse or violence is a crime');
    });

    it('should display Continue button linking to question 2', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      const dom = new JSDOM(response.text);
      const continueButton = dom.window.document.querySelector('a.govuk-button');

      expect(continueButton).not.toBeNull();
      expect(continueButton?.getAttribute('href')).toBe(paths.CONTACT_CHILD_ARRANGEMENTS);
      expect(continueButton?.textContent).toContain('Continue');
    });

    it('should display section on protecting yourself and children', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Get help protecting yourself and your children');
      expect(response.text).toContain('apply for a court order to protect yourself and your child');
    });

    it('should display Citizens Advice link', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Citizens Advice');
      expect(response.text).toContain('advice on making child arrangements');
    });

    it('should display link to domestic abuse help', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('how to get help with domestic abuse');
      expect(response.text).toContain('domestic-abuse-how-to-get-help');
    });

    it('should display specialist support link', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Domestic abuse: specialist sources of support');
    });

    it('should display service-finder link', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('find more child arrangement support services');
      expect(response.text).toContain('/service-finder');
    });

    it('should display National Domestic Abuse Helpline in table', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain("Refuge's National Domestic Abuse Helpline");
      expect(response.text).toContain('0808 2000 247');
      expect(response.text).toContain('Free, confidential advice, 24 hours a day');
    });

    it('should display Live Fear Free Wales helpline in table', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Live Fear Free (Wales)');
      expect(response.text).toContain('0808 80 10 100');
    });

    it("should display Men's Advice Line in table", async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain("Men's Advice Line");
      expect(response.text).toContain('0808 801 0327');
    });

    it('should have horizontal rule separator after continue button', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      const dom = new JSDOM(response.text);
      const hr = dom.window.document.querySelector('hr.govuk-section-break--visible');

      expect(hr).not.toBeNull();
    });

    it('should have table with thead element', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      const dom = new JSDOM(response.text);
      const thead = dom.window.document.querySelector('table.govuk-table thead');

      expect(thead).not.toBeNull();
    });
  });
});
