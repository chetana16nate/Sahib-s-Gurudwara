import mongoose from 'mongoose';

const passwordResetRequestSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
  },
  { timestamps: true }
);

export default mongoose.model('PasswordResetRequest', passwordResetRequestSchema);
