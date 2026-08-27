import { Router } from "express";
import LangarDay from "../models/LangarDay.js";
import { requireAdmin } from "../middleware/auth.js";

const router = Router();
const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const serialize = (day) => ({
  _id: String(day._id), date: day.date, capacity: day.capacity,
  bookedSeats: day.confirmedCount || 0,
  availableSeats: Math.max(day.capacity - (day.confirmedCount || 0), 0),
  isAvailable: day.isAvailable !== false,
  openingTime: day.openingTime || "11:00", closingTime: day.closingTime || "15:00",
});

router.get("/", requireAdmin, async (req, res, next) => {
  try { const days = await LangarDay.find().sort({ date: 1 }); res.json({ availability: days.map(serialize) }); }
  catch (error) { next(error); }
});
router.post("/", requireAdmin, async (req, res, next) => {
  try {
    const { date, capacity, openingTime, closingTime, isAvailable } = req.body;
    if (!datePattern.test(date || "")) return res.status(400).json({ message: "Use date format YYYY-MM-DD." });
    const day = await LangarDay.findOneAndUpdate({ date }, { $set: { capacity: Number(capacity), openingTime, closingTime, isAvailable: isAvailable !== false } }, { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true });
    res.status(201).json({ availability: serialize(day) });
  } catch (error) { next(error); }
});
router.patch("/:id", requireAdmin, async (req, res, next) => {
  try {
    const day = await LangarDay.findById(req.params.id);
    if (!day) return res.status(404).json({ message: "Availability record not found." });
    const { capacity, openingTime, closingTime, isAvailable } = req.body;
    if (capacity !== undefined) { const value = Number(capacity); if (!Number.isInteger(value) || value < day.confirmedCount || value > 1000) return res.status(400).json({ message: `Capacity must be between ${day.confirmedCount} and 1000.` }); day.capacity = value; }
    if (openingTime !== undefined) day.openingTime = openingTime;
    if (closingTime !== undefined) day.closingTime = closingTime;
    if (isAvailable !== undefined) day.isAvailable = Boolean(isAvailable);
    await day.save(); res.json({ availability: serialize(day) });
  } catch (error) { next(error); }
});
router.delete("/:id", requireAdmin, async (req, res, next) => {
  try { const day = await LangarDay.findById(req.params.id); if (!day) return res.status(404).json({ message: "Availability record not found." }); if (day.confirmedCount > 0) return res.status(400).json({ message: "Cannot delete a date with confirmed bookings." }); await day.deleteOne(); res.json({ message: "Availability deleted." }); }
  catch (error) { next(error); }
});
export default router;
