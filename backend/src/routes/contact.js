import { Router } from 'express';
import ContactMessage from '../models/ContactMessage.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.post('/', async (req, res, next) => {
  try {
    const { name, email, message } = req.body;
    if (!name || !email || !message) return res.status(400).json({ message: 'Name, email, and message are required.' });
    const contact = await ContactMessage.create(req.body);
    res.status(201).json({ message: 'Thank you. Your message has been received.', contactId: contact.id });
  } catch (error) { next(error); }
});

router.get('/', requireAdmin, async (req, res, next) => {
  try { res.json({ items: await ContactMessage.find().sort({ createdAt: -1 }) }); } catch (error) { next(error); }
});

router.patch('/:id', requireAdmin, async (req, res, next) => {
  try {
    const item = await ContactMessage.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Message not found.' });
    res.json({ item });
  } catch (error) { next(error); }
});

export default router;
