import request from 'supertest';

import config from '../config';
import { ACCEPT_OPTIONAL_COOKIES } from '../constants/formFields';
import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe(paths.COOKIES, () => {
  describe('GET', () => {
    it('should render cookies page when there is no ga4 id', async () => {
      config.analytics.ga4Id = undefined;

      const response = await request(app).get(paths.COOKIES).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain('Cookies');
      expect(html).not.toContain('fieldset');
    });

    it('should render cookies page when there is a ga4 id', async () => {
      config.analytics.enabled = true; // Enable analytics for this test
      config.analytics.ga4Id = 'test-ga4-id';

      const response = await request(app).get(paths.COOKIES).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain('Cookies');
      expect(html).toContain('fieldset');
    });

    it('should render OpenSearch analytics survey details when there is a ga4 id', async () => {
      const response = await request(app).get(paths.COOKIES).expect('Content-Type', /html/);
      const html = response.text;

      expect(html).toContain('Surveys (optional)');
      expect(response.text).toContain('govuk_taken[NameOfSurvey]');
      expect(response.text).toContain('govuk_surveySeen[NameOfSurvey]');
      expect(response.text).toContain('https://www.smartsurvey.co.uk/company/how-we-use-cookies');
    });
  });

  describe('POST', () => {
    it('should reload page and set cookies when the response is Yes', async () => {
      config.analytics.ga4Id = 'test-ga4-id';
      await request(app)
        .post(paths.COOKIES)
        .send({ [ACCEPT_OPTIONAL_COOKIES]: 'Yes' })
        .expect(302)
        .expect('location', paths.COOKIES)
        .expect((response) => {
          expect(response.header['set-cookie']).toEqual([
            `cookie_policy=${encodeURIComponent(JSON.stringify({ acceptAnalytics: 'Yes' }))}; Max-Age=31536000; Path=/; Expires=Thu, 01 Jan 2026 00:00:00 GMT; SameSite=Lax`,
          ]);
        });
    });

    it('should reload page and set cookies when the response is No', async () => {
      config.analytics.ga4Id = 'test-ga4-id';
      await request(app)
        .post(paths.COOKIES)
        .send({ [ACCEPT_OPTIONAL_COOKIES]: 'No' })
        .expect(302)
        .expect('location', paths.COOKIES)
        .expect((response) => {
          expect(response.header['set-cookie']).toEqual([
            `cookie_policy=${encodeURIComponent(JSON.stringify({ acceptAnalytics: 'No' }))}; Max-Age=31536000; Path=/; Expires=Thu, 01 Jan 2026 00:00:00 GMT; SameSite=Lax`,
            '_ga=; Domain=127.0.0.1; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
            `_ga_${config.analytics.ga4Id}=; Domain=127.0.0.1; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
          ]);
        });
    });

    it('should set secure cookie when useHttps is enabled', async () => {
      config.analytics.ga4Id = 'test-ga4-id';
      config.useHttps = true;

      await request(app)
        .post(paths.COOKIES)
        .send({ [ACCEPT_OPTIONAL_COOKIES]: 'Yes' })
        .expect((response) => {
          const cookieHeader = response.header['set-cookie'][0];
          expect(cookieHeader).toContain('Secure');
        });

      config.useHttps = false;
    });

    it('should not clear analytics cookies when accepting analytics', async () => {
      config.analytics.ga4Id = 'test-ga4-id';

      await request(app)
        .post(paths.COOKIES)
        .send({ [ACCEPT_OPTIONAL_COOKIES]: 'Yes' })
        .expect((response) => {
          const cookieHeader = response.header['set-cookie'][0];
          expect(cookieHeader).not.toContain('_ga=');
        });
    });

    it('should include back link in page content', async () => {
      const response = await request(app).get(paths.COOKIES).expect('Content-Type', /html/);

      const html = response.text;
      expect(html).toContain('class="govuk-back-link"');
      expect(html).toContain(`href="${config.serviceUrl}"`);
    });
  });
});
