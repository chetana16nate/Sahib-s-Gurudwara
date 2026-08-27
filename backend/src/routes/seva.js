import { Router } from "express";
import SevaRequest from "../models/SevaRequest.js";
import { requireAdmin } from "../middleware/auth.js";
const router = Router();
router.post("/", async (req, res, next) => { try { const { name, phone, availability } = req.body; if (!name || !phone || !availability) return res.status(400).json({ message: "Name, mobile number, and preferred availability are required." }); const request = await SevaRequest.create(req.body); res.status(201).json({ message: "Thank you for offering Seva. We will be in touch soon.", requestId: request.id }); } catch (error) { next(error); } });
router.get("/", requireAdmin, async (req, res, next) => { try { res.json({ items: await SevaRequest.find().sort({ createdAt: -1 }) }); } catch (error) { next(error); } });
router.patch("/:id", requireAdmin, async (req, res, next) => { try { const item = await SevaRequest.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: "Seva request not found." }); res.json({ item }); } catch (error) { next(error); } });
export default router;
