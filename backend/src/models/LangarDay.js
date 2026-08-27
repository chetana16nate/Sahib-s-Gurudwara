import mongoose from 'mongoose';

const langarDaySchema = new mongoose.Schema({
  date: { type: String, required: true, unique: true, match: /^\d{4}-\d{2}-\d{2}$/ },
  capacity: { type: Number, default: 100, min: 1, max: 1000 },
  confirmedCount: { type: Number, default: 0, min: 0 },
  isAvailable: { type: Boolean, default: true },
  openingTime: { type: String, default: '11:00' },
  closingTime: { type: String, default: '15:00' },
}, { timestamps: true });

export default mongoose.model('LangarDay', langarDaySchema);

