import { JSDOM } from 'jsdom';
import request from 'supertest';

import config from './config';
import paths from './constants/paths';
import testAppSetup from './test-utils/testAppSetup';
import { sessionMock } from './test-utils/testMocks';

const getServiceNavigationLink = (dom: JSDOM) => dom.window.document.querySelector('.govuk-service-navigation__link');

const getBackLink = (dom: JSDOM) => dom.window.document.querySelector('.govuk-back-link');

describe('Service URLs', () => {
  beforeEach(() => {
    config.includeWelshLanguage = true;
  });

  describe('config.serviceUrl', () => {
    it('should return the English service URL for the en locale', () => {
      expect(config.serviceUrl('en')).toBe(process.env.SERVICE_URL);
    });

    it('should return the Welsh service URL for the cy locale', () => {
      expect(config.serviceUrl('cy')).toBe(process.env.SERVICE_URL_WELSH);
    });
  });

  describe('layout pages', () => {
    it('should use the English service URL in the service navigation and back link when the locale is English', async () => {
      const response = await request(testAppSetup()).get(`${paths.CHILD_SAFETY}?lang=en`).expect(200);
      const dom = new JSDOM(response.text);

      expect(getServiceNavigationLink(dom)).toHaveAttribute('href', config.serviceUrl('en'));
      expect(getBackLink(dom)).toHaveAttribute('href', config.serviceUrl('en'));
    });

    it('should use the Welsh service URL in the service navigation and back link when the locale is Welsh', async () => {
      const response = await request(testAppSetup()).get(`${paths.CHILD_SAFETY}?lang=cy`).expect(200);
      const dom = new JSDOM(response.text);

      expect(getServiceNavigationLink(dom)).toHaveAttribute('href', config.serviceUrl('cy'));
      expect(getBackLink(dom)).toHaveAttribute('href', config.serviceUrl('cy'));
    });
  });

  describe('static pages', () => {
    it('should use the Welsh service URL in the back link when the locale is Welsh', async () => {
      delete sessionMock.pageHistory;
      delete sessionMock.previousPage;

      const response = await request(testAppSetup()).get(`${paths.COOKIES}?lang=cy`).expect(200);
      const dom = new JSDOM(response.text);

      expect(getBackLink(dom)).toHaveAttribute('href', config.serviceUrl('cy'));
    });
  });
});
