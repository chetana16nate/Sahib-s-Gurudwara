import { Router } from 'express';
import Content from '../models/Content.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
const allowedTypes = ['event', 'service', 'class', 'gallery'];
const validateType = (type) => allowedTypes.includes(type);

router.get('/admin/:type', requireAdmin, async (req, res, next) => {
  try {
    if (!validateType(req.params.type)) return res.status(400).json({ message: 'Unsupported content type.' });
    res.json({ items: await Content.find({ type: req.params.type }).sort({ eventDate: 1, createdAt: -1 }) });
  } catch (error) { next(error); }
});
router.get('/:type', async (req, res, next) => {
  try {
    if (!validateType(req.params.type)) return res.status(400).json({ message: 'Unsupported content type.' });
    res.json({ items: await Content.find({ type: req.params.type, isPublished: true }).sort({ eventDate: 1, createdAt: -1 }) });
  } catch (error) { next(error); }
});
router.post('/:type', requireAdmin, async (req, res, next) => {
  try { if (!validateType(req.params.type)) return res.status(400).json({ message: 'Unsupported content type.' }); res.status(201).json({ item: await Content.create({ ...req.body, type: req.params.type }) }); }
  catch (error) { next(error); }
});
router.patch('/:id', requireAdmin, async (req, res, next) => {
  try { delete req.body.type; const item = await Content.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); if (!item) return res.status(404).json({ message: 'Content item not found.' }); res.json({ item }); }
  catch (error) { next(error); }
});
router.delete('/:id', requireAdmin, async (req, res, next) => {
  try { const item = await Content.findByIdAndDelete(req.params.id); if (!item) return res.status(404).json({ message: 'Content item not found.' }); res.status(204).send(); }
  catch (error) { next(error); }
});
export default router;
