import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Child Safety Question', () => {
  describe(`GET ${paths.CHILD_SAFETY}`, () => {
    it('should render child safety page with correct heading', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Are the children safe?');
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display risk factors as bullet list', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY).expect(200);

      expect(response.text).toContain(
        'any form of domestic abuse or violence, even if the abuse was not directed at the children',
      );
      expect(response.text).toContain('actual or attempted child abduction');
      expect(response.text).toContain('child abuse or neglect');
      expect(response.text).toContain('misuse of drugs, alcohol or other substances');
      expect(response.text).toContain(
        'any other safety or welfare concerns that place anyone at significant risk of harm',
      );
    });

    it('should display two radio options: Yes and No', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY).expect(200);

      const dom = new JSDOM(response.text);

      const radioButtons = dom.window.document.querySelectorAll('input[type="radio"][name="childSafety"]');
      expect(radioButtons).toHaveLength(2);

      const radioValues = Array.from(radioButtons).map((radio) => (radio as HTMLInputElement).value);
      expect(radioValues).toContain('yes');
      expect(radioValues).toContain('no');
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY).expect(200);

      expect(response.text).toContain('Exit this page');
    });

    it('should display back link to start page', async () => {
      const response = await request(app).get(paths.CHILD_SAFETY).expect(200);

      const dom = new JSDOM(response.text);
      const backLink = dom.window.document.querySelector('.govuk-back-link');

      expect(backLink).not.toBeNull();
      expect(backLink?.getAttribute('href')).toBe(paths.START);
    });
  });

  describe(`POST ${paths.CHILD_SAFETY}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.CHILD_SAFETY).expect(302).expect('location', paths.CHILD_SAFETY);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select yes if the children are safe',
          path: 'childSafety',
          type: 'field',
        },
      ]);
    });

    it('should redirect to domestic abuse page when answer is yes (children are safe)', () => {
      return request(app)
        .post(paths.CHILD_SAFETY)
        .send({ childSafety: 'yes' })
        .expect(302)
        .expect('location', paths.DOMESTIC_ABUSE);
    });

    it('should redirect to safeguarding page when answer is no (children not safe)', () => {
      return request(app)
        .post(paths.CHILD_SAFETY)
        .send({ childSafety: 'no' })
        .expect(302)
        .expect('location', paths.SAFEGUARDING);
    });

    it('should store answer in session', async () => {
      const agent = request.agent(app);

      await agent.post(paths.CHILD_SAFETY).send({ childSafety: 'yes' }).expect(302);

      const response = await agent.get(paths.CHILD_SAFETY);
      expect(response.status).toBe(200);
    });
  });
});
