import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    seoTags: { type: [String], default: [] },
    marketingCaption: { type: String, default: '' },
    features: { type: [String], default: [] },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, default: '' },
    inventory: {
      stock: { type: Number, default: 0, min: 0 },
      lowStockThreshold: { type: Number, default: 5, min: 0 },
    },
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Product', productSchema);

