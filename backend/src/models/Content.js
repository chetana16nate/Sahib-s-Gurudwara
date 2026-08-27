import mongoose from 'mongoose';

const contentSchema = new mongoose.Schema({
  type: { type: String, required: true, enum: ['event', 'service', 'class', 'gallery'] },
  title: { type: String, required: true, trim: true, maxlength: 180 },
  description: { type: String, trim: true, maxlength: 5000 },
  imageUrl: { type: String, trim: true, maxlength: 1000 },
  eventDate: Date,
  endDate: Date,
  location: { type: String, trim: true, maxlength: 200 },
  schedule: { type: String, trim: true, maxlength: 200 },
  category: { type: String, trim: true, maxlength: 80 },
  isPublished: { type: Boolean, default: true },
}, { timestamps: true });

contentSchema.index({ type: 1, isPublished: 1, eventDate: 1 });
export default mongoose.model('Content', contentSchema);
