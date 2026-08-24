import { JSDOM } from 'jsdom';
import request from 'supertest';

import config from './config';
import paths from './constants/paths';
import testAppSetup from './test-utils/testAppSetup';

const getPhaseBannerFeedbackLink = (dom: JSDOM) => {
  const phaseBanner = dom.window.document.querySelector('.govuk-phase-banner');

  return phaseBanner?.querySelector('a.govuk-link');
};

const getFooterFeedbackLink = (dom: JSDOM) => {
  const footer = dom.window.document.querySelector('.govuk-footer');
  const links = footer?.querySelectorAll('a.govuk-footer__link');

  return Array.from(links ?? []).find((link) => /^(Feedback|Adborth)$/i.test(link.textContent?.trim() ?? ''));
};

describe('Feedback URLs', () => {
  beforeEach(() => {
    config.includeWelshLanguage = true;
  });

  describe('start page footer', () => {
    it('should use the English feedback URL when the locale is English', async () => {
      const response = await request(testAppSetup()).get(`${paths.START}?lang=en`).expect(200);
      const dom = new JSDOM(response.text);
      const feedbackLink = getFooterFeedbackLink(dom);

      expect(feedbackLink).not.toBeNull();
      expect(feedbackLink).toHaveAttribute('href', config.feedbackUrl);
    });

    it('should use the Welsh feedback URL when the locale is Welsh', async () => {
      const response = await request(testAppSetup()).get(`${paths.START}?lang=cy`).expect(200);
      const dom = new JSDOM(response.text);
      const feedbackLink = getFooterFeedbackLink(dom);

      expect(feedbackLink).not.toBeNull();
      expect(feedbackLink).toHaveAttribute('href', config.feedbackUrlWelsh);
    });
  });

  describe('layout pages', () => {
    it('should use the English feedback URL in the phase banner and footer when the locale is English', async () => {
      const response = await request(testAppSetup()).get(`${paths.CHILD_SAFETY}?lang=en`).expect(200);
      const dom = new JSDOM(response.text);

      expect(getPhaseBannerFeedbackLink(dom)).toHaveAttribute('href', config.feedbackUrl);
      expect(getFooterFeedbackLink(dom)).toHaveAttribute('href', config.feedbackUrl);
    });

    it('should use the Welsh feedback URL in the phase banner and footer when the locale is Welsh', async () => {
      const response = await request(testAppSetup()).get(`${paths.CHILD_SAFETY}?lang=cy`).expect(200);
      const dom = new JSDOM(response.text);

      expect(getPhaseBannerFeedbackLink(dom)).toHaveAttribute('href', config.feedbackUrlWelsh);
      expect(getFooterFeedbackLink(dom)).toHaveAttribute('href', config.feedbackUrlWelsh);
    });
  });
});
