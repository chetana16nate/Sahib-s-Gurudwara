import { Router } from 'express';
import crypto from 'crypto';

import LangarDay from '../models/LangarDay.js';
import LangarRegistration from '../models/LangarRegistration.js';

import { requireAdmin } from '../middleware/auth.js';
import { requireUser } from '../middleware/userAuth.js';


const router = Router();

const datePattern =
    /^\d{4}-\d{2}-\d{2}$/;


/* =========================================================
   GET / CREATE LANGAR DAY
========================================================= */

const getDay = async (date) => {

    return LangarDay.findOneAndUpdate(

        { date },

        {
            $setOnInsert: {
                date,
                capacity: 100,
                confirmedCount: 0
            }
        },

        {
            new: true,
            upsert: true,
            setDefaultsOnInsert: true
        }

    );

};


/* =========================================================
   SUMMARY
========================================================= */

const summary = (
    day,
    waitlist = 0
) => {

    return {

        date: day.date,

        capacity: day.capacity,

        confirmed:
            day.confirmedCount,

        remaining:
            Math.max(
                day.capacity -
                day.confirmedCount,
                0
            ),

        waitlist,

        totalSeats: day.capacity,
        bookedSeats: day.confirmedCount,
        availableSeats: Math.max(day.capacity - day.confirmedCount, 0)

    };

};


/* =========================================================
   PUBLIC AVAILABILITY
========================================================= */

/*
 * Anyone can check availability.
 *
 * GET
 * /api/langar/capacity?date=2026-08-20
 */

