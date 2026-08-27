import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 80 },
  reviewEnglish: { type: String, required: true, trim: true, maxlength: 800 },
  reviewPunjabi: { type: String, trim: true, maxlength: 1000, default: "" },
  rating: { type: Number, required: true, min: 1, max: 5 },
  approved: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.model("Review", reviewSchema);
