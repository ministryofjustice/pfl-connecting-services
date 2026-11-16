import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock, sessionMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 2: Contact', () => {
  describe(`GET ${paths.CONTACT_CHILD_ARRANGEMENTS}`, () => {
    it('should render question 2 page', async () => {
      const response = await request(app).get(paths.CONTACT_CHILD_ARRANGEMENTS).expect('Content-Type', /html/);

      expect(response.status).toBe(200);
    });

    it.each(['yes', 'no', 'no-contact'] as const)(
      'should keep the previously selected answer checked when returning to the page',
      async (answer) => {
        sessionMock.contactChildArrangements = answer;

        const response = await request(app).get(paths.CONTACT_CHILD_ARRANGEMENTS).expect(200);
        const dom = new JSDOM(response.text);
        const selected = dom.window.document.querySelector(
          `input[type="radio"][name="contactChildArrangements"][value="${answer}"]`,
        );

        expect(selected).toBeChecked();
      },
    );
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
          msg: 'Select which of these best describes contact with the other parent',
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
