import { Router } from 'express';
import jwt from 'jsonwebtoken';

import Admin from '../models/Admin.js';
import User from '../models/User.js';
import PasswordResetRequest from '../models/PasswordResetRequest.js';

import { requireAdmin } from '../middleware/auth.js';
import { requireUser } from '../middleware/userAuth.js';


const router = Router();

/* =========================================================
   USER PASSWORD RECOVERY REQUEST
========================================================= */

router.post('/user/forgot-password', async (req, res, next) => {
    try {
        const email = req.body?.email?.trim()?.toLowerCase();

        if (!email) {
            return res.status(400).json({ message: 'Please enter your email address.' });
        }

        const user = await User.findOne({ email });

        // Keep the response neutral so account existence is not disclosed.
        if (user) {
            await PasswordResetRequest.findOneAndUpdate(
                { email, status: 'pending' },
                { $set: { updatedAt: new Date() } },
                { upsert: true, new: true, setDefaultsOnInsert: true }
            );
        }

        return res.json({
            message: 'If an account exists for this email, your password recovery request has been submitted. A Gurudwara administrator will contact you.'
        });
    } catch (error) {
        next(error);
    }
});


/* =========================================================
   ADMIN TOKEN
========================================================= */

const signAdminToken = (admin) => {

    return jwt.sign(
        {
            sub: admin.id,
            email: admin.email,
            role: 'admin'
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || '7d'
        }
    );

};


/* =========================================================
   USER TOKEN
========================================================= */

const signUserToken = (user) => {

    return jwt.sign(
        {
            sub: user.id,
            email: user.email,
            role: 'user'
        },
        process.env.JWT_SECRET,
        {
            expiresIn:
                process.env.JWT_EXPIRES_IN || '7d'
        }
    );

};


/* =========================================================
   ADMIN LOGIN
========================================================= */

router.post(
    '/login',
    async (req, res, next) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    message:
                        'Email and password are required.'
                });

            }


            const admin =
                await Admin
                    .findOne({
                        email:
                            email
                                .trim()
                                .toLowerCase()
                    })
                    .select('+password');


            if (
                !admin ||
                !(await admin.matchesPassword(password))
            ) {

                return res.status(401).json({
                    message:
                        'Invalid email or password.'
                });

            }


            const token =
                signAdminToken(admin);


            return res.json({

                token,

                role: 'admin',

                admin: {
                    id: admin.id,
                    name: admin.name,
                    email: admin.email
                }

            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   ADMIN ME
========================================================= */

router.get(
    '/me',
    requireAdmin,
    (req, res) => {

        return res.json({

            admin: {
                id: req.admin.id,
                name: req.admin.name,
                email: req.admin.email
            }

        });

    }
);

router.get('/admin/users', requireAdmin, async (_req, res, next) => {
    try {
        const users = await User.find()
            .select('name email phone createdAt')
            .sort({ createdAt: -1 })
            .lean();
        return res.json({ users });
    } catch (error) {
        next(error);
    }
});


/* =========================================================
   USER REGISTER
========================================================= */

router.post(
    '/user/register',
    async (req, res, next) => {

        try {

            const {
                name,
                email,
                phone,
                password
            } = req.body;


            if (
                !name ||
                !email ||
                !phone ||
                !password
            ) {

                return res.status(400).json({
                    message:
                        'Name, email, phone and password are required.'
                });

            }


            if (password.length < 8) {

                return res.status(400).json({
                    message:
                        'Password must contain at least 8 characters.'
                });

            }


            const normalizedEmail =
                email
                    .trim()
                    .toLowerCase();


            const existingUser =
                await User.findOne({
                    email: normalizedEmail
                });


            if (existingUser) {

                return res.status(409).json({
                    message:
                        'An account with this email already exists.'
                });

            }


            const user =
                await User.create({

                    name:
                        name.trim(),

                    email:
                        normalizedEmail,

                    phone:
                        phone.trim(),

                    password

                });


            const token =
                signUserToken(user);


            return res.status(201).json({

                message:
                    'Registration successful.',

                token,

                role: 'user',

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    phone: user.phone

                }

            });

        } catch (error) {

            if (error?.code === 11000) {

                return res.status(409).json({
                    message:
                        'An account with this email already exists.'
                });

            }

            next(error);

        }

    }
);


/* =========================================================
   USER LOGIN
========================================================= */

router.post(
    '/user/login',
    async (req, res, next) => {

        try {

            const {
                email,
                password
            } = req.body;


            if (!email || !password) {

                return res.status(400).json({
                    message:
                        'Email and password are required.'
                });

            }


            const user =
                await User
                    .findOne({
                        email:
                            email
                                .trim()
                                .toLowerCase()
                    })
                    .select('+password');


            if (
                !user ||
                !(await user.matchesPassword(password))
            ) {

                return res.status(401).json({
                    message:
                        'Invalid email or password.'
                });

            }


            const token =
                signUserToken(user);


            return res.json({

                message:
                    'Login successful.',

                token,

                role: 'user',

                user: {

                    id: user.id,

                    name: user.name,

                    email: user.email,

                    phone: user.phone

                }

            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   USER ME
========================================================= */

router.get(
    '/user/me',
    requireUser,
    (req, res) => {

        return res.json({

            user: {

                id: req.user.id,

                name: req.user.name,

                email: req.user.email,

                phone: req.user.phone

            }

        });

    }
);


export default router;
