import { Router } from 'express';

import paths from '../constants/paths';
import { getPathKey } from '../utils/localizedPaths';

const pathsNotForHistory = [
  // These pages should be skipped in the back button
  paths.START,
  paths.PASSWORD,
  paths.ACCESSIBILITY_STATEMENT,
  paths.CONTACT_US,
  paths.COOKIES,
  paths.PRIVACY_NOTICE,
  paths.TERMS_AND_CONDITIONS,
];
const pathsForHistory = Object.values(paths).filter((path) => !pathsNotForHistory.includes(path));

const setupHistory = (): Router => {
  const router = Router();

  router.use((request, _response, next) => {
    const requestPath = request.path;
    const pathKey = getPathKey(requestPath);
    const canonicalPath = pathKey ? paths[pathKey] : requestPath;

  // @ts-expect-error this is not necessarily of type paths
    if (pathsForHistory.includes(canonicalPath)) {
      request.session.pageHistory = request.session.pageHistory || [];
      // Going back in the history
      if (request.session.pageHistory[request.session.pageHistory.length - 2] === requestPath) {
        request.session.pageHistory.pop();
      } else if (request.session.pageHistory[request.session.pageHistory.length - 1] !== requestPath) {
        request.session.pageHistory.push(requestPath);
      }
      if (request.session.pageHistory.length >= 20) {
        request.session.pageHistory.shift();
      }
      request.session.previousPage = request.session.pageHistory[request.session.pageHistory.length - 2];
    } else {
      request.session.previousPage = request.session.pageHistory?.[request.session.pageHistory.length - 1];
    }
    next();
  });
  return router;
};

export default setupHistory;
