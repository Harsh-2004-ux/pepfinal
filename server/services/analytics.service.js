import Product from '../models/Product.js';
import Sale from '../models/Sale.js';

function toDayKey(d) {
  const dt = new Date(d);
  const y = dt.getUTCFullYear();
  const m = String(dt.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dt.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export async function getRevenueSeries({ userId, from, to } = {}) {
  const query = { userId };
  if (from || to) query.soldAt = {};
  if (from) query.soldAt.$gte = from;
  if (to) query.soldAt.$lte = to;

  const sales = await Sale.find(query).sort({ soldAt: 1 }).select('revenue soldAt');

  const map = new Map();
  for (const s of sales) {
    const key = toDayKey(s.soldAt);
    map.set(key, (map.get(key) || 0) + (s.revenue || 0));
  }

  const points = [...map.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1));
  return {
    labels: points.map(([k]) => k),
    values: points.map(([, v]) => v),
    totalRevenue: valuesSum(points.map(([, v]) => v)),
  };
}

function valuesSum(arr) {
  return arr.reduce((acc, n) => acc + (typeof n === 'number' ? n : 0), 0);
}

export async function getTopProducts({ userId, limit = 5 } = {}) {
  const pipeline = [
    { $match: { userId } },
    { $group: { _id: '$productId', revenue: { $sum: '$revenue' }, quantity: { $sum: '$quantity' } } },
    { $sort: { revenue: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'products',
        localField: '_id',
        foreignField: '_id',
        as: 'product',
      },
    },
    { $unwind: { path: '$product', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 0, productId: '$_id', name: '$product.name', revenue: 1, quantity: 1 } },
  ];

  const rows = await Sale.aggregate(pipeline);
  return rows;
}

export async function getTrendingInsights({ userId } = {}) {
  // Minimal insight: compare last 7 days vs previous 7 days revenue growth
  const now = new Date();
  const end = now;
  const start2 = new Date(now);
  start2.setUTCDate(start2.getUTCDate() - 14);
  const start1 = new Date(now);
  start1.setUTCDate(start1.getUTCDate() - 7);

  const [prev, curr] = await Promise.all([
    Sale.aggregate([
      { $match: { userId, soldAt: { $gte: start2, $lt: start1 } } },
      { $group: { _id: null, revenue: { $sum: '$revenue' }, count: { $sum: 1 } } },
    ]),
    Sale.aggregate([
      { $match: { userId, soldAt: { $gte: start1, $lte: end } } },
      { $group: { _id: null, revenue: { $sum: '$revenue' }, count: { $sum: 1 } } },
    ]),
  ]);

  const prevRevenue = prev[0]?.revenue || 0;
  const currRevenue = curr[0]?.revenue || 0;
  const growth = prevRevenue === 0 ? null : ((currRevenue - prevRevenue) / prevRevenue) * 100;

  return {
    currRevenue,
    prevRevenue,
    growthPercent: growth === null ? 'N/A' : `${growth.toFixed(1)}%`,
    summary:
      growth === null
        ? 'Not enough data to compute growth yet.'
        : growth >= 0
          ? `Revenue is trending up (+${growth.toFixed(1)}%).`
          : `Revenue is trending down (${growth.toFixed(1)}%).`,
  };
}

export async function getInventoryAlerts({ userId } = {}) {
  const products = await Product.find({ userId }).select('name inventory lowStockThreshold inventory.stock');
  return products
    .filter((p) => (p.inventory?.stock ?? 0) <= (p.inventory?.lowStockThreshold ?? 5))
    .map((p) => ({
      productId: p._id,
      name: p.name,
      stock: p.inventory?.stock ?? 0,
      threshold: p.inventory?.lowStockThreshold ?? 5,
    }));
}

export async function getPricingRecommendations({ userId } = {}) {
  // Heuristic: suggest price range based on last 30 days avg sale price per unit
  const from = new Date();
  from.setUTCDate(from.getUTCDate() - 30);

  const byProduct = await Sale.aggregate([
    { $match: { userId, soldAt: { $gte: from } } },
    { $group: { _id: '$productId', revenue: { $sum: '$revenue' }, qty: { $sum: '$quantity' } } },
    { $project: { productId: '$_id', avgUnitPrice: { $divide: ['$revenue', '$qty'] } } },
  ]);

  const products = await Product.find({ userId }).select('name price');
  const priceMap = new Map(products.map((p) => [String(p._id), p.price]));

  return byProduct.slice(0, 6).map((row) => {
    const current = priceMap.get(String(row.productId)) ?? 0;
    const suggested = row.avgUnitPrice || current;
    return {
      productId: row.productId,
      name: products.find((p) => String(p._id) === String(row.productId))?.name || 'Product',
      currentPrice: current,
      suggestedPrice: Math.round(suggested * 100) / 100,
      rationale: 'Based on historical average unit price in the last 30 days.',
    };
  });
}

export async function getAISuggestions({ userId } = {}) {
  const top = await getTopProducts({ userId, limit: 3 });
  const trending = await getTrendingInsights({ userId });
  const inventory = await getInventoryAlerts({ userId });

  const suggestions = [];
  if (inventory.length) {
    suggestions.push(`Low stock detected on ${inventory.length} product(s). Consider running promotions or restocking soon.`);
  } else {
    suggestions.push('Inventory levels look healthy. Focus on marketing and content optimization for best sellers.');
  }

  if (top.length) {
    suggestions.push(`Your top seller is “${top[0].name}”. Consider generating new marketing captions for it and similar products.`);
  }

  suggestions.push(`Trending insight: ${trending.summary}`);

  return {
    suggestions,
  };
}

