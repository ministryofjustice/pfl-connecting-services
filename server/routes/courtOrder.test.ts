import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Court Order', () => {
  describe(`GET ${paths.COURT_ORDER}`, () => {
    it('should render court order page with correct heading', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect('Content-Type', /html/);
      const html = response.text;

      expect(html).toContain(
        'Explore: Applying for a court order',
      );
      expect(html).not.toContain('h2.govuk-error-summary__title');
    });

    it('should display "Why this could be right for you" section with reasons', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;
      expect(html).toContain('you cannot agree, even after trying options such as');
      expect(html).toContain('domestic abuse or you or the children are at risk');
      expect(html).toContain('cannot contact your ex-partner');
      expect(html).toContain('consent order');
    });

    it('should display order types list', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;

      expect(html).toContain('Child arrangements order');
      expect(html).toContain('Specific issue order');
      expect(html).toContain('Prohibited steps order');
    });

    it('should display "Important things to consider" section', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);

      expect(response.text).toContain('Important things to consider');
      expect(response.text).toContain('Mediation Information and Assessment Meeting (MIAM):');
      expect(response.text).toContain('Find a mediator who can provide a MIAM on the Family Mediation Council website');
      expect(response.text).toContain('Cost:');
      expect(response.text).toContain('Time:');
    });

    it('should display "Other ways to agree" section with mediation and arbitration', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);

      expect(response.text).toContain('Other ways to agree without going to court');
      expect(response.text).toContain('Mediation');
      expect(response.text).toContain('Other options to explore');
    });

    it('should display mediation inset text about voucher scheme', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;
      expect(html).toContain('voucher worth up to £500');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;
      expect(html).toContain('Advicenow');
      expect(html).toContain('Children and Family Court Advisory and Support Service (Cafcass)');
      expect(html).toContain('LawWorks');
      expect(html).toContain('National Association of Child Contact Centres (NACCC)');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;
      expect(html).toContain('Related content');
      expect(html).toContain('Propose a child arrangements plan');
      expect(html).toContain('Apply for a court order');
      expect(html).toContain('Parental rights and responsibilities');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);

      expect(response.text).toContain('Print this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const html = response.text;
      expect(html).toContain('Explore: Applying for a court order');
      expect(html).toContain('Get help finding a child arrangement option');
      expect(html).toContain('GOV.UK');
    });
  });
});
