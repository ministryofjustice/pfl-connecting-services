import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

const pageHeading = 'Options for making arrangements through someone else';

describe('No contact', () => {
  describe(`GET ${paths.NO_CONTACT}`, () => {
    it('should render no contact page with correct heading', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect('Content-Type', /html/);
      const dom = new JSDOM(response.text);

      expect(response.status).toBe(200);
      expect(dom.window.document.querySelector('h1')).toHaveTextContent(pageHeading);
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display intro content about contacting the other parent through someone else', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);

      expect(response.text).toContain(
        'If you cannot contact the other parent directly, there are still ways to make child arrangements without going to court.',
      );
      expect(response.text).toContain(
        'With these options, someone else (such as a mediator or solicitor) can contact them for you.',
      );
    });

    it('should display shuttle mediation section', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const insetText = dom.window.document.querySelector('#cost-inset-shuttle-mediation');
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/looking-after-children-divorce/mediation"]',
      );

      expect(response.text).toContain('Shuttle mediation');
      expect(response.text).toContain('You do not want to have direct contact with your ex-partner.');
      expect(response.text).toContain(
        'Shuttle mediation is where you and your ex-partner both attend a session with a mediator, but sit in different rooms or online meetings so you do not have to have any contact.',
      );
      expect(response.text).toContain(
        'The mediator moves between rooms, listening to you both and helping you come to an agreement about child arrangements.',
      );
      expect(insetText).toHaveTextContent('voucher worth up to £500');
      expect(
        insetText.querySelector('a[href="https://www.gov.uk/guidance/family-mediation-voucher-scheme"]'),
      ).toHaveTextContent('Family Mediation Voucher Scheme');
      expect(link).toHaveTextContent('Find out more about mediation');
    });

    it('should display family solicitor negotiation section', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const mainContent = dom.window.document.querySelector('#main-content');
      const link = dom.window.document.querySelector('a[href="https://solicitors.lawsociety.org.uk/"]');

      expect(mainContent).toHaveTextContent('Family solicitor negotiation');
      expect(mainContent).toHaveTextContent('You cannot contact your ex-partner or they do not reply to you.');
      expect(mainContent).toHaveTextContent(
        "A family solicitor can help you negotiate with your ex-partner without going to court. This is known as 'solicitor negotiation' or 'lawyer negotiation'.",
      );
      expect(mainContent).toHaveTextContent(
        'You do not have to speak to your ex-partner if you choose a solicitor to negotiate for you.',
      );
      expect(link).toHaveTextContent('Find a legal adviser from the Law Society');
    });

    it('should display collaborative law section', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const link = dom.window.document.querySelector(
        'a[href="https://resolution.org.uk/looking-for-help/splitting-up/your-process-options-for-divorce-and-dissolution/the-collaborative-process/"]',
      );

      expect(response.text).toContain('Collaborative law');
      expect(response.text).toContain('You want to focus on collaboration and practicality.');
      expect(response.text).toContain(
        'You and your ex-partner can each hire your own legal advisers to help you negotiate. You then all meet to try and agree on child arrangements.',
      );
      expect(link).toHaveTextContent('Find out more about collaborative law from Resolution');
    });

    it('should display other ways to agree without going to court', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const mainContent = dom.window.document.querySelector('#main-content');
      const link = dom.window.document.querySelector(
        'a[href="https://www.gov.uk/looking-after-children-divorce/non-court-dispute-resolution"]',
      );

      expect(mainContent).toHaveTextContent('Other ways to agree without going to court');
      expect(mainContent).toHaveTextContent(
        "There are other ways to help you make child arrangements outside of court. These are sometimes known as 'non-court dispute resolution' (NCDR) and are usually quicker than going to court.",
      );
      expect(link).toHaveTextContent('Find out more about other ways to agree without going to court');
    });

    it('should display applying for a court order section', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const link = dom.window.document.querySelector(
        'a[href="https://connected-services-prototype.apps.live.cloud-platform.service.justice.gov.uk/public-beta-4/court"]',
      );

      expect(response.text).toContain('Applying for a court order');
      expect(response.text).toContain(
        'Court is the right option for some families. There are different types of court orders you can apply for based on your situation.',
      );
      expect(link).toHaveTextContent('Explore: Applying for a court order');
    });

    it('should display help and support list with services', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const summaryList = dom.window.document.querySelector('.govuk-summary-list');

      expect(response.text).toContain('Help and support');
      expect(response.text).toContain(
        'These are some of the services you may find helpful for making child arrangements.',
      );
      expect(summaryList).toHaveTextContent('Resolution');
      expect(summaryList).toHaveTextContent(
        'Find a law professional - including collaborative practitioners - committed to a non-confrontational approach to help you resolve your family issue.',
      );
      expect(summaryList).toHaveTextContent('Advicenow');
      expect(summaryList).toHaveTextContent(
        'Information on child arrangements from a charity that provides online legal information and support tools for people facing everyday legal issues with limited access to a lawyer.',
      );
      expect(summaryList.querySelector('a[href="https://resolution.org.uk/find-a-law-professional"]')).not.toBeNull();
      expect(
        summaryList.querySelector(
          'a[href="https://www.advicenow.org.uk/get-help/family-and-children/child-arrangements"]',
        ),
      ).not.toBeNull();
    });

    it('should display related content section with correct links', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const relatedContent = dom.window.document.querySelector('.govuk-grid-column-one-third');
      const links = relatedContent.querySelectorAll('nav ul > li a');

      expect(relatedContent).toHaveTextContent('Related content');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('Making child arrangements if you divorce or separate');
      expect(links[0]).toHaveAttribute('href', 'https://www.gov.uk/looking-after-children-divorce');
      expect(links[1]).toHaveTextContent('Family Mediation Voucher Scheme');
      expect(links[1]).toHaveAttribute('href', 'https://www.gov.uk/guidance/family-mediation-voucher-scheme');
    });

    it('should display back link to contact child arrangements page', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).toHaveTextContent('Back');
      expect(backLink).toHaveAttribute('href', paths.CONTACT_CHILD_ARRANGEMENTS);
    });

    it('should display Exit this page button', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display Print this page button', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const button = dom.window.document.querySelector('#print-this-page-button');

      expect(button).toHaveTextContent('Print this page');
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.NO_CONTACT).expect(200);
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent(pageHeading);
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });
  });
});
