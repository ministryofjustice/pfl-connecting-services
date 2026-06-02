import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Child Safety Help Page', () => {
  describe(`GET ${paths.CHILD_SAFETY_HELP}`, () => {
    it('should render child safety help page with correct heading', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain(
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

      const html = response.text;

      expect(html).toContain('Contact the police');
      expect(html).toContain('immediate danger');
    });

    it('should display introductory text about help and support', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('help and support available to you');
    });

    it('should display section about continue using this service', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('If you want to continue using this service');
      expect(response.text).toContain(
        'If you feel confident that you can carry on without any danger to yourself or the children, you can continue using the service.'
      );
    });

    it('should display Continue button linking to domestic abuse page', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const html = response.text;
      expect(html).toContain('govuk-button');
      expect(html).toContain(`href="${paths.DOMESTIC_ABUSE}"`);
      expect(html).toContain('Continue');
    });

    it('should display section about immediate risk to children', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('If you believe your child could be taken out of the UK without your permission');
    });

    it('should display section about domestic abuse', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('If you or your children have experienced domestic abuse');
      expect(response.text).toContain('apply for a court order to protect yourself and your child');
    });

    it('should display National Domestic Abuse Helpline in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain("Refuge National Domestic Abuse Helpline");
      expect(response.text).toContain('0808 2000 247');
    });

    it('should display Rights of Women helpline in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Rights of Women');
      expect(response.text).toContain('020 7251 6577');
    });

    it('should display Reunite International Child Abduction Centre in table', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      expect(response.text).toContain('Reunite International Child Abduction Centre');
      expect(response.text).toContain('0116 2556 234');
    });

    it('should have horizontal rule separator after continue button', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const html = response.text;
      expect(html).toContain('govuk-section-break--visible');
    });

    it('should display back link', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY_HELP).expect(200);

      const html = response.text;
      expect(html).toContain('class="govuk-back-link"');
    });
  });
});
