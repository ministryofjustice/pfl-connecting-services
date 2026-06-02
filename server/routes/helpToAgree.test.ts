import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';
import { flashMock, flashMockErrors } from '../test-utils/testMocks';

const app = testAppSetup();

describe('Question 4: Help to Agree', () => {
  describe(`GET ${paths.HELP_TO_AGREE}`, () => {
    it('should render help to agree page with correct heading', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect('Content-Type', /html/);

      const html = response.text;

      expect(html).toContain(
        'What would help you both agree on child arrangements?',
      );
      expect(html).not.toContain('h2.govuk-error-summary__title');
    });

    it('should display error summary with correct error message when validation fails', async () => {
      flashMockErrors.push({
        type: 'field',
        location: 'body',
        path: 'helpToAgree',
        value: '',
        msg: 'Select what would help you and your ex-partner to agree on child arrangements',
      });

      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);
      const html = response.text;

      expect(html).toContain('govuk-error-summary');

      expect(html).toContain('There is a problem');

      expect(html).toContain('Select what would help you and your ex-partner to agree on child arrangements');
    });

    it('should have error link that jumps to the form field (per GOV.UK Design System)', async () => {
      flashMockErrors.push({
        type: 'field',
        location: 'body',
        path: 'helpToAgree',
        value: '',
        msg: 'Select what would help you and your ex-partner to agree on child arrangements',
      });

      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);
      const html = response.text;

      // Per GOV.UK Design System, error link should jump to the form field (the first radio input)
      expect(html).toMatch(/href="#helpToAgree"/);
    });

    it('should display three radio options', async () => {
      const response = await request(app).get(paths.HELP_TO_AGREE).expect(200);

      const html = response.text;

      const radioButtons = response.text.match(/<input[^>]*name="helpToAgree"[^>]*type="radio"[^>]*>/g) || [];
      expect(radioButtons).toHaveLength(3);

      const radioValues = radioButtons.map((input) => input.match(/value=\"([^\"]+)\"/)?.[1]).filter(Boolean) as string[];
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
          path: 'helpToAgree',
          type: 'field',
        },
      ]);
    });

    it('should redirect to parenting plan page when answer is plan', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ helpToAgree: 'plan' })
        .expect(302)
        .expect('location', paths.PARENTING_PLAN);
    });

    it('should redirect to court page when answer is cannot', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ helpToAgree: 'cannot' })
        .expect(302)
        .expect('location', paths.COURT_ORDER);
    });

    it('should redirect to other options page when answer is external', () => {
      return request(app)
        .post(paths.HELP_TO_AGREE)
        .send({ helpToAgree: 'external' })
        .expect(302)
        .expect('location', paths.OTHER_OPTIONS);
    });
  });
});
