import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

const pageTitle = 'Explore: what you can do if you cannot contact the other parent';

describe('No contact guidance', () => {
  describe(`GET ${paths.NO_CONTACT_GUIDANCE}`, () => {
    it('should render options no contact page with correct heading', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(pageTitle);
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display intro content and what the page explains', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('ul.govuk-list--bullet');

      expect(response.text).toContain(
        'If you cannot contact the other parent or they do not respond, there are other ways to get help with arrangements for your child.',
      );
      expect(response.text).toContain('This page explains how you can:');
      expect(list).toHaveTextContent('get help making child arrangements');
      expect(list).toHaveTextContent('get child maintenance');
      expect(list).toHaveTextContent('apply to court if you need the court to make a decision');
    });

    it('should display warning text about contacting the other parent', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const warningText = dom.window.document.querySelector('.govuk-warning-text');

      expect(warningText).not.toBeNull();
      expect(warningText).toHaveTextContent(
        'Do not contact the other parent if doing so could put you or your child at risk or could mean breaking a court order.',
      );
    });

    it('should display make child arrangements section', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const link = dom.window.document.querySelector('a[href="https://www.gov.uk/looking-after-children-divorce"]');

      expect(response.text).toContain('Make child arrangements');
      expect(response.text).toContain(
        'You may still be able to get help making child arrangements if you cannot contact the other parent or they do not respond.',
      );
      expect(response.text).toContain(
        'For example, a legal adviser may be able to contact the other parent on your behalf or advise you about what to do next.',
      );
      expect(link).toHaveTextContent('Find out about making child arrangements');
    });

    it('should display get child maintenance section', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const link = dom.window.document.querySelector('a[href="https://www.gov.uk/child-maintenance-service"]');

      expect(response.text).toContain('Get child maintenance');
      expect(response.text).toContain(
        'You can use the Child Maintenance Service if you cannot agree child maintenance with the other parent.',
      );
      expect(dom.window.document.querySelector('#main-content')).toHaveTextContent(
        "If you do not have all of the other parent's details, the Child Maintenance Service may be able to use information available to government to try to identify and contact them.",
      );
      expect(response.text).toContain(
        'You can also use the Child Maintenance Service if you do not want the other parent to contact you or know your location or personal information.',
      );
      expect(link).toHaveTextContent('Find out about the Child Maintenance Service');
    });

    it('should display apply to court section and what to do before you apply', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const miamLink = dom.window.document.querySelector(
        'a[href="https://apply-to-court-about-child-arrangements.service.justice.gov.uk/about/miam_exemptions"]',
      );
      const parentalResponsibilityLink = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/parental-rights-responsibilities"]',
      );

      expect(response.text).toContain('Apply to court');
      expect(response.text).toContain(
        'You can apply to the family court if you need the court to make a decision about arrangements for your child.',
      );
      expect(response.text).toContain(
        'The type of court order you need depends on what you are asking the court to decide.',
      );
      expect(response.text).toContain('Before you apply to court');
      expect(response.text).toContain(
        'You may need to attend a Mediation Information and Assessment Meeting (MIAM) before you apply.',
      );
      expect(response.text).toContain(
        'If you attend a MIAM but the other parent does not, you can still apply to court.',
      );
      expect(response.text).toContain(
        'Being unable to contact the other parent is not, on its own, a reason not to attend a MIAM.',
      );
      expect(miamLink).toHaveTextContent('Check if you do not need to attend a MIAM');
      expect(response.text).toContain('Find out who has parental responsibility');
      expect(parentalResponsibilityLink).toHaveTextContent('Find out about parental rights and responsibilities');
    });

    it('should display types of court order table', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const table = dom.window.document.querySelectorAll('table.govuk-table')[0];
      const rows = table.querySelectorAll('tbody tr');

      expect(table.querySelector('caption')).toHaveTextContent('Types of court order');
      expect(table).toHaveTextContent('If you need help with');
      expect(table).toHaveTextContent('Court order');
      expect(table).toHaveTextContent('What the court can decide');

      expect(rows).toHaveLength(5);
      expect(rows[0]).toHaveTextContent('Where your child lives or who they spend time with');
      expect(rows[0]).toHaveTextContent('Child arrangements order');
      expect(rows[1]).toHaveTextContent("A decision about your child's education");
      expect(rows[1]).toHaveTextContent('Specific issue order');
      expect(rows[2]).toHaveTextContent('Taking your child abroad');
      expect(rows[3]).toHaveTextContent('Getting a passport for your child');
      expect(rows[4]).toHaveTextContent('Stopping the other parent from doing something');
      expect(rows[4]).toHaveTextContent('Prohibited steps order');

      const courtOrderLink = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/looking-after-children-divorce/apply-for-court-order"]',
      );
      expect(courtOrderLink).toHaveTextContent('Find out about applying for a court order');
    });

    it('should display help and support table with services', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const table = dom.window.document.querySelectorAll('table.govuk-table')[1];

      expect(response.text).toContain('Help and support');
      expect(response.text).toContain('There is free, confidential support available to help you and your family.');
      expect(table).toHaveTextContent('Organisation');
      expect(table).toHaveTextContent('How they can help');
      expect(table).toHaveTextContent('Separated Parenting Programme Directory');
      expect(table).toHaveTextContent('Refuge National Domestic Abuse Helpline');
      expect(table).toHaveTextContent('Rights of Women');
      expect(table).toHaveTextContent("Men's Advice Line");
      expect(table.querySelector('a[href="https://separatedparentingprogrammedirectory.org/"]')).not.toBeNull();
      expect(table.querySelector('a[href="https://www.nationaldahelpline.org.uk/"]')).not.toBeNull();
      expect(table.querySelector('a[href="tel:0808 2000 247"]')).toHaveTextContent('0808 2000 247');
      expect(table.querySelector('a[href="https://www.rightsofwomen.org.uk/get-advice/family-law/"]')).not.toBeNull();
      expect(table.querySelector('a[href="tel:020 7251 6577"]')).toHaveTextContent('020 7251 6577');
      expect(table.querySelector('a[href="https://mensadviceline.org.uk/"]')).not.toBeNull();
      expect(table.querySelector('a[href="tel:0808 801 0327"]')).toHaveTextContent('0808 801 0327');
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const relatedContent = dom.window.document.querySelector('.govuk-grid-column-one-third');
      const links = relatedContent.querySelectorAll('nav ul > li a');

      expect(relatedContent).toHaveTextContent('Related content');
      expect(links).toHaveLength(4);
      expect(links[0]).toHaveTextContent('Propose a child arrangements plan');
      expect(links[0]).toHaveAttribute(
        'href',
        'https://connected-services-prototype.apps.live.cloud-platform.service.justice.gov.uk/public-beta-4/no-contact-guidance#',
      );
      expect(links[1]).toHaveTextContent('Making child arrangements if you divorce or separate');
      expect(links[1]).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');
      expect(links[2]).toHaveTextContent('Apply for a court order');
      expect(links[2]).toHaveAttribute(
        'href',
        'https://www.gov.uk/looking-after-children-divorce/apply-for-court-order',
      );
      expect(links[3]).toHaveTextContent('Parental rights and responsibilities');
      expect(links[3]).toHaveAttribute('href', 'https://www.gov.uk/parental-rights-responsibilities');
    });

    it('should display back to top links', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const backToTopLinks = dom.window.document.querySelectorAll('a[href="#top"]');

      expect(backToTopLinks).toHaveLength(4);
      backToTopLinks.forEach((link) => {
        expect(link).toHaveTextContent('Back to top');
      });
    });

    it('should display back link to contact child arrangements page', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).toHaveTextContent('Back');
      expect(backLink).toHaveAttribute('href', paths.CONTACT_CHILD_ARRANGEMENTS);
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.NO_CONTACT_GUIDANCE).expect(200);
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent(pageTitle);
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });
  });
});
