import 'express-session';

export interface CSSession {
  // Question answers
  abuse?: 'yes' | 'no';
  contact?: 'yes' | 'no' | 'no-details' | 'no-response';
  agreement?: 'yes' | 'not-discussed' | 'no';
  help?: 'plan' | 'external' | 'cannot';
  mediation?: 'yes' | 'no';

  // Flow tracking
  completedSteps?: string[];
}

declare module 'express-session' {
  interface SessionData extends CSSession {
    returnTo?: string;
  }
}
