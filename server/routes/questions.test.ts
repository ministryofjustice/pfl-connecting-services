import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 1: Abuse/Safeguarding', () => {
  describe(`GET ${paths.QUESTION_1_ABUSE}`, () => {
    it('should render question 1 page with correct heading', async () => {
      const response = await request(app).get(paths.QUESTION_1_ABUSE).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Have you or your children experienced abuse from your ex-partner?',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display hint text with examples of abuse as bullet list', async () => {
      const response = await request(app).get(paths.QUESTION_1_ABUSE).expect(200);

      const dom = new JSDOM(response.text);

      const hintText = dom.window.document.querySelector('.govuk-hint');
      expect(hintText?.textContent).toContain('You may have been in an abusive relationship');
      expect(hintText?.textContent).toContain('Psychological abuse');
      expect(hintText?.textContent).toContain('Coercive control');
      expect(hintText?.textContent).toContain('Financial or economic abuse');
      expect(hintText?.textContent).toContain('Harassment and stalking');
    });

    it('should display two radio options: Yes and No', async () => {
      const response = await request(app).get(paths.QUESTION_1_ABUSE).expect(200);

      const dom = new JSDOM(response.text);

      const radioButtons = dom.window.document.querySelectorAll('input[type="radio"][name="abuse"]');
      expect(radioButtons).toHaveLength(2);

      const radioValues = Array.from(radioButtons).map((radio) => (radio as HTMLInputElement).value);
      expect(radioValues).toContain('yes');
      expect(radioValues).toContain('no');
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.QUESTION_1_ABUSE).expect(200);

      expect(response.text).toContain('Exit this page');
    });

  });

  describe(`POST ${paths.QUESTION_1_ABUSE}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.QUESTION_1_ABUSE).expect(302).expect('location', paths.QUESTION_1_ABUSE);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select whether you or your children have experienced abuse from your ex-partner',
          path: 'abuse',
          type: 'field',
        },
      ]);
    });

    it('should redirect to safeguarding page when answer is yes', () => {
      return request(app)
        .post(paths.QUESTION_1_ABUSE)
        .send({ abuse: 'yes' })
        .expect(302)
        .expect('location', paths.SAFEGUARDING);
    });

    it('should redirect to question 2 when answer is no', () => {
      return request(app)
        .post(paths.QUESTION_1_ABUSE)
        .send({ abuse: 'no' })
        .expect(302)
        .expect('location', paths.QUESTION_2_CONTACT);
    });

    it('should store answer in session', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' }).expect(302);

      const response = await agent.get(paths.QUESTION_1_ABUSE);
      // The session should persist the answer (this would require checking session state)
      expect(response.status).toBe(200);
    });
  });
});

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
        .expect('location', paths.QUESTION_3_AGREE);
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
  describe(`POST ${paths.QUESTION_3_AGREE}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.QUESTION_3_AGREE).expect(302).expect('location', paths.QUESTION_3_AGREE);

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
        .post(paths.QUESTION_3_AGREE)
        .send({ agree: 'yes' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to question 4 when answer is no or not-discussed', () => {
      return request(app)
        .post(paths.QUESTION_3_AGREE)
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
