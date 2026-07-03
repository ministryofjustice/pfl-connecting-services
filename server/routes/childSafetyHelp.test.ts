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

      expect(warningText?.textContent).toContain('If a child is in immediate danger, call 999 and ask for the police.');
    });

    it('should display introductory text about help and support', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('help and support available to you');
    });

    it('should display section about continue using this service', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain(
        'If you feel confident that you can carry on without any danger to yourself or the children, you can continue using the service.'
      );
    });

    it('should display Continue button linking to domestic abuse page', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const continueButton = dom.window.document.querySelector('a.govuk-button');

      expect(continueButton).not.toBeNull();
      expect(continueButton?.getAttribute('href')).toBe(paths.DOMESTIC_ABUSE);
      expect(continueButton?.textContent).toContain('Continue');
    });

    it('should display section about get help protecting your children', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('It is important to remember that there is help and support available to you if your children are unsafe.');
      expect(response.text).toContain('If you have experienced any kind of domestic abuse');
      expect(response.text).toContain('You can find out');
    });

    it('should display help and support section title and description', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Help and support');
      expect(response.text).toContain('There is free, confidential support available to help you and your family.');
    });

    it('should display support table headings and data entries', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Refuge National Domestic Abuse Helpline');
      expect(response.text).toContain('0808 2000 247');
      expect(response.text).toContain('Rights of Women');
      expect(response.text).toContain('020 7251 6577');
      expect(response.text).toContain('Reunite International Child Abduction Centre');
      expect(response.text).toContain('0116 2556 234');
    });

    it('should display continue button with primary style', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);
      const dom = new JSDOM(response.text);
      const continueButton = dom.window.document.querySelector('a.govuk-button');

      expect(continueButton).not.toBeNull();
      expect(continueButton?.classList.contains('govuk-button--primary')).toBe(true);
      expect(continueButton?.getAttribute('href')).toBe(paths.DOMESTIC_ABUSE);
    });

    it('should display back link to child safety page', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).not.toBeNull();
      expect(backLink?.getAttribute('href')).toBe(paths.CHILD_SAFETY);
    });
  });
});
