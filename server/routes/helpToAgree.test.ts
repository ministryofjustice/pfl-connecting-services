import { JSDOM } from 'jsdom';
import request from 'supertest';

import { HELP } from '../constants/formFields';
import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock, flashMockErrors } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 4: Help to Agree', () => {
  describe(`GET ${paths.HELP_TO_AGREE}`, () => {
    it('should render help to agree page with correct heading', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect('Content-Type', /html/);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent(
        'What would help you both agree on child arrangements?',
      );
      expect(dom.window.document.querySelector('h2.govuk-error-summary__title')).toBeNull();
    });

    it('should display error summary with correct error message when validation fails', async () => {
      flashMockErrors.push({
        type: 'field',
        location: 'body',
        path: HELP,
        value: '',
        msg: 'Select what would help you and your ex-partner to agree on child arrangements',
      });

      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);
      const dom = new JSDOM(response.text);

      const errorSummary = dom.window.document.querySelector('.govuk-error-summary');
      expect(errorSummary).not.toBeNull();

      const errorTitle = dom.window.document.querySelector('.govuk-error-summary__title');
      expect(errorTitle).toHaveTextContent('There is a problem');

      const errorLink = dom.window.document.querySelector('.govuk-error-summary__list a');
      expect(errorLink).toHaveTextContent('Select what would help you and your ex-partner to agree on child arrangements');
    });

    it('should have error link that jumps to the form field (per GOV.UK Design System)', async () => {
      flashMockErrors.push({
        type: 'field',
        location: 'body',
        path: HELP,
        value: '',
        msg: 'Select what would help you and your ex-partner to agree on child arrangements',
      });

      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);
      const dom = new JSDOM(response.text);

      const errorLink = dom.window.document.querySelector('.govuk-error-summary__list a') as HTMLAnchorElement;
      // Per GOV.UK Design System, error link should jump to the form field (the first radio input)
      expect(errorLink?.getAttribute('href')).toBe('#help');
    });

    it('should display three radio options', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);

      const dom = new JSDOM(response.text);

      const radioButtons = dom.window.document.querySelectorAll('input[type="radio"][name="help"]');
      expect(radioButtons).toHaveLength(3);

      const radioValues = Array.from(radioButtons).map((radio) => (radio as HTMLInputElement).value);
      expect(radioValues).toContain('plan');
      expect(radioValues).toContain('external');
      expect(radioValues).toContain('cannot');
    });

    it('should display correct radio option labels', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);

      expect(response.text).toContain('A plan we can follow ourselves');
      expect(response.text).toContain('Someone else to guide our conversations');
      expect(response.text).toContain('We cannot agree – someone else needs to make a decision for us');
    });

    it('should display Exit This Page button', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);

      expect(response.text).toContain('Exit this page');
    });
  });

  describe(`POST ${paths.HELP_TO_AGREE}`, () => {
    it('should reload page and set flash error when no option selected', async () => {
      await request(app).post(paths.HELP_TO_AGREE).expect(302).expect('location', paths.HELP_TO_AGREE);

      expect(flashMock).toHaveBeenCalledWith('errors', [
        {
          location: 'body',
          msg: 'Select what would help you and your ex-partner to agree on child arrangements',
          path: 'help',
          type: 'field',
        },
      ]);
    });

    it('should redirect to parenting plan page when answer is plan', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ help: 'plan' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to court page when answer is cannot', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ help: 'cannot' })
        .expect(302)
        .expect('location', paths.COURT_ORDER);
    });

    it('should redirect to other options page when answer is external', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ help: 'external' })
        .expect(302)
        .expect('location', paths.OTHER_OPTIONS);
    });
  });
});
