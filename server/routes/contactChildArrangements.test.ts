import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 2: Contact', () => {
  describe(`GET ${paths.CONTACT_CHILD_ARRANGEMENTS}`, () => {
    it('should render question 2 page', async () => {
      const response = await request(app).get(paths.CONTACT_CHILD_ARRANGEMENTS).expect('Content-Type', /html/);

      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${paths.CONTACT_CHILD_ARRANGEMENTS}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.CONTACT_CHILD_ARRANGEMENTS).expect(302).expect('location', paths.CONTACT_CHILD_ARRANGEMENTS);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select whether you are comfortable contacting your ex-partner',
          path: 'contact',
          type: 'field',
        },
      ]);
    });

    it('should redirect to question 3 when answer is yes', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contact: 'yes' })
        .expect(302)
        .expect('location', paths.AGREEMENT);
    });

    it('should redirect to court page when answer is no-details', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contact: 'no-details' })
        .expect(302)
        .expect('location', paths.COURT_ORDER);
    });

    it('should redirect to options-no-contact page when answer is no or no-response', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contact: 'no' })
        .expect(302)
        .expect('location', paths.OPTIONS_NO_CONTACT);
    });
  });
});
