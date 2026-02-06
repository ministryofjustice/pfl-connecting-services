import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 4: Help', () => {
  describe(`POST ${paths.HELP_OPTIONS}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.HELP_OPTIONS).expect(302).expect('location', paths.HELP_OPTIONS);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select an option',
          path: 'help',
          type: 'field',
        },
      ]);
    });

    it('should redirect to parenting plan page when answer is plan', () => {
      return request(app)
        .post(paths.HELP_OPTIONS)
        .send({ help: 'plan' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to court page when answer is cannot', () => {
      return request(app)
        .post(paths.HELP_OPTIONS)
        .send({ help: 'cannot' })
        .expect(302)
        .expect('location', paths.COURT_ORDER);
    });

    it('should redirect to question 5 when answer is external', () => {
      return request(app)
        .post(paths.HELP_OPTIONS)
        .send({ help: 'external' })
        .expect(302)
        .expect('location', paths.OTHER_OPTIONS);
    });
  });
});
