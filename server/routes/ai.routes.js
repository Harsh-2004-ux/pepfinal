import { Router } from 'express';
import { generate } from '../controllers/ai.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);
router.post('/generate', generate);

export default router;

