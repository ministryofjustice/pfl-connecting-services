import paths from '../constants/paths';
import { validateRedirectUrl } from './redirectValidator';

describe('validateRedirectUrl', () => {
  it('returns the allowlisted path constant for a valid internal path', () => {
    expect(validateRedirectUrl(paths.DOMESTIC_ABUSE)).toBe(paths.DOMESTIC_ABUSE);
  });

  it('strips query strings and hashes before matching', () => {
    expect(validateRedirectUrl(`${paths.CHILD_SAFETY}?lang=cy#top`)).toBe(paths.CHILD_SAFETY);
  });

  it.each([undefined, null, '', 'myPage', 'https://evil.example', '//evil.example', '/\\evil.example'])(
    'returns the fallback for untrusted value %s',
    (url) => {
      expect(validateRedirectUrl(url)).toBe(paths.START);
    },
  );
});
