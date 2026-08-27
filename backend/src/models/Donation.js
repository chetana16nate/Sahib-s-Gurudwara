import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, trim: true, maxlength: 30 },
  amount: { type: Number, required: true, min: 1 },
  currency: { type: String, default: 'GHS', uppercase: true, maxlength: 3 },
  purpose: { type: String, trim: true, maxlength: 120 },
  paymentReference: { type: String, trim: true, maxlength: 160 },
  status: { type: String, enum: ['pending', 'received', 'cancelled'], default: 'pending' },
}, { timestamps: true });

export default mongoose.model('Donation', donationSchema);
