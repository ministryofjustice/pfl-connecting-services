import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 2: Contact', () => {
  describe(`GET ${paths.QUESTION_2_CONTACT}`, () => {
    it('should render question 2 page', async () => {
      const response = await request(app).get(paths.QUESTION_2_CONTACT).expect('Content-Type', /html/);

      expect(response.status).toBe(200);
    });
  });

  describe(`POST ${paths.QUESTION_2_CONTACT}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.QUESTION_2_CONTACT).expect(302).expect('location', paths.QUESTION_2_CONTACT);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select an option',
          path: 'contact',
          type: 'field',
        },
      ]);
    });

    it('should redirect to question 3 when answer is yes', () => {
      return request(app)
        .post(paths.QUESTION_2_CONTACT)
        .send({ contact: 'yes' })
        .expect(302)
        .expect('location', paths.AGREEMENT);
    });

    it('should redirect to court page when answer is no-details', () => {
      return request(app)
        .post(paths.QUESTION_2_CONTACT)
        .send({ contact: 'no-details' })
        .expect(302)
        .expect('location', paths.COURT);
    });

    it('should redirect to no-contact page when answer is no or no-response', () => {
      return request(app)
        .post(paths.QUESTION_2_CONTACT)
        .send({ contact: 'no' })
        .expect(302)
        .expect('location', paths.NO_CONTACT);
    });
  });
});

describe('Question 3: Agree', () => {
  describe(`POST ${paths.AGREEMENT}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.AGREEMENT).expect(302).expect('location', paths.AGREEMENT);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select an option',
          path: 'agree',
          type: 'field',
        },
      ]);
    });

    it('should redirect to parenting plan page when answer is yes', () => {
      return request(app)
        .post(paths.AGREEMENT)
        .send({ agree: 'yes' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to question 4 when answer is no or not-discussed', () => {
      return request(app)
        .post(paths.AGREEMENT)
        .send({ agree: 'no' })
        .expect(302)
        .expect('location', paths.QUESTION_4_HELP);
    });
  });
});

describe('Question 4: Help', () => {
  describe(`POST ${paths.QUESTION_4_HELP}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.QUESTION_4_HELP).expect(302).expect('location', paths.QUESTION_4_HELP);

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
        .post(paths.QUESTION_4_HELP)
        .send({ help: 'plan' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to court page when answer is cannot', () => {
      return request(app)
        .post(paths.QUESTION_4_HELP)
        .send({ help: 'cannot' })
        .expect(302)
        .expect('location', paths.COURT);
    });

    it('should redirect to question 5 when answer is external', () => {
      return request(app)
        .post(paths.QUESTION_4_HELP)
        .send({ help: 'external' })
        .expect(302)
        .expect('location', paths.QUESTION_5_MEDIATION);
    });
  });
});

describe('Question 5: Mediation', () => {
  describe(`POST ${paths.QUESTION_5_MEDIATION}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.QUESTION_5_MEDIATION).expect(302).expect('location', paths.QUESTION_5_MEDIATION);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select an option',
          path: 'mediation',
          type: 'field',
        },
      ]);
    });

    it('should redirect to court page when answer is yes', () => {
      return request(app)
        .post(paths.QUESTION_5_MEDIATION)
        .send({ mediation: 'yes' })
        .expect(302)
        .expect('location', paths.COURT);
    });

    it('should redirect to mediation page when answer is no', () => {
      return request(app)
        .post(paths.QUESTION_5_MEDIATION)
        .send({ mediation: 'no' })
        .expect(302)
        .expect('location', paths.MEDIATION);
    });
  });
});
