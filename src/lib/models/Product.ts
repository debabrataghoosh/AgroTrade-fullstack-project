import mongoose, { Schema, models } from 'mongoose';

const ProductSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  unit: { type: String, required: true },
  live: { type: Boolean, default: true },
  image: { type: String },
  category: { type: String },
  subcategory: { type: String },
  seller: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

// Add indexes for better query performance
ProductSchema.index({ category: 1 });
ProductSchema.index({ seller: 1 });
ProductSchema.index({ live: 1 });
ProductSchema.index({ createdAt: -1 });
ProductSchema.index({ title: 'text', description: 'text' });

export default models.Product || mongoose.model('Product', ProductSchema); 