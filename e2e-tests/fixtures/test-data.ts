// Shared test data used across multiple test suites

export const contactChildArrangementOption = [
  {
    label: 'I can contact them directly',
    nextUrl: /\/agree$/,
  },
  {
    label: 'I can only contact them through someone else',
    nextUrl: /\/no-contact$/,
  },
  {
    label: 'I cannot or do not want to contact them',
    nextUrl: /\/no-contact-guidance$/,
  },
];

export const agreeOnChildArrangementOption = [
  {
    label: 'Yes, we agree on some or most things',
    nextUrl: /parenting-plan/,
  },
  {
    label: 'No, we do not agree',
    nextUrl: /help-to-agree/,
  },
  {
    label: 'We have not discussed it yet',
    nextUrl: /help-to-agree/,
  },
];

export const helpToAgreeOnChildArrangementOption = [
  {
    label: 'A plan we can follow ourselves',
    nextUrl: /parenting-plan/,
  },
  {
    label: 'Someone else to guide our conversations',
    nextUrl: /other-options/,
  },
  {
    label: 'We cannot agree – someone else needs to make a decision for us',
    nextUrl: /court-order/,
  },
];

export const otherOptions = [
  {
    label: 'Yes, we have tried mediation or a similar method',
    nextUrl: /court-order/,
  },
  {
    label: 'No, we have not tried yet',
    nextUrl: /mediation/,
  },
];

export const staticPages = [
  { name: 'accessibility statement', path: '/accessibility' },
  { name: 'cookies', path: '/cookies' },
  { name: 'privacy notice', path: '/privacy-notice' },
  { name: 'contact us', path: '/contact-us' },
  { name: 'terms and conditions', path: '/terms-conditions' },
];
