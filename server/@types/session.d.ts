import 'express-session';

export interface CSSession {
  // Question answers
  childSafety?: 'yes' | 'no';
  domesticAbuse?: 'yes' | 'no';
  contactChildArrangements?: 'yes' | 'no' | 'no-contact';
  agreement?: 'yes' | 'not-discussed' | 'no';
  helpToAgree?: 'plan' | 'external' | 'cannot';
  mediation?: 'yes' | 'no';
  otherOptions?: 'yes' | 'no';
  // Flow tracking
  completedSteps?: string[];
}

declare module 'express-session' {
  interface SessionData extends CSSession {
    returnTo?: string;
  }
}
