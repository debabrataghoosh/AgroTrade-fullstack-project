import mongoose, { Schema, models } from 'mongoose';

const MessageSchema = new Schema({
  sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.Message || mongoose.model('Message', MessageSchema); 