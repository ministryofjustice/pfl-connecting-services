import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Parenting Plan', () => {
  describe(`GET ${paths.PARENTING_PLAN}`, () => {
    it('should render parenting plan page with correct heading', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Explore: Making a parenting plan',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display "Why this could be right for you" section', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Why this could be right for you');
      expect(response.text).toContain('You do not have to do any official paperwork');
      expect(response.text).toContain('parenting plan');
    });

    it('should display "Important things to consider" section', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Important things to consider');
      expect(response.text).toContain('No court:');
      expect(response.text).toContain('No cost:');
      expect(response.text).toContain('Easy to review and change:');
      expect(response.text).toContain('Make it legally binding:');
    });

    it('should display "Next step: Make a plan" section', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Next step: Make a plan');
      expect(response.text).toContain('Propose a child arrangements plan');
      expect(response.text).toContain('where your children will live');
      expect(response.text).toContain('when they spend time with each parent');
      expect(response.text).toContain('handovers, holidays');
    });

    it('should display "Other ways to agree" section with mediation', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Other ways to agree without going to court');
      expect(response.text).toContain('Mediation');
    });

    it('should display mediation inset text about voucher scheme', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const insetText = dom.window.document.querySelector('.govuk-inset-text');

      expect(insetText).toHaveTextContent('voucher worth up to £500');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const table = dom.window.document.querySelector('.govuk-table');

      expect(table).toHaveTextContent('Advice Now');
      expect(table).toHaveTextContent('Children and Family Court Advisory and Support Service (Cafcass)');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const relatedContent = dom.window.document.querySelector('.govuk-prototype-kit-common-templates-related-items');

      expect(relatedContent).toHaveTextContent('Related content');
      expect(relatedContent).toHaveTextContent('Making child arrangements if you divorce or separate');
      expect(relatedContent).toHaveTextContent('Propose a child arrangements plan');
      expect(relatedContent).toHaveTextContent('Child maintenance');
      expect(relatedContent).toHaveTextContent('Parental rights and responsibilities');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const button = dom.window.document.querySelector('#print-this-page-button');

      expect(button).toHaveTextContent('Print this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent('Explore: Making a parenting plan');
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });
  });
});
