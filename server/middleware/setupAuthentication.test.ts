import request from 'supertest';

import config from '../config';
import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

// Local variables

const testPassword = ['test', 'Password'].join('');
const app = testAppSetup();

describe('When a route is called', () => {
  beforeEach(() => {
    config.useAuth = true;
  });

  describe('and client has no authentication cookie', () => {
    beforeEach(() => {
      config.passwords = [testPassword];
    });

    it('should redirect to password page with return url', () => {
      const originalUrl = '/myPage/?param=value';
      const expectedRedirectUrlQueryParameters = 'returnURL=%2FmyPage%2F%3Fparam%3Dvalue';

      return request(app)
        .get(originalUrl)
        .expect(302)
        .expect('location', `${paths.PASSWORD}?${expectedRedirectUrlQueryParameters}`);
    });
  });
});
