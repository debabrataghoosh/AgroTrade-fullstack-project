import mongoose, { Schema, models } from 'mongoose';

const OrderSchema = new Schema({
  userEmail: { type: String, required: true },
  items: [
    {
      productId: String,
      title: String,
      image: String,
      price: Number,
      quantity: Number,
      unit: String,
      category: String,
      seller: { type: String, required: true },
    }
  ],
  address: Object,
  status: { type: String, default: 'Placed' },
  stripeSessionId: String,
  paymentMethod: { type: String, enum: ['online', 'cod'], default: 'online' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Order || mongoose.model('Order', OrderSchema); 