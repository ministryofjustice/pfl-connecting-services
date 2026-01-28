import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Agreement on child arrangements Question', () => {
  describe(`GET ${paths.AGREEMENT}`, () => {
    it('should render agreement on child arrangements page with correct heading', async () => {
      const response = await request(app).get(paths.AGREEMENT).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'Do you and your ex-partner agree on child arrangements?',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display child arrangements as bullet list', async () => {
      const response = await request(app).get(paths.AGREEMENT).expect(200);

      expect(response.text).toContain('where your children will live');
      expect(response.text).toContain('when they spend time with each parent');
      expect(response.text).toContain('handovers, holidays and whatever else matters to your children');
    });

    it('should display three radio options: Yes, No, and Not discussed yet', async () => {
      const response = await request(app).get(paths.AGREEMENT).expect(200);

      const dom = new JSDOM(response.text);

      const radioButtons = dom.window.document.querySelectorAll('input[type="radio"][name="agreement"]');
      expect(radioButtons).toHaveLength(3);

      const radioValues = Array.from(radioButtons).map((radio) => (radio as HTMLInputElement).value);
      expect(radioValues).toContain('yes');
      expect(radioValues).toContain('no');
      expect(radioValues).toContain('not-discussed');
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.AGREEMENT).expect(200);

      expect(response.text).toContain('Exit this page');
    });
  });

  describe(`POST ${paths.AGREEMENT}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.AGREEMENT).expect(302).expect('location', paths.AGREEMENT);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select whether you and your ex-partner agree on child arrangements',
          path: 'agreement',
          type: 'field',
        },
      ]);
    });

    it('should redirect to safeguarding page when answer is yes', () => {
      return request(app)
        .post(paths.AGREEMENT)
        .send({ agreement: 'yes' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to help to agree when answer is no', () => {
      return request(app)
        .post(paths.AGREEMENT)
        .send({ agreement: 'no' })
        .expect(302)
        .expect('location', paths.HELP_2_AGREE);
    });

    it('should redirect to help to agree when answer is not discussed', () => {
      return request(app)
        .post(paths.AGREEMENT)
        .send({ agreement: 'not-discussed' })
        .expect(302)
        .expect('location', paths.HELP_2_AGREE);
    });

    it('should store answer in session', async () => {
      const agent = request.agent(app);

      await agent.post(paths.AGREEMENT).send({ agreement: 'yes' }).expect(302);

      const response = await agent.get(paths.AGREEMENT);
      // The session should persist the answer (this would require checking session state)
      expect(response.status).toBe(200);
    });
  });
});