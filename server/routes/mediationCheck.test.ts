import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 5: Mediation', () => {
  describe(`POST ${paths.MEDIATION_CHECK}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.MEDIATION_CHECK).expect(302).expect('location', paths.MEDIATION_CHECK);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select whether you have tried any of these in the last 6 months',
          path: 'mediation',
          type: 'field',
        },
      ]);
    });

    it('should redirect to court page when answer is yes', () => {
      return request(app)
        .post(paths.MEDIATION_CHECK)
        .send({ mediation: 'yes' })
        .expect(302)
        .expect('location', paths.COURT_ORDER);
    });

    it('should redirect to mediation page when answer is no', () => {
      return request(app)
        .post(paths.MEDIATION_CHECK)
        .send({ mediation: 'no' })
        .expect(302)
        .expect('location', paths.MEDIATION);
    });
  });
});
