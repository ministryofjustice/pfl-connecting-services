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

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Getting help if you have experienced abuse');
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
      expect(response.text).toContain('You may have been in an abusive relationship');
      expect(response.text).toContain('If you have experienced any kind of domestic abuse');
    });

    it('should display National Domestic Abuse Helpline in table', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain("Refuge National Domestic Abuse Helpline");
      expect(response.text).toContain('0808 2000 247');
      expect(response.text).toContain('Free, confidential advice, 24 hours a day');
    });

    it('should display Live Fear Free Wales helpline in table', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Rights of Women');
      expect(response.text).toContain('020 7251 6577');
    });

    it('should display help and support section title and description', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain('Help and support');
      expect(response.text).toContain('There is free, confidential support available to help you and your family.');
    });

    it('should display back link to domestic abuse page', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).not.toBeNull();
      expect(backLink?.getAttribute('href')).toBe(paths.DOMESTIC_ABUSE);
    });

    it('should display Continue button with primary styling', async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);
      const dom = new JSDOM(response.text);
      const continueButton = dom.window.document.querySelector('a.govuk-button');

      expect(continueButton).not.toBeNull();
      expect(continueButton?.getAttribute('class')).toContain('govuk-button--primary');
      expect(continueButton?.getAttribute('class')).toContain('govuk-!-margin-bottom-4');
      expect(continueButton?.getAttribute('href')).toBe(paths.CONTACT_CHILD_ARRANGEMENTS);
    });

    it("should display Men's Advice Line in table", async () => {
      const response = await request(app).get(paths.SAFEGUARDING).expect(200);

      expect(response.text).toContain("Men's Advice Line");
      expect(response.text).toContain('0808 801 0327');
    });
  });
});
