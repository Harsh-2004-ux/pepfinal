import Product from '../models/Product.js';

export async function createProduct(req, res, next) {
  try {
    const userId = req.user.id;
    const {
      name,
      description,
      seoTags,
      marketingCaption,
      features,
      price,
      category,
      stock,
      lowStockThreshold,
    } = req.body;

    const product = await Product.create({
      userId,
      name,
      description,
      seoTags,
      marketingCaption,
      features,
      price,
      category,
      inventory: {
        stock: typeof stock === 'number' ? stock : 0,
        lowStockThreshold: typeof lowStockThreshold === 'number' ? lowStockThreshold : 5,
      },
    });

    res.status(201).json({ product });
  } catch (err) {
    next(err);
  }
}

export async function listProducts(req, res, next) {
  try {
    const userId = req.user.id;
    const { q } = req.query;

    const filter = { userId };
    if (q) {
      filter.name = { $regex: String(q), $options: 'i' };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    res.json({ products });
  } catch (err) {
    next(err);
  }
}

export async function getProductById(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOne({ _id: id, userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function updateProduct(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const updates = { ...req.body };

    if (typeof updates.stock !== 'undefined' || typeof updates.lowStockThreshold !== 'undefined') {
      updates.inventory = {
        stock: typeof updates.stock === 'number' ? updates.stock : undefined,
        lowStockThreshold:
          typeof updates.lowStockThreshold === 'number' ? updates.lowStockThreshold : undefined,
      };
      delete updates.stock;
      delete updates.lowStockThreshold;
    }

    const product = await Product.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ product });
  } catch (err) {
    next(err);
  }
}

export async function deleteProduct(req, res, next) {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const product = await Product.findOneAndDelete({ _id: id, userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.json({ message: 'Product deleted' });
  } catch (err) {
    next(err);
  }
}

