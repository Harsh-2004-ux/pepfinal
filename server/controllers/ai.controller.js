import { generateProductContent } from '../services/gemini.service.js';
import Product from '../models/Product.js';

export async function generate(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, product } = req.body;

    let inputProduct = product;
    let resolvedId = productId;

    if (resolvedId) {
      const dbProduct = await Product.findOne({ _id: resolvedId, userId });
      if (!dbProduct) return res.status(404).json({ message: 'Product not found' });

      inputProduct = {
        name: dbProduct.name,
        description: dbProduct.description,
        category: dbProduct.category,
        price: dbProduct.price,
        features: dbProduct.features,
      };
    }

    const generated = await generateProductContent({ product: inputProduct || {} });

    if (resolvedId) {
      const updated = await Product.findOneAndUpdate(
        { _id: resolvedId, userId },
        {
          description: generated.description,
          seoTags: generated.seoTags,
          marketingCaption: generated.marketingCaption,
        },
        { new: true }
      );

      return res.json({ product: updated, generated });
    }

    return res.json({ generated });
  } catch (err) {
    next(err);
  }
}

