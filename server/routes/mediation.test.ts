import { JSDOM } from 'jsdom';
import request from 'supertest';

import paths from '../constants/paths';
import testAppSetup from '../test-utils/testAppSetup';

const app = testAppSetup();

describe('Mediation Page', () => {
  describe(`GET ${paths.MEDIATION}`, () => {
    it('should render mediation page', async () => {
      const response = await request(app).get(paths.MEDIATION).expect('Content-Type', /html/);

      expect(response.status).toBe(200);
    });

    it('should show "Explore: Mediation" heading when no abuse disclosed', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);

      const dom = new JSDOM(response.text);

      expect(dom.window.document.querySelector('h1')).toHaveTextContent('Explore: Mediation');
    });

    it('should show "Why this could be right for you" when no abuse disclosed', async () => {
      const response = await request(app).get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('Why this could be right for you');
    });
  });

  describe('when user has disclosed abuse', () => {
    it('should show warning when abuse answer is yes', async () => {
      const agent = request.agent(app);

      // First, set the abuse answer in session via the question route
      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('mediation may not be suitable for you');
      expect(response.text).toContain('Information about mediation');
    });

    it('should explain why mediation is not recommended after abuse disclosure', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('imbalance of power');
      expect(response.text).toContain('pressured to agree');
      expect(response.text).toContain('further risk');
    });

    it('should show MIAM exemption information after abuse disclosure', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('exempt');
      expect(response.text).toContain('MIAM');
    });

    it('should show safer alternatives after abuse disclosure', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('Safer alternatives');
      expect(response.text).toContain('Apply to court');
    });

    it('should still show mediation information but with different heading', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'yes' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).toContain('What is mediation?');
      expect(response.text).toContain('If you still want to know about mediation');
    });
  });

  describe('when user has not disclosed abuse', () => {
    it('should not show abuse warning when answer is no', async () => {
      const agent = request.agent(app);

      await agent.post(paths.QUESTION_1_ABUSE).send({ abuse: 'no' });

      const response = await agent.get(paths.MEDIATION).expect(200);

      expect(response.text).not.toContain('mediation may not be suitable for you');
      expect(response.text).toContain('Why this could be right for you');
    });
  });
});
