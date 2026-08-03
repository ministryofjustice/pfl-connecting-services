import config from '../config';
import paths from '../constants/paths';
import welshPaths from '../constants/welshPaths';

export type PathKey = keyof typeof paths;

const pathToKeyMap = new Map<string, PathKey>();

Object.entries(paths).forEach(([key, value]) => {
  pathToKeyMap.set(value, key as PathKey);
});

Object.entries(welshPaths).forEach(([key, value]) => {
  pathToKeyMap.set(value, key as PathKey);
});

export const getPathKey = (path: string): PathKey | undefined => {
  const pathOnly = path.split('?')[0].split('#')[0];
  return pathToKeyMap.get(pathOnly);
};

export const getLocalizedPaths = (locale: string): Record<PathKey, string> => {
  if (locale === 'cy' && config.includeWelshLanguage) {
    return { ...paths, ...welshPaths };
  }

  return paths;
};

export const getLocalizedPath = (pathKey: PathKey, locale: string): string =>
  getLocalizedPaths(locale)[pathKey];

export const localizePath = (path: string, locale: string): string => {
  const pathKey = getPathKey(path);
  if (pathKey) {
    return getLocalizedPath(pathKey, locale);
  }

  return path.split('?')[0].split('#')[0];
};

export const getLocaleFromPath = (path: string): 'en' | 'cy' | null => {
  const pathOnly = path.split('?')[0].split('#')[0];
  const pathKey = getPathKey(pathOnly);

  if (!pathKey) {
    return null;
  }

  if (pathOnly === paths[pathKey]) {
    return 'en';
  }

  if (pathOnly === welshPaths[pathKey]) {
    return 'cy';
  }

  return null;
};

export const getAllAllowedPaths = (): Set<string> =>
  new Set([...Object.values(paths), ...Object.values(welshPaths)]);

export const getCanonicalPath = (path: string): string => {
  const pathKey = getPathKey(path);
  if (pathKey) {
    return paths[pathKey];
  }

  return path.split('?')[0].split('#')[0];
};

export const isKnownPath = (path: string): boolean => getPathKey(path) !== undefined;
