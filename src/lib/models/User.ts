import mongoose, { Schema, models } from 'mongoose';

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, // hashed password
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  createdAt: { type: Date, default: Date.now },
});

export default models.User || mongoose.model('User', UserSchema); 