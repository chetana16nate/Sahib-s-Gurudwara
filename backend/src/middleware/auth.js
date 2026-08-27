import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export async function requireAdmin(req, res, next) {
    const token = req.headers.authorization?.startsWith('Bearer ')
        ? req.headers.authorization.slice(7)
        : null;

    if (!token) {
        return res.status(401).json({
            message: 'Authentication is required.'
        });
    }

    try {
        const payload = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Admin token only
        if (payload.role !== 'admin') {
            return res.status(403).json({
                message: 'Administrator access is required.'
            });
        }

        const admin = await Admin.findById(payload.sub);

        if (!admin) {
            return res.status(401).json({
                message: 'Administrator account no longer exists.'
            });
        }

        req.admin = admin;

        next();

    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                message: 'Your session has expired. Please login again.'
            });
        }

        return res.status(401).json({
            message: 'Invalid or expired authentication token.'
        });
    }
}