import { Router } from 'express';
import {
  createProduct,
  listProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.post('/', createProduct);
router.get('/', listProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;

