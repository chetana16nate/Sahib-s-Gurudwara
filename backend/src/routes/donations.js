import { Router } from 'express';
import Donation from '../models/Donation.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.post('/', async (req, res, next) => {
  try {
    const { name, email, amount } = req.body;
    if (!name || !email || !amount) return res.status(400).json({ message: 'Name, email, and amount are required.' });
    const donation = await Donation.create(req.body);
    res.status(201).json({ message: 'Donation intent received. Thank you for your support.', donationId: donation.id });
  } catch (error) { next(error); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try { res.json({ items: await Donation.find().sort({ createdAt: -1 }) }); } catch (error) { next(error); }
});

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await Donation.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Donation not found.' });
    res.json({ item });
  } catch (error) { next(error); }
});

export default router;
