import { JSDOM } from 'jsdom';
import request from 'supertest';

import config from '../config';
import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { sessionMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe(paths.ACCESSIBILITY_STATEMENT, () => {
  beforeEach(() => {
    delete sessionMock.previousPage;
    delete sessionMock.pageHistory;
  });

  describe('GET', () => {
    it('should render accessibility statement page', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Accessibility statement');
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should have correct page title', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);
      const title = dom.window.document.querySelector('title');

      expect(title).toHaveTextContent('Accessibility statement');
      expect(title).toHaveTextContent('Get help finding a child arrangement option');
      expect(title).toHaveTextContent('GOV.UK');
    });

    it('should display intro text about the service', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);

      expect(response.text).toContain('This accessibility statement applies to');
      expect(response.text).toContain('Get help finding a child arrangement option');
      expect(response.text).toContain('This website is run by the Ministry of Justice (MoJ).');
    });

    it('should display ability list items', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('.govuk-list--bullet');

      expect(list).toHaveTextContent('change colours, contrast levels and fonts');
      expect(list).toHaveTextContent('zoom in up to 400% without the text spilling off the screen');
      expect(list).toHaveTextContent('navigate most of the website using a keyboard or speech recognition software');
      expect(list).toHaveTextContent('listen to most of the website using a screen reader');
    });

    it('should display link to AbilityNet', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);

      const abilityNetLink = dom.window.document.querySelector('a[href="https://mcmw.abilitynet.org.uk/"]');

      expect(abilityNetLink).not.toBeNull();
      expect(abilityNetLink).toHaveTextContent('AbilityNet');
    });

    it('should display "Feedback and contact information" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);

      const feedbackHeading = Array.from(dom.window.document.querySelectorAll('h2')).find(
        (heading) => heading.textContent?.trim() === 'Feedback and contact information',
      );

      expect(feedbackHeading).not.toBeNull();
      expect(response.text).toContain('childarrangements@justice.gov.uk');
      expect(dom.window.document.querySelector('a[href="mailto:childarrangements@justice.gov.uk"]')).not.toBeNull();
    });

    it('should display "Enforcement procedure" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);

      expect(response.text).toContain('Enforcement procedure');
      expect(response.text).toContain('Equality and Human Rights Commission (EHRC)');
    });

    it('should display link to EASS', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);

      const eassLink = dom.window.document.querySelector('a[href="https://www.equalityadvisoryservice.com/"]');

      expect(eassLink).not.toBeNull();
      expect(eassLink).toHaveTextContent('Equality Advisory and Support Service (EASS)');
    });

    it('should display "Technical information" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);

      expect(response.text).toContain('Technical information about this website');
      expect(response.text).toContain('The Ministry of Justice (MoJ) is committed to making its website accessible');
    });

    it('should display "Compliance status" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);

      expect(response.text).toContain('Compliance status');
      expect(response.text).toContain(
        'We have tested this service with assistive technologies including screen readers and voice-to-text technology.',
      );
      expect(response.text).toContain('The service has had an external WCAG accessibility audit by User Vision on 5th June.');
      expect(response.text).toContain(
        'The service is fully compliant and meets most of the requirements of the Web Content Accessibility Guidelines (WCAG) 2.2 AA standard.',
      );
    });

    it('should display "Non-accessible content" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);

      const nonAccessibleHeading = Array.from(dom.window.document.querySelectorAll('h2')).find(
        (heading) => heading.textContent?.trim() === 'Non-accessible content',
      );
      const subtitle = Array.from(dom.window.document.querySelectorAll('h3')).find(
        (heading) => heading.textContent?.trim() === 'Non-compliance with current GDS implementation',
      );

      expect(nonAccessibleHeading).not.toBeNull();
      expect(subtitle).not.toBeNull();
      expect(response.text).toContain('Screen reader users may experience the following issues');
      expect(response.text).toContain('This deviates from by GDS approach to use the Shift key');
    });

    it('should display non-accessible content list items', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);
      const list = dom.window.document.querySelector('.govuk-list--number');

      expect(list).toHaveTextContent(
        'The button can be activated by clicking the Escape key three times. As the Escape key is a common shortcut for exiting modals, the button may accidentally be activated.',
      );
    });

    it('should display "Preparation of this accessibility statement" section', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);

      expect(response.text).toContain('Preparation of this accessibility statement');
      expect(response.text).toContain('This statement was prepared on 5 June 2026. It was last reviewed on 17 June 2026.');
      expect(response.text).toContain(
        'This service was last tested in Summer 2026 against the WCAG 2.2 AA standard, by User Vision on 5 June 2026.',
      );
    });

    it('should include back link defaulting to the service URL', async () => {
      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('a.govuk-back-link');

      expect(backLink).not.toBeNull();
      expect(backLink?.getAttribute('href')).toBe(config.serviceUrl);
    });

    it('should use the previous page for the back link when available in session', async () => {
      sessionMock.pageHistory = [paths.COOKIES];

      const response = await request(app).get(paths.ACCESSIBILITY_STATEMENT).expect(200);
      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('a.govuk-back-link');

      expect(backLink?.getAttribute('href')).toBe(paths.COOKIES);
    });
  });
});
