import { Router } from 'express';
import questionRoutes from './questions';
import outcomeRoutes from './outcomes';
import informationRoutes from './information';

const router = Router();

// Question flow routes
router.use(questionRoutes);

// Outcome page routes
router.use(outcomeRoutes);

// Information page routes
router.use(informationRoutes);

export default router;