router.get(
    '/capacity',
    async (req, res, next) => {

        try {

            const date =
                req.query.date ||
                new Date()
                    .toISOString()
                    .slice(0, 10);


            if (!datePattern.test(date)) {

                return res.status(400).json({
                    message:
                        'Use date format YYYY-MM-DD.'
                });

            }


            const day =
                await getDay(date);


            const waitlist =
                await LangarRegistration
                    .countDocuments({
                        date,
                        status: 'waitlisted'
                    });


            return res.json(
                summary(
                    day,
                    waitlist
                )
            );

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   USER BOOKING
========================================================= */

/*
 * POST
 * /api/langar/registrations
 *
 * USER LOGIN REQUIRED
 */

router.post(
    '/registrations',
    requireUser,
    async (req, res, next) => {

        try {

            const {
                fullName,
                phone,
                whatsapp,
                people,
                date,
                time,
                bookingType,
                organization,
                specialRequirement,
                confirmed
            } = req.body;


            /* =====================================
               VALIDATION
            ====================================== */

            if (
                !fullName ||
                !phone ||
                !people ||
                !date ||
                !bookingType ||
                !confirmed
            ) {

                return res.status(400).json({
                    message:
                        'Please complete all required fields and confirm your registration.'
                });

            }


            if (
                !datePattern.test(date)
            ) {

                return res.status(400).json({
                    message:
                        'Please provide a valid date.'
                });

            }


            if (
                ![
                    'individual',
                    'family',
                    'group'
                ].includes(bookingType)
            ) {

                return res.status(400).json({
                    message:
                        'Please select a valid booking type.'
                });

            }


            const partySize =
                Number(people);

            const langarTime = time || '1:30 PM';

            if (!['1:30 PM', '7:00 PM'].includes(langarTime)) {
                return res.status(400).json({
                    message: 'Please select Lunch at 1:30 PM or Dinner at 7:00 PM.'
                });
            }


            if (
                !Number.isInteger(partySize) ||
                partySize < 1 ||
                partySize > 100
            ) {

                return res.status(400).json({
                    message:
                        'Number of people must be between 1 and 100.'
                });

            }


            /* =====================================
               PREVENT PAST DATES
            ====================================== */

            const today =
                new Date()
                    .toISOString()
                    .slice(0, 10);


            if (date < today) {

                return res.status(400).json({
                    message:
                        'You cannot book Langar for a past date.'
                });

            }


            /* =====================================
               GET DAY
            ====================================== */

            await getDay(date);


            /* =====================================
               RESERVE SEATS ATOMICALLY
            ====================================== */

            const reserved =
                await LangarDay.findOneAndUpdate(

                    {
                        date,

                        $expr: {
                            $lte: [
                                {
                                    $add: [
                                        '$confirmedCount',
                                        partySize
                                    ]
                                },

                                '$capacity'
                            ]
                        }

                    },

                    {
                        $inc: {
                            confirmedCount:
                                partySize
                        }
                    },

                    {
                        new: true
                    }

                );


            /* =====================================
               BOOKING NUMBER
            ====================================== */

            const reference =
                `LG-${date.replaceAll('-', '')}-${crypto
                    .randomBytes(3)
                    .toString('hex')
                    .toUpperCase()}`;


            /* =====================================
               CONFIRMED
            ====================================== */

            if (reserved) {

                const registration =
                    await LangarRegistration.create({

                        user:
                            req.user._id,

                        fullName:
                            fullName.trim(),

                        phone:
                            phone.trim(),

                        whatsapp:
                            whatsapp?.trim() || '',

                        people:
                            partySize,

                        date,

                        time: langarTime,

                        bookingType,

                        organization:
                            organization?.trim() || '',

                        specialRequirement:
                            specialRequirement?.trim() || '',

                        confirmed: true,

                        reference,

                        status:
                            'confirmed'

                    });


                return res.status(201).json({

                    message:
                        'Your Langar registration is confirmed.',

                    registration,

                    capacity:
                        summary(reserved)

                });

            }


            /* =====================================
               WAITLIST
            ====================================== */

            const day =
                await LangarDay.findOne({
                    date
                });


            const registration =
                await LangarRegistration.create({

                    user:
                        req.user._id,

                    fullName:
                        fullName.trim(),

                    phone:
                        phone.trim(),

                    whatsapp:
                        whatsapp?.trim() || '',

                    people:
                        partySize,

                    date,

                    time: langarTime,

                    bookingType,

                    organization:
                        organization?.trim() || '',

                    specialRequirement:
                        specialRequirement?.trim() || '',

                    confirmed: true,

                    reference,

                    status:
                        'waitlisted'

                });


            return res.status(202).json({

                message:
                    `Only ${Math.max(
                        day.capacity -
                        day.confirmedCount,
                        0
                    )} places are currently available. You have been added to the waitlist.`,

                registration,

                capacity:
                    summary(day)

            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   USER BOOKINGS
========================================================= */

/*
 * GET
 * /api/langar/my-bookings
 */

router.get(
    '/my-bookings',
    requireUser,
    async (req, res, next) => {

        try {

            const bookings =
                await LangarRegistration
                    .find({
                        user: req.user._id
                    })
                    .sort({
                        createdAt: -1
                    });


            return res.json({
                bookings
            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   USER CANCEL BOOKING
========================================================= */

router.patch(
    '/my-bookings/:id/cancel',
    requireUser,
    async (req, res, next) => {

        try {

            const booking =
                await LangarRegistration.findOne({
                    _id: req.params.id,
                    user: req.user._id
                });


            if (!booking) {

                return res.status(404).json({
                    message:
                        'Booking not found.'
                });

            }


            if (
                booking.status === 'cancelled'
            ) {

                return res.status(400).json({
                    message:
                        'This booking is already cancelled.'
                });

            }


            /*
             * Return confirmed seats.
             */

            if (
                booking.status === 'confirmed'
            ) {

                await LangarDay.findOneAndUpdate(

                    {
                        date: booking.date,

                        $expr: {
                            $gte: [
                                '$confirmedCount',
                                booking.people
                            ]
                        }

                    },

                    {
                        $inc: {
                            confirmedCount:
                                -booking.people
                        }

                    }

                );

            }


            booking.status =
                'cancelled';


            await booking.save();


            return res.json({

                message:
                    'Your Langar booking has been cancelled.',

                booking

            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   ADMIN DASHBOARD
========================================================= */

router.get(
    '/admin/dashboard',
    requireAdmin,
    async (req, res, next) => {

        try {

            const date =
                req.query.date ||
                new Date()
                    .toISOString()
                    .slice(0, 10);


            const day =
                await getDay(date);


            const registrations =
                await LangarRegistration
                    .find({ date })
                    .populate(
                        'user',
                        'name email phone'
                    )
                    .sort({
                        createdAt: -1
                    });


            const waitlist =
                registrations.filter(
                    item =>
                        item.status ===
                        'waitlisted'
                ).length;


            return res.json({

                ...summary(
                    day,
                    waitlist
                ),

                registrations

            });

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   ADMIN CAPACITY
========================================================= */

router.patch(
    '/admin/capacity/:date',
    requireAdmin,
    async (req, res, next) => {

        try {

            const capacity =
                Number(req.body.capacity);


            const day =
                await getDay(
                    req.params.date
                );


            if (
                !Number.isInteger(capacity) ||
                capacity < day.confirmedCount ||
                capacity < 1 ||
                capacity > 1000
            ) {

                return res.status(400).json({
                    message:
                        `Capacity must be between ${day.confirmedCount} and 1000.`
                });

            }


            day.capacity =
                capacity;


            await day.save();


            return res.json(
                summary(day)
            );

        } catch (error) {

            next(error);

        }

    }
);


/* =========================================================
   ADMIN UPDATE REGISTRATION
========================================================= */

/*
 * GET /api/langar/admin/registrations
 * Returns all bookings for the booking-management screens.
 */
router.get(
    '/admin/registrations',
    requireAdmin,
    async (req, res, next) => {
        try {
            const filter = {};

            if (req.query.date) {
                if (!datePattern.test(req.query.date)) {
                    return res.status(400).json({ message: 'Use date format YYYY-MM-DD.' });
                }
                filter.date = req.query.date;
            }

            const registrations = await LangarRegistration
                .find(filter)
                .populate('user', 'name email phone')
                .sort({ createdAt: -1 });

            return res.json({ registrations, bookings: registrations });
        } catch (error) {
            next(error);
        }
    }
);

router.patch(
    '/admin/registrations/:id',
    requireAdmin,
    async (req, res, next) => {

        try {

            const item =
                await LangarRegistration
                    .findById(
                        req.params.id
                    );


            if (!item) {

                return res.status(404).json({
                    message:
                        'Registration not found.'
                });

            }


            const {
                status,
                checkedIn,
                people
            } = req.body;


            const newPeople =
                people === undefined
                    ? item.people
                    : Number(people);


            if (
                !Number.isInteger(newPeople) ||
                newPeople < 1
            ) {

                return res.status(400).json({
                    message:
                        'Provide a valid number of people.'
                });

            }


            const wasConfirmed =
                item.status ===
                'confirmed';


            const willBeConfirmed =
                status === undefined
                    ? wasConfirmed
                    : status === 'confirmed';


            const delta =
                (
                    willBeConfirmed
                        ? newPeople
                        : 0
                ) -
                (
                    wasConfirmed
                        ? item.people
                        : 0
                );


            if (delta !== 0) {

                const day =
                    await LangarDay
                        .findOneAndUpdate(

                            {
                                date:
                                    item.date,

                                $expr: {
                                    $gte: [
                                        {
                                            $add: [
                                                '$capacity',
                                                {
                                                    $multiply: [
                                                        -1,
                                                        '$confirmedCount'
                                                    ]
                                                }
                                            ]
                                        },

                                        delta
                                    ]
                                }

                            },

                            {
                                $inc: {
                                    confirmedCount:
                                        delta
                                }

                            },

                            {
                                new: true
                            }

                        );


                if (!day) {

                    return res.status(400).json({
                        message:
                            'Not enough capacity to confirm this registration.'
                    });

                }

            }


            if (status) {
                item.status = status;
            }


            item.people =
                newPeople;


            if (
                typeof checkedIn ===
                'boolean'
            ) {

                item.checkedIn =
                    checkedIn;

                item.checkedInAt =
                    checkedIn
                        ? new Date()
                        : undefined;

            }


            await item.save();


            return res.json({
                registration: item
            });

        } catch (error) {

            next(error);

        }

    }
);

/* =========================================================
   ADMIN DELETE REGISTRATION
========================================================= */

router.delete(
    '/admin/registrations/:id',
    requireAdmin,
    async (req, res, next) => {
        try {
            const item = await LangarRegistration.findById(req.params.id);

            if (!item) {
                return res.status(404).json({ message: 'Registration not found.' });
            }

            if (item.status === 'confirmed') {
                await LangarDay.findOneAndUpdate(
                    { date: item.date },
                    { $inc: { confirmedCount: -item.people } }
                );
            }

            await item.deleteOne();
            return res.json({ message: 'Registration deleted successfully.' });
        } catch (error) {
            next(error);
        }
    }
);


/* =========================================================
   ADMIN REPORTS
========================================================= */

router.get(
    '/admin/reports',
    requireAdmin,
    async (req, res, next) => {

        try {

            const match =
                req.query.month
                    ? {
                        date: {
                            $regex:
                                `^${req.query.month}`
                        }
                    }
                    : {};


            const report =
                await LangarRegistration.aggregate([

                    {
                        $match: match
                    },

                    {
                        $group: {

                            _id: '$date',

                            registrations: {
                                $sum: 1
                            },

                            confirmedMeals: {
                                $sum: {
                                    $cond: [
                                        {
                                            $eq: [
                                                '$status',
                                                'confirmed'
                                            ]
                                        },
                                        '$people',
                                        0
                                    ]
                                }
                            },

                            checkedInMeals: {
                                $sum: {
                                    $cond: [
                                        '$checkedIn',
                                        '$people',
                                        0
                                    ]
                                }
                            },

                            waitlisted: {
                                $sum: {
                                    $cond: [
                                        {
                                            $eq: [
                                                '$status',
                                                'waitlisted'
                                            ]
                                        },
                                        1,
                                        0
                                    ]
                                }
                            }

                        }

                    },

                    {
                        $sort: {
                            _id: 1
                        }
                    }

                ]);


            return res.json({
                report
            });

        } catch (error) {

            next(error);

        }

    }
);


export default router;
