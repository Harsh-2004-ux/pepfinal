import { Router } from 'express';
import { recordSale, summary, topProducts, trending, aiSuggestions, pricing } from '../controllers/dashboard.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();
router.use(requireAuth);

router.post('/record-sale', recordSale);
router.get('/summary', summary);
router.get('/top-products', topProducts);
router.get('/trending', trending);
router.get('/ai-suggestions', aiSuggestions);
router.get('/pricing', pricing);

export default router;

