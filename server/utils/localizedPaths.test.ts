import config from '../config';
import paths from '../constants/paths';
import welshPaths from '../constants/welshPaths';
import {
  getCanonicalPath,
  getLocaleFromPath,
  getLocalizedPath,
  getLocalizedPaths,
  getPathKey,
  isKnownPath,
  localizePath,
} from './localizedPaths';

describe('localizedPaths', () => {
  describe('getLocalizedPath', () => {
    it('returns English paths by default', () => {
      expect(getLocalizedPath('CHILD_SAFETY', 'en')).toBe('/child-safety');
    });

    it('returns Welsh paths when locale is cy and Welsh is enabled', () => {
      config.includeWelshLanguage = true;
      expect(getLocalizedPath('CHILD_SAFETY', 'cy')).toBe('/diogelwch-plant');
    });

    it('returns English paths when Welsh is disabled', () => {
      config.includeWelshLanguage = false;
      expect(getLocalizedPath('CHILD_SAFETY', 'cy')).toBe('/child-safety');
      config.includeWelshLanguage = true;
    });
  });

  describe('getLocaleFromPath', () => {
    it('detects English paths', () => {
      expect(getLocaleFromPath('/child-safety')).toBe('en');
    });

    it('detects Welsh paths', () => {
      expect(getLocaleFromPath('/diogelwch-plant')).toBe('cy');
    });

    it('returns null for unknown paths', () => {
      expect(getLocaleFromPath('/unknown-page')).toBeNull();
    });
  });

  describe('getPathKey', () => {
    it('maps English and Welsh paths to the same key', () => {
      expect(getPathKey('/child-safety')).toBe('CHILD_SAFETY');
      expect(getPathKey('/diogelwch-plant')).toBe('CHILD_SAFETY');
    });
  });

  describe('localizePath', () => {
    it('converts an English path to its Welsh equivalent', () => {
      expect(localizePath('/child-safety', 'cy')).toBe('/diogelwch-plant');
    });

    it('converts a Welsh path to its English equivalent', () => {
      expect(localizePath('/diogelwch-plant', 'en')).toBe('/child-safety');
    });
  });

  describe('getCanonicalPath', () => {
    it('returns the English path for Welsh URLs', () => {
      expect(getCanonicalPath('/diogelwch-plant')).toBe('/child-safety');
    });
  });

  describe('isKnownPath', () => {
    it('recognises English and Welsh service paths', () => {
      expect(isKnownPath('/child-safety')).toBe(true);
      expect(isKnownPath('/diogelwch-plant')).toBe(true);
      expect(isKnownPath('/not-a-page')).toBe(false);
    });
  });

  describe('getLocalizedPaths', () => {
    it('returns all Welsh paths when locale is cy', () => {
      const localizedPaths = getLocalizedPaths('cy');
      expect(localizedPaths.CHILD_SAFETY).toBe(welshPaths.CHILD_SAFETY);
      expect(localizedPaths.START).toBe(paths.START);
    });
  });
});
