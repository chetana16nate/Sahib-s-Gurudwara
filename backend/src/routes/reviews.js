import { Router } from "express";
import Review from "../models/Review.js";

const router = Router();

router.get("/", async (_req, res, next) => {
  try {
    const reviews = await Review.find({ approved: true }).sort({ createdAt: -1 }).limit(100);
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, reviewEnglish, reviewPunjabi = "", rating } = req.body;
    const numericRating = Number(rating);

    if (!name?.trim() || !reviewEnglish?.trim()) {
      return res.status(400).json({ message: "Name and English review are required." });
    }

    if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: "Please select a rating between 1 and 5." });
    }

    const review = await Review.create({
      name: name.trim(),
      reviewEnglish: reviewEnglish.trim(),
      reviewPunjabi: reviewPunjabi.trim(),
      rating: numericRating,
    });

    res.status(201).json({ message: "Thank you for sharing your experience.", review });
  } catch (error) {
    next(error);
  }
});

export default router;
