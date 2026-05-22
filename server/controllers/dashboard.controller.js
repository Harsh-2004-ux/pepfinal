import Sale from '../models/Sale.js';
import Product from '../models/Product.js';
import {
  getRevenueSeries,
  getTopProducts,
  getTrendingInsights,
  getInventoryAlerts,
  getAISuggestions,
  getPricingRecommendations,
} from '../services/analytics.service.js';

export async function recordSale(req, res, next) {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;

    const product = await Product.findOne({ _id: productId, userId });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const qty = Math.max(1, Number(quantity || 1));
    const revenue = (product.price || 0) * qty;

    const sale = await Sale.create({ userId, productId, quantity: qty, revenue });

    // Optional inventory decrement
    const invStock = product.inventory?.stock ?? 0;
    if (invStock > 0) {
      product.inventory.stock = Math.max(0, invStock - qty);
      await product.save();
    }

    res.status(201).json({ sale });
  } catch (err) {
    next(err);
  }
}

export async function summary(req, res, next) {
  try {
    const userId = req.user.id;

    const series = await getRevenueSeries({ userId });
    const inventory = await getInventoryAlerts({ userId });

    // total revenue is in series
    res.json({
      revenue: series,
      inventory,
    });
  } catch (err) {
    next(err);
  }
}

export async function topProducts(req, res, next) {
  try {
    const userId = req.user.id;
    const top = await getTopProducts({ userId, limit: 5 });
    res.json({ top });
  } catch (err) {
    next(err);
  }
}

export async function trending(req, res, next) {
  try {
    const userId = req.user.id;
    const insights = await getTrendingInsights({ userId });
    res.json({ insights });
  } catch (err) {
    next(err);
  }
}

export async function aiSuggestions(req, res, next) {
  try {
    const userId = req.user.id;
    const suggestions = await getAISuggestions({ userId });
    res.json({ suggestions });
  } catch (err) {
    next(err);
  }
}

export async function pricing(req, res, next) {
  try {
    const userId = req.user.id;
    const recommendations = await getPricingRecommendations({ userId });
    res.json({ recommendations });
  } catch (err) {
    next(err);
  }
}

