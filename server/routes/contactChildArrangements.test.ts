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
      await request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .expect(302)
        .expect('location', paths.CONTACT_CHILD_ARRANGEMENTS);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select whether you are comfortable contacting your ex-partner',
          path: 'contactChildArrangements',
          type: 'field',
        },
      ]);
    });

    it('should redirect to question 3 when answer is yes', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contactChildArrangements: 'yes' })
        .expect(302)
        .expect('location', paths.AGREEMENT);
    });

    it('should redirect to no contact page when answer is no', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contactChildArrangements: 'no' })
        .expect(302)
        .expect('location', paths.NO_CONTACT);
    });

    it('should redirect to no contact guidance page when answer is no-contact', () => {
      return request(app)
        .post(paths.CONTACT_CHILD_ARRANGEMENTS)
        .send({ contactChildArrangements: 'no-contact' })
        .expect(302)
        .expect('location', paths.NO_CONTACT_GUIDANCE);
    });
  });
});
