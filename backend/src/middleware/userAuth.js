import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function requireUser(
    req,
    res,
    next
) {

    const authorization =
        req.headers.authorization;

    const token =
        authorization?.startsWith('Bearer ')
            ? authorization.slice(7)
            : null;


    if (!token) {

        return res.status(401).json({
            message:
                'Please login to continue.'
        });

    }


    try {

        const payload =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        /* =====================================
           USER TOKEN ONLY
        ====================================== */

        if (payload.role !== 'user') {

            return res.status(403).json({
                message:
                    'User access is required.'
            });

        }


        /* =====================================
           FIND USER
        ====================================== */

        const user =
            await User
                .findById(payload.sub)
                .select('-password');


        if (!user) {

            return res.status(401).json({
                message:
                    'User account no longer exists.'
            });

        }


        req.user = user;

        next();

    } catch (error) {

        if (
            error.name === 'TokenExpiredError'
        ) {

            return res.status(401).json({
                message:
                    'Your session has expired. Please login again.'
            });

        }


        return res.status(401).json({
            message:
                'Invalid authentication token.'
        });

    }
}