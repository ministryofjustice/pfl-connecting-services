import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Child Safety Help Page', () => {
  describe(`GET ${paths.CHILD_SAFETY_HELP}`, () => {
    it('should render child safety help page with correct heading', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Getting help if your children are not safe',
      );
      expect(response.status).toBe(200);
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display warning about contacting police', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text__text');

      expect(warningText?.textContent).toContain('Contact the police');
      expect(warningText?.textContent).toContain('immediate danger');
    });

    it('should display introductory text about help and support', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('help and support available to you');
    });

    it('should display Continue button linking to domestic abuse page', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const continueButton = dom.window.document.querySelector('a.govuk-button');

      expect(continueButton).not.toBeNull();
      expect(continueButton?.getAttribute('href')).toBe(paths.DOMESTIC_ABUSE);
      expect(continueButton?.textContent).toContain('Continue');
    });

    it('should display section about immediate risk to children', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('If there is an immediate risk to your children');
      expect(response.text).toContain('apply for an urgent court hearing about child arrangements');
    });

    it('should display section about domestic abuse', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('If you or your children have experienced domestic abuse');
      expect(response.text).toContain('apply for a court order to protect yourself and your child');
    });

    it('should display National Domestic Abuse Helpline in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain("Refuge's National Domestic Abuse Helpline");
      expect(response.text).toContain('0808 2000 247');
    });

    it('should display Live Fear Free Wales helpline in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Live Fear Free (Wales)');
      expect(response.text).toContain('0808 80 10 100');
    });

    it('should display Reunite International Child Abduction Centre in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Reunite International Child Abduction Centre');
      expect(response.text).toContain('0116 2556 234');
    });

    it('should have horizontal rule separator after continue button', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const hr = dom.window.document.querySelector('hr.govuk-section-break--visible');

      expect(hr).not.toBeNull();
    });

    it('should display back link', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).not.toBeNull();
    });
  });
});
