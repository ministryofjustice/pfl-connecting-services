import { NextFunction, Request, Response } from 'express';
import createError from 'http-errors';

import { CSSession } from '../@types/session';
import TASK_FLOW_MAP from '../config/flowConfig';
import FormSteps from '../constants/formSteps';
import logger from '../logging/logger';
import {
  getFlashMessage,
  getRedirectPath,
  hasCompletedRequiredSteps,
  hasUserStartedJourney,
} from '../utils/formProgressHelpers';

type SessionRequest = Request & { session?: Partial<CSSession> };

/**
 * Middleware factory to check if the user has completed the prerequisites
 * defined in the TASK_FLOW_MAP for the given step key.
 */
function checkFormProgressFromConfig(currentStepKey: FormSteps) {
  const startPage = TASK_FLOW_MAP[FormSteps.START]?.path ?? '/';
  const stepConfig = TASK_FLOW_MAP[currentStepKey];

  if (!stepConfig) {
    logger.error('ERROR: Step not found in TASK_FLOW_MAP: ' + String(currentStepKey));
    throw createError(404);
  }

  const requiredSteps = stepConfig.dependsOn || [];

  return (req: SessionRequest, res: Response, next: NextFunction) => {
    const completedSteps: string[] = req.session?.completedSteps || [];
    const pageHistory: string[] = req.session?.pageHistory || [];

    const hasRequired = hasCompletedRequiredSteps(completedSteps, requiredSteps);

    if (hasRequired) {
      return next();
    }

    // Check if user has even started the journey
    if (!hasUserStartedJourney(completedSteps, pageHistory)) {
      logger.info('Access denied - user has not started journey. Redirecting to ' + startPage);
      return res.redirect(startPage);
    }

    // User has started journey but is missing prerequisites
    const missingSteps = requiredSteps.filter((step) => !completedSteps.includes(step));
    const redirectPath = getRedirectPath(missingSteps, startPage);
    const hasVisitedRedirectPage = pageHistory.includes(redirectPath);

    logger.info('Access denied - missing steps. Redirecting to ' + redirectPath);

    const flashMessage = getFlashMessage(hasVisitedRedirectPage);
    req.flash('info', flashMessage);

    return res.redirect(redirectPath);
  };
}

export default checkFormProgressFromConfig;
