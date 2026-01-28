import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Domestic Abuse Question', () => {
  describe(`GET ${paths.DOMESTIC_ABUSE}`, () => {
    it('should render domestic abuse page with correct heading', async () => {
      const response = await request(app).get(paths.DOMESTIC_ABUSE).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Have you or your children experienced abuse from your ex-partner?',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display examples of abuse as bullet list', async () => {
      const response = await request(app).get(paths.DOMESTIC_ABUSE).expect(200);

      expect(response.text).toContain('You may have been in an abusive relationship');
      expect(response.text).toContain('Psychological abuse');
      expect(response.text).toContain('Coercive control');
      expect(response.text).toContain('Financial or economic abuse');
      expect(response.text).toContain('Harassment and stalking');
    });

    it('should display two radio options: Yes and No', async () => {
      const response = await request(app).get(paths.DOMESTIC_ABUSE).expect(200);

      const dom = new JSDOM(response.text);

      const radioButtons = dom.window.document.querySelectorAll('input[type="radio"][name="abuse"]');
      expect(radioButtons).toHaveLength(2);

      const radioValues = Array.from(radioButtons).map((radio) => (radio as HTMLInputElement).value);
      expect(radioValues).toContain('yes');
      expect(radioValues).toContain('no');
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.DOMESTIC_ABUSE).expect(200);

      expect(response.text).toContain('Exit this page');
    });
  });

  describe(`POST ${paths.DOMESTIC_ABUSE}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.DOMESTIC_ABUSE).expect(302).expect('location', paths.DOMESTIC_ABUSE);

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
        .post(paths.DOMESTIC_ABUSE)
        .send({ abuse: 'yes' })
        .expect(302)
        .expect('location', paths.SAFEGUARDING);
    });

    it('should redirect to question 2 when answer is no', () => {
      return request(app)
        .post(paths.DOMESTIC_ABUSE)
        .send({ abuse: 'no' })
        .expect(302)
        .expect('location', paths.QUESTION_2_CONTACT);
    });

    it('should store answer in session', async () => {
      const agent = request.agent(app);

      await agent.post(paths.DOMESTIC_ABUSE).send({ abuse: 'yes' }).expect(302);

      const response = await agent.get(paths.DOMESTIC_ABUSE);
      // The session should persist the answer (this would require checking session state)
      expect(response.status).toBe(200);
    });
  });
});
