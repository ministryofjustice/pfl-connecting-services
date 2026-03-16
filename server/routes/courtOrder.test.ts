import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Court Order', () => {
  describe(`GET ${paths.COURT_ORDER}`, () => {
    it('should render court order page with correct heading', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Explore: Applying for a court order',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display "Why this could be right for you" section with reasons', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('ul');

      expect(list).toHaveTextContent('you cannot agree after');
      expect(list).toHaveTextContent('domestic abuse or you or the children are at risk');
      expect(list).toHaveTextContent('cannot contact your ex-partner');
      expect(list).toHaveTextContent('consent order');
    });

    it('should display order types list', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelectorAll('ul');

      // Second list contains order types
      expect(list[3]).toHaveTextContent('Child arrangements order');
      expect(list[3]).toHaveTextContent('Specific issue order');
      expect(list[3]).toHaveTextContent('Prohibited steps order');
    });

    it('should display "Important things to consider" section', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);

      expect(response.text).toContain('Important things to consider');
      expect(response.text).toContain('Mediation Information and Assessment Meeting (MIAM):');
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
      const dom = new JSDOM(response.text);
      const insetText = dom.window.document.querySelector('.govuk-inset-text');

      expect(insetText).toHaveTextContent('voucher worth up to £500');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const dom = new JSDOM(response.text);
      const summaryList = dom.window.document.querySelector('.govuk-summary-list');

      expect(summaryList).toHaveTextContent('Advicenow');
      expect(summaryList).toHaveTextContent('Children and Family Court Advisory and Support Service (Cafcass)');
      expect(summaryList).toHaveTextContent('LawWorks');
      expect(summaryList).toHaveTextContent('National Association of Child Contact Centres (NACCC)');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.COURT_ORDER).expect(200);
      const dom = new JSDOM(response.text);
      const relatedContent = dom.window.document.querySelector('.govuk-prototype-kit-common-templates-related-items');

      expect(relatedContent).toHaveTextContent('Related content');
      expect(relatedContent).toHaveTextContent('Making child arrangements if you divorce or separate');
      expect(relatedContent).toHaveTextContent('Apply for a court order');
      expect(relatedContent).toHaveTextContent('Parental rights and responsibilities');
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
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent('Explore: Applying for a court order');
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });
  });
});
