import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { sessionMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Parenting Plan', () => {
  beforeEach(() => {
    sessionMock.domesticAbuse = undefined;
  });

  describe(`GET ${paths.PARENTING_PLAN}`, () => {
    it('should render parenting plan page with correct heading', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect('Content-Type', /html/);
      const html = response.text;

      expect(html).toContain(
        'Explore: Making a parenting plan',
      );
      expect(html).not.toContain('h2.govuk-error-summary__title');
    });

    it('should display "Why this could be right for you" section', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Why this could be right for you');
      expect(response.text).toContain('You do not have to go to court or do any official paperwork if you and your ex-partner agree about child arrangements.');
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
      const html = response.text;
      expect(html).toContain('voucher worth up to £500');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).toContain('Advicenow');
      expect(html).toContain('Children and Family Court Advisory and Support Service (Cafcass)');
      expect(html).toContain('Cafcass Cymru');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).toContain('Related content');
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).toContain('Print this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).toContain('Explore: Making a parenting plan');
      expect(html).toContain('Get help finding a child arrangement option');
      expect(html).toContain('GOV.UK');
    });

    it('should not display warning text when abuse is not set', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).not.toContain('govuk-warning-text');
    });

    it('should display warning text when abuse is "yes"', async () => {
      sessionMock.domesticAbuse = 'yes';

      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).toContain('It may not be appropriate for you to make child arrangements directly');
    });

    it('should not display warning text when abuse is "no"', async () => {
      sessionMock.domesticAbuse = 'no';

      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const html = response.text;
      expect(html).not.toContain('govuk-warning-text');
    });
  });

  describe('Related content section hyperlinks', () => {
    let html: string;

    beforeEach(async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      html = response.text;
    });

    it('should display making arrangements link with correct URL', async () => {
      expect(html).toContain('href="https://www.gov.uk/looking-after-children-divorce"');
      expect(html).toContain('Making child arrangements if you divorce or separate');
    });

    it('should display propose a plan link with correct URL', async () => {
      expect(html).toContain('href="https://www.gov.uk/looking-after-children-divorce/make-child-arrangements-plan"');
      expect(html).toContain('Propose a child arrangements plan');
    });

    it('should display child maintenance link with correct URL', async () => {
      expect(html).toContain('href="https://www.gov.uk/child-maintenance-service"');
      expect(html).toContain('Child maintenance');
    });

    it('should display parental rights link with correct URL', async () => {
      expect(html).toContain('href="https://www.gov.uk/parental-rights-responsibilities"');
      expect(html).toContain('Parental rights and responsibilities');
    });

    it('should have all related content links in the correct sidebar', async () => {
      expect(html).toContain('href="https://www.gov.uk/looking-after-children-divorce"');
      expect(html).toContain('href="https://www.gov.uk/looking-after-children-divorce/make-child-arrangements-plan"');
      expect(html).toContain('href="https://www.gov.uk/child-maintenance-service"');
      expect(html).toContain('href="https://www.gov.uk/parental-rights-responsibilities"');
    });

    it('should verify all related content links in correct order', async () => {
      const expectedOrder = [
        'href="https://www.gov.uk/looking-after-children-divorce"',
        'href="https://www.gov.uk/child-maintenance-service"',
        'href="https://www.gov.uk/parental-rights-responsibilities"',
      ];

      const indices = expectedOrder.map((href) => html.indexOf(href));
      expect(indices.every(index => index >= 0)).toBe(true);
      expect(indices[0]).toBeLessThan(indices[1]);
      expect(indices[1]).toBeLessThan(indices[2]);
    });
  });
});
