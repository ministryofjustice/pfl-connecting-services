import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { sessionMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Parenting Plan', () => {
  beforeEach(() => {
    sessionMock.abuse = undefined;
  });

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
      const dom = new JSDOM(response.text);
      const insetText = dom.window.document.querySelector('.govuk-inset-text');

      expect(insetText).toHaveTextContent('voucher worth up to £500');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const table = dom.window.document.querySelector('.govuk-summary-list');

      expect(table).toHaveTextContent('Advicenow');
      expect(table).toHaveTextContent('Children and Family Court Advisory and Support Service (Cafcass)');
      expect(table).toHaveTextContent('Cafcass Cymru');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const relatedContent = dom.window.document.querySelector('.govuk-grid-column-one-third');

      expect(relatedContent).toHaveTextContent('Related content');
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

    it('should not display warning text when abuse is not set', async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text');

      expect(warningText).toBeNull();
    });

    it('should display warning text when abuse is "yes"', async () => {
      sessionMock.abuse = 'yes';

      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text');

      expect(warningText).not.toBeNull();
      expect(warningText).toHaveTextContent('It may not be appropriate for you to make child arrangements directly');
    });

    it('should not display warning text when abuse is "no"', async () => {
      sessionMock.abuse = 'no';

      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text');

      expect(warningText).toBeNull();
    });
  });

  describe('Related content section hyperlinks', () => {
    let dom: JSDOM;

    beforeEach(async () => {
      const response = await request(app).get(paths.PARENTING_PLAN).expect(200);
      dom = new JSDOM(response.text);
    });

    it('should display making arrangements link with correct URL', async () => {
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/looking-after-children-divorce"]',
      );

      expect(link).not.toBeNull();
      expect(link).toHaveTextContent('Making child arrangements if you divorce or separate');
    });

    it('should display propose a plan link with correct URL', async () => {
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/looking-after-children-divorce/make-child-arrangements-plan"]',
      );

      expect(link).not.toBeNull();
      expect(link).toHaveTextContent('Propose a child arrangements plan');
    });

    it('should display child maintenance link with correct URL', async () => {
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/child-maintenance-service"]',
      );

      expect(link).not.toBeNull();
      expect(link).toHaveTextContent('Child maintenance');
    });

    it('should display parental rights link with correct URL', async () => {
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/parental-rights-responsibilities"]',
      );

      expect(link).not.toBeNull();
      expect(link).toHaveTextContent('Parental rights and responsibilities');
    });

    it('should have all related content links in the correct sidebar', async () => {
      const sidebar = dom.window.document.querySelector('.govuk-grid-column-one-third');
      const links = sidebar.querySelectorAll('a');
      const relatedLinks = Array.from(links).filter(
        (link: HTMLAnchorElement) => 
          link.href === 'https://www.gov.uk/looking-after-children-divorce' ||
          link.href === 'https://www.gov.uk/looking-after-children-divorce/make-child-arrangements-plan' ||
          link.href === 'https://www.gov.uk/child-maintenance-service' ||
          link.href === 'https://www.gov.uk/parental-rights-responsibilities'
      );

      expect(relatedLinks.length).toEqual(4);
    });

    it('should verify all related content links in correct order', async () => {
      const sidebar = dom.window.document.querySelector('.govuk-grid-column-one-third');
      const nav = sidebar.querySelector('nav');
      const listItems = nav.querySelectorAll('ul > li');
      const links = Array.from(listItems).map((li: HTMLLIElement) => ({
        href: li.querySelector('a').href,
        text: li.querySelector('a').textContent.trim(),
      }));

      expect(links[0]).toEqual({
        href: 'https://www.gov.uk/looking-after-children-divorce',
        text: 'Making child arrangements if you divorce or separate',
      });

      expect(links[1]).toEqual({
        href: 'https://www.gov.uk/looking-after-children-divorce/make-child-arrangements-plan',
        text: 'Propose a child arrangements plan',
      });

      expect(links[2]).toEqual({
        href: 'https://www.gov.uk/child-maintenance-service',
        text: 'Child maintenance',
      });

      expect(links[3]).toEqual({
        href: 'https://www.gov.uk/parental-rights-responsibilities',
        text: 'Parental rights and responsibilities',
      });
    });
  });
});
