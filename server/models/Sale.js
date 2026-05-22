import mongoose from 'mongoose';

const saleSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
      index: true,
    },
    quantity: { type: Number, required: true, min: 1 },
    revenue: { type: Number, required: true, min: 0 },
    soldAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Sale', saleSchema);

