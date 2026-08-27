import mongoose from "mongoose";
const sevaRequestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, trim: true, lowercase: true, maxlength: 160 },
  phone: { type: String, required: true, trim: true, maxlength: 30 },
  availability: { type: String, required: true, trim: true, maxlength: 500 },
  comment: { type: String, trim: true, maxlength: 2000 },
  status: { type: String, enum: ["new", "contacted", "scheduled"], default: "new" },
}, { timestamps: true });
export default mongoose.model("SevaRequest", sevaRequestSchema);
