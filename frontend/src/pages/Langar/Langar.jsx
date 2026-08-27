import {
    useEffect,
    useState
} from 'react';

import {
    Heart,
    Users,
    Utensils,
    CheckCircle2,
    CalendarDays,
    Clock,
    Ticket,
    AlertCircle,
    LogIn
} from 'lucide-react';

import {
    Link,
    useNavigate
} from 'react-router-dom';

import { api } from '../../api';

import './Langar.css';


/* =========================================================
   HELPERS
========================================================= */

const today = () =>
    new Date()
        .toISOString()
        .slice(0, 10);


const initialForm = {
    fullName: '',
    phone: '',
    whatsapp: '',
    people: 1,
    date: today(),
    bookingType: 'individual',
    organization: '',
    specialRequirement: '',
    confirmed: false
};


/* =========================================================
   COMPONENT
========================================================= */

export default function Langar() {

    const navigate =
        useNavigate();


    const userToken =
        localStorage.getItem(
            'userToken'
        );


    const savedUser =
        JSON.parse(
            localStorage.getItem(
                'user'
            ) || 'null'
        );


    /* =====================================
       STATE
    ====================================== */

    const [capacity, setCapacity] =
        useState(null);

    const [form, setForm] =
        useState({
            ...initialForm,

            fullName:
                savedUser?.name || '',

            phone:
                savedUser?.phone || ''
        });

    const [result, setResult] =
        useState(null);

    const [error, setError] =
        useState('');

    const [loadingCapacity, setLoadingCapacity] =
        useState(false);

    const [submitting, setSubmitting] =
        useState(false);


    /* =====================================
       LOAD CAPACITY
    ====================================== */

    const loadCapacity =
        async (date) => {

            try {

                setLoadingCapacity(
                    true
                );

                setError('');

                const response =
                    await api.get(
                        '/langar/capacity',
                        {
                            params: {
                                date
                            }
                        }
                    );

                setCapacity(
                    response.data
                );

            } catch (requestError) {

                console.error(
                    requestError
                );

                setError(
                    'Unable to load availability. Please try again.'
                );

            } finally {

                setLoadingCapacity(
                    false
                );

            }

        };


    /* =====================================
       INITIAL LOAD
    ====================================== */

    useEffect(() => {

        loadCapacity(
            form.date
        );

    }, []);


    /* =====================================
       FORM UPDATE
    ====================================== */

    const update =
        (event) => {

            const {
                name,
                value,
                type,
                checked
            } = event.target;


            const nextValue =
                type === 'checkbox'
                    ? checked
                    : value;


            setForm(
                previous => ({
                    ...previous,

                    [name]:
                        nextValue
                })
            );


            setError('');


            /* -----------------------------
               DATE CHANGE
            ------------------------------ */

            if (
                name === 'date'
            ) {

                setResult(null);

                loadCapacity(
                    value
                );

            }

        };


    /* =====================================
       LOGIN CHECK
    ====================================== */

    const requireLogin =
        () => {

            if (!userToken) {

                navigate(
                    '/login',
                    {
                        state: {
                            from:
                                '/langar'
                        }
                    }
                );

                return false;

            }

            return true;

        };


    /* =====================================
       SUBMIT BOOKING
    ====================================== */

    const submit =
        async (event) => {

            event.preventDefault();

            setError('');
            setResult(null);


            if (!requireLogin()) {
                return;
            }


            /* -----------------------------
               Check capacity
            ------------------------------ */

            const requested =
                Number(
                    form.people
                );


            if (
                !Number.isInteger(
                    requested
                ) ||
                requested < 1
            ) {

                setError(
                    'Please enter a valid number of people.'
                );

                return;

            }


            if (
                capacity &&
                requested >
                capacity.remaining
            ) {

                setError(
                    `Only ${capacity.remaining} seats are currently available for ${form.date}.`
                );

                return;

            }


            try {

                setSubmitting(
                    true
                );


                const response =
                    await api.post(
                        '/langar/registrations',
                        {
                            ...form,

                            people:
                                requested
                        }
                    );


                setResult(
                    response.data
                );


                setCapacity(
                    response.data.capacity
                );


                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });

            } catch (requestError) {

                console.error(
                    requestError
                );


                if (
                    requestError.response
                        ?.status === 401
                ) {

                    localStorage.removeItem(
                        'userToken'
                    );

                    localStorage.removeItem(
                        'user'
                    );

                    navigate(
                        '/login'
                    );

                    return;

                }


                setError(
                    requestError.response
                        ?.data
                        ?.message ||
                    'We could not complete your booking. Please try again.'
                );

            } finally {

                setSubmitting(
                    false
                );

            }

        };


    /* =====================================
       CAPACITY
    ====================================== */

    const available =
        capacity?.remaining ?? 0;


    const percentage =
        capacity
            ? Math.min(
                100,
                (
                    capacity.confirmed /
                    capacity.capacity
                ) * 100
            )
            : 0;


    /* =====================================
       CONFIRMATION
    ====================================== */

    if (
        result?.registration
    ) {

        const registration =
            result.registration;


        const isConfirmed =
            registration.status ===
            'confirmed';


        const whatsappText =
            `Sahib's Gurudwara Langar Booking%0A%0ABooking Number: ${registration.reference}%0ADate: ${registration.date}%0APeople: ${registration.people}%0AStatus: ${registration.status}`;


        return (

            <div className="langar-page">

                <section className="langar-hero">

                    <div className="premium-container">

                        <span className="eyebrow">
                            Langar Booking
                        </span>

                        <h1>
                            {isConfirmed
                                ? 'Booking Confirmed 🙏'
                                : 'You Are On The Waitlist'}
                        </h1>

                        <p>
                            {isConfirmed
                                ? 'Your place at Langar has been successfully reserved.'
                                : 'Your request has been received and added to the Langar waitlist.'}
                        </p>

                    </div>

                </section>


                <section className="section-padding">

                    <div className="premium-container">

                        <div className="booking-confirmation-card">

                            <div className="booking-success-icon">

                                {isConfirmed ? (
                                    <CheckCircle2
                                        size={58}
                                    />
                                ) : (
                                    <AlertCircle
                                        size={58}
                                    />
                                )}

                            </div>


                            <span className="eyebrow">
                                Your Booking Number
                            </span>


                            <div className="booking-reference">

                                {registration.reference}

                            </div>


                            <p className="booking-reference-help">

                                Please save this number.
                                You can show it at the
                                Langar desk.

                            </p>


                            <div className="booking-details-grid">

                                <div>
                                    <span>Name</span>
                                    <strong>
                                        {registration.fullName}
                                    </strong>
                                </div>


                                <div>
                                    <span>Date</span>
                                    <strong>
                                        {registration.date}
                                    </strong>
                                </div>


                                <div>
                                    <span>People</span>
                                    <strong>
                                        {registration.people}
                                    </strong>
                                </div>


                                <div>
                                    <span>Type</span>
                                    <strong>
                                        {registration.bookingType}
                                    </strong>
                                </div>


                                <div>
                                    <span>Status</span>
                                    <strong
                                        className={
                                            isConfirmed
                                                ? 'status-confirmed'
                                                : 'status-waitlist'
                                        }
                                    >
                                        {registration.status}
                                    </strong>
                                </div>


                                <div>
                                    <span>Arrival</span>
                                    <strong>
                                        12:00 PM
                                    </strong>
                                </div>

                            </div>


                            <div className="booking-location">

                                <CalendarDays size={20} />

                                <div>

                                    <strong>
                                        Sahib's Gurudwara, Accra
                                    </strong>

                                    <span>
                                        Please arrive around
                                        12:00 PM.
                                    </span>

                                </div>

                            </div>


                            <div className="booking-actions">

                                <a
                                    href={`https://wa.me/?text=${whatsappText}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="btn-primary"
                                >
                                    Share on WhatsApp
                                </a>


                                <Link
                                    to="/my-bookings"
                                    className="btn-secondary"
                                >
                                    My Bookings
                                </Link>


                                <button
                                    type="button"
                                    className="btn-secondary"
                                    onClick={() => {
                                        setResult(null);

                                        setForm({
                                            ...initialForm,

                                            fullName:
                                                savedUser?.name || '',

                                            phone:
                                                savedUser?.phone || ''
                                        });

                                        loadCapacity(
                                            today()
                                        );
                                    }}
                                >
                                    New Booking
                                </button>

                            </div>

                        </div>

                    </div>

                </section>

            </div>

        );

    }


    /* =====================================
       MAIN PAGE
    ====================================== */

    return (

        <div className="langar-page">

            {/* =================================
                HERO
            ================================= */}

            <section className="langar-hero">

                <div className="premium-container">

                    <span className="eyebrow">
                        Free Community Meal
                    </span>

                    <h1>
                        Langar – A Meal Served With Love
                    </h1>

                    <p>
                        Everyone is welcome.
                        Sit together, share a meal,
                        and experience the spirit of Seva.
                    </p>


                    {!userToken && (

                        <div className="langar-login-notice">

                            <LogIn size={18} />

                            <span>
                                Please login to reserve
                                your Langar place.
                            </span>

                            <Link to="/login">
                                Login
                            </Link>

                        </div>

                    )}


                    <a
                        href="#register"
                        className="btn-primary"
                    >
                        Reserve Your Langar Place
                    </a>

                </div>

            </section>


            {/* =================================
                CAPACITY
            ================================= */}

            <section className="langar-intro section-padding">

                <div className="premium-container">

                    <div className="capacity-card">

                        <div className="capacity-content">

                            <span className="eyebrow">

                                Langar Availability

                            </span>


                            <div className="capacity-date">

                                <CalendarDays
                                    size={19}
                                />

                                <strong>
                                    {form.date}
                                </strong>

                            </div>


                            <h2>

                                {loadingCapacity

                                    ? 'Checking availability...'

                                    : capacity
                                        ? `${capacity.confirmed} / ${capacity.capacity} Meals Reserved`
                                        : 'Availability unavailable'

                                }

                            </h2>


                            <div className="progress">

                                <span
                                    style={{
                                        width:
                                            `${percentage}%`
                                    }}
                                />

                            </div>


                            <p
                                className={
                                    available > 0
                                        ? 'available'
                                        : 'full'
                                }
                            >

                                {loadingCapacity
                                    ? 'Please wait...'
                                    : available > 0
                                        ? `${available} Meals Available`
                                        : 'No seats available — waitlist is open.'}

                            </p>

                        </div>


                        <Utensils
                            size={56}
                            aria-hidden="true"
                        />

                    </div>


                    {/* INFO */}

                    <div className="welcome-grid">

                        <article>

                            <Users />

                            <h3>
                                Community
                            </h3>

                            <p>
                                Bring your family and
                                share a meal with the
                                community.
                            </p>

                        </article>


                        <article>

                            <Heart />

                            <h3>
                                Groups & Orphanages
                            </h3>

                            <p>
                                Community groups,
                                orphanages and charitable
                                organizations are welcome.
                            </p>

                        </article>


                        <article>

                            <CheckCircle2 />

                            <h3>
                                Everyone Is Welcome
                            </h3>

                            <p>
                                Anyone who needs a meal
                                is welcome. No one should
                                feel uncomfortable asking
                                for food.
                            </p>

                        </article>

                    </div>

                </div>

            </section>


            {/* =================================
                REGISTRATION
            ================================= */}

            <section
                id="register"
                className="langar-register section-padding"
            >

                <div className="premium-container registration-layout">

                    <div>

                        <span className="eyebrow">
                            Serve. Share. Belong.
                        </span>

                        <h2>
                            Reserve a place at Langar
                        </h2>

                        <p>
                            Let us know you are coming
                            so we can prepare a warm meal
                            for everyone.
                        </p>


                        <div className="group-callout">

                            <h3>
                                Bringing a Group?
                            </h3>

                            <p>
                                Orphanages, community
                                groups, charitable
                                organizations and families
                                are warmly welcome.
                            </p>

                            <button
                                type="button"
                                className="btn-secondary"
                                onClick={() =>
                                    document
                                        .querySelector(
                                            '[name="bookingType"]'
                                        )
                                        ?.focus()
                                }
                            >
                                Register a Group
                            </button>

                        </div>

                    </div>


                    {/* FORM */}

                    <div className="langar-form-wrap">

                        <form
                            onSubmit={submit}
                        >

                            <h3>
                                Registration Details
                            </h3>


                            {error && (

                                <div className="form-error">

                                    <AlertCircle
                                        size={18}
                                    />

                                    {error}

                                </div>

                            )}


                            {/* NAME */}

                            <label>

                                Full Name

                                <input
                                    required
                                    name="fullName"
                                    value={
                                        form.fullName
                                    }
                                    onChange={
                                        update
                                    }
                                    placeholder="Enter your full name"
                                />

                            </label>


                            {/* PHONE */}

                            <label>

                                Phone Number

                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    value={
                                        form.phone
                                    }
                                    onChange={
                                        update
                                    }
                                    placeholder="Enter your phone number"
                                />

                            </label>


                            {/* WHATSAPP */}

                            <label>

                                WhatsApp Number
                                <span>
                                    (optional)
                                </span>

                                <input
                                    name="whatsapp"
                                    type="tel"
                                    value={
                                        form.whatsapp
                                    }
                                    onChange={
                                        update
                                    }
                                    placeholder="WhatsApp number"
                                />

                            </label>


                            {/* PEOPLE + DATE */}

                            <div className="form-row">

                                <label>

                                    Number of People

                                    <input
                                        required
                                        name="people"
                                        min="1"
                                        max={
                                            Math.max(
                                                available,
                                                1
                                            )
                                        }
                                        type="number"
                                        value={
                                            form.people
                                        }
                                        onChange={
                                            update
                                        }
                                    />

                                </label>


                                <label>

                                    Preferred Date

                                    <input
                                        required
                                        name="date"
                                        min={today()}
                                        type="date"
                                        value={
                                            form.date
                                        }
                                        onChange={
                                            update
                                        }
                                    />

                                </label>

                            </div>


                            {/* LIVE AVAILABILITY */}

                            <div className="selected-date-availability">

                                <CalendarDays
                                    size={20}
                                />

                                <div>

                                    <strong>
                                        {form.date}
                                    </strong>

                                    <span>

                                        {loadingCapacity

                                            ? 'Checking seats...'

                                            : `${available} seats available`}

                                    </span>

                                </div>

                            </div>


                            {/* BOOKING TYPE */}

                            <label>

                                Individual / Family / Group

                                <select
                                    required
                                    name="bookingType"
                                    value={
                                        form.bookingType
                                    }
                                    onChange={
                                        update
                                    }
                                >

                                    <option value="individual">
                                        Individual
                                    </option>

                                    <option value="family">
                                        Family
                                    </option>

                                    <option value="group">
                                        Group
                                    </option>

                                </select>

                            </label>


                            {/* ORGANIZATION */}

                            {form.bookingType ===
                                'group' && (

                                <label>

                                    Organization /
                                    Orphanage Name

                                    <span>
                                        (optional)
                                    </span>

                                    <input
                                        name="organization"
                                        value={
                                            form.organization
                                        }
                                        onChange={
                                            update
                                        }
                                        placeholder="Organization name"
                                    />

                                </label>

                            )}


                            {/* SPECIAL REQUIREMENT */}

                            <label>

                                Special Requirement
                                <span>
                                    (optional)
                                </span>

                                <textarea
                                    name="specialRequirement"
                                    rows="3"
                                    value={
                                        form.specialRequirement
                                    }
                                    onChange={
                                        update
                                    }
                                    placeholder="Any special requirement?"
                                />

                            </label>


                            {/* CONFIRM */}

                            <label className="check">

                                <input
                                    required
                                    name="confirmed"
                                    type="checkbox"
                                    checked={
                                        form.confirmed
                                    }
                                    onChange={
                                        update
                                    }
                                />

                                <span>
                                    I understand this is
                                    a free community meal
                                    and will let the
                                    Gurudwara know if my
                                    plans change.
                                </span>

                            </label>


                            {/* BUTTON */}

                            <button
                                className="btn-primary"
                                type="submit"
                                disabled={
                                    submitting ||
                                    loadingCapacity ||
                                    available < Number(form.people)
                                }
                            >

                                {submitting
                                    ? 'Confirming Booking...'
                                    : available >=
                                        Number(form.people)
                                        ? 'Confirm My Place'
                                        : 'Not Enough Seats'}

                            </button>


                            <div className="form-help">

                                <Clock size={16} />

                                <span>
                                    Suggested arrival:
                                    12:00 PM
                                </span>

                            </div>

                        </form>

                    </div>

                </div>

            </section>

        </div>

    );

}