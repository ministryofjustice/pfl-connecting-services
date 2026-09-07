import paths from '../constants/paths';

/**
 * Allowed redirect paths. Values come from the paths enum (trusted constants),
 * never from request input.
 */
const ALLOWED_REDIRECT_PATHS: readonly string[] = Object.values(paths);

/**
 * Maps a user-provided URL to a trusted internal path.
 * Returns the allowlisted constant itself so the result is not derived from user input.
 */
export const validateRedirectUrl = (url: string | undefined | null, fallbackUrl: string = paths.START): string => {
  if (!url) {
    return fallbackUrl;
  }

  const pathOnly = url.trim().split('?')[0].split('#')[0];

  console.log('Validating redirect URL:', { url, pathOnly, fallbackUrl });

  for (const allowed of ALLOWED_REDIRECT_PATHS) {
    if (pathOnly === allowed) {
      return allowed;
    }
  }

  return fallbackUrl;
};

/**
 * Sanitizes a redirect URL by validating it against the whitelist
 * This is an alias for validateRedirectUrl for clarity in certain contexts
 */
export const sanitizeRedirectUrl = validateRedirectUrl;
