import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CheckCircle,
    CalendarDays,
    Users,
    Ticket,
    Download,
    Printer,
    LayoutDashboard,
    ListChecks,
    Share2,
    ArrowLeft,
    MapPin,
    Clock,
    Copy,
    Check,
    Utensils,
} from "lucide-react";

import "./BookingSuccess.css";


export default function BookingSuccess() {

    const location = useLocation();
    const navigate = useNavigate();


    // ======================================================
    // STATE
    // ======================================================

    const [booking, setBooking] = useState(null);

    const [copied, setCopied] = useState(false);

    const [shareMessage, setShareMessage] =
        useState("");


    // ======================================================
    // LOAD BOOKING
    // ======================================================

    useEffect(() => {

        /*
         * First priority:
         * Booking passed through React Router
         */

        if (location.state?.booking) {

            setBooking(
                location.state.booking
            );

            /*
             * Also save it locally so the page
             * can survive a refresh.
             */

            localStorage.setItem(
                "lastLangarBooking",
                JSON.stringify(
                    location.state.booking
                )
            );

            return;
        }


        /*
         * Fallback:
         * Load booking from localStorage
         */

        const savedBooking =
            localStorage.getItem(
                "lastLangarBooking"
            );


        if (savedBooking) {

            try {

                setBooking(
                    JSON.parse(savedBooking)
                );

            } catch (error) {

                console.error(
                    "Unable to load booking:",
                    error
                );

            }

        }

    }, [location.state]);


    // ======================================================
    // USER
    // ======================================================

    const getUser = () => {

        const savedUser =
            localStorage.getItem("user");


        if (!savedUser) {

            return null;

        }


        try {

            return JSON.parse(
                savedUser
            );

        } catch {

            return null;

        }

    };


    const user = getUser();


    // ======================================================
    // FORMAT DATE
    // ======================================================

    const formatDate = (date) => {

        if (!date) {

            return "Not available";

        }


        try {

            const dateObject =
                new Date(
                    `${date}T00:00:00`
                );


            return dateObject.toLocaleDateString(
                "en-IN",
                {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                }
            );

        } catch {

            return date;

        }

    };


    // ======================================================
    // BOOKING NUMBER
    // ======================================================

    const bookingNumber =
        booking?.bookingNumber ||
        booking?.bookingId ||
        booking?.referenceNumber ||
        booking?.reference ||
        booking?._id ||
        "N/A";


    // ======================================================
    // BOOKING DATE
    // ======================================================

    const bookingDate =
        booking?.date ||
        booking?.bookingDate ||
        "";


    // ======================================================
    // PEOPLE
    // ======================================================

    const numberOfPeople =
        booking?.numberOfPeople ??
        booking?.people ??
        booking?.guests ??
        1;

    const bookingTime =
        booking?.time ||
        booking?.bookingTime ||
        booking?.langarTime ||
        "Not recorded";


    // ======================================================
    // STATUS
    // ======================================================

    const bookingStatus =
        booking?.status ||
        "CONFIRMED";


    // ======================================================
    // COPY BOOKING NUMBER
    // ======================================================

    const copyBookingNumber = async () => {

        try {

            await navigator.clipboard.writeText(
                String(bookingNumber)
            );

            setCopied(true);

            setTimeout(() => {

                setCopied(false);

            }, 2000);

        } catch (error) {

            console.error(
                "Unable to copy booking number:",
                error
            );

        }

    };


    // ======================================================
    // PRINT RECEIPT
    // ======================================================

    const printReceipt = () => {

        window.print();

    };


    // ======================================================
    // DOWNLOAD RECEIPT
    // ======================================================

    const downloadReceipt = () => {

        window.print();

    };


    // ======================================================
    // SHARE BOOKING
    // ======================================================

    const shareBooking = async () => {

        const text =
            `Sahib's Gurudwara Langar Booking\n\n` +
            `Booking No: ${bookingNumber}\n` +
            `Date: ${formatDate(bookingDate)}\n` +
            `Time: ${bookingTime}\n` +
            `People: ${numberOfPeople}\n` +
            `Status: ${bookingStatus}\n\n` +
            `Sarbat Da Bhala 🙏`;


        try {

            if (
                navigator.share
            ) {

                await navigator.share({
                    title:
                        "Langar Booking Confirmation",
                    text,
                });

                return;

            }


            /*
             * Fallback for browsers
             * without Web Share API.
             */

            await navigator.clipboard.writeText(
                text
            );

            setShareMessage(
                "Booking details copied to clipboard."
            );


            setTimeout(() => {

                setShareMessage("");

            }, 3000);

        } catch (error) {

            console.error(
                "Share failed:",
                error
            );

        }

    };


    // ======================================================
    // GO TO DASHBOARD
    // ======================================================

    const goToDashboard = () => {

        navigate(
            "/user/dashboard"
        );

    };


    // ======================================================
    // MY BOOKINGS
    // ======================================================

    const goToMyBookings = () => {

        navigate(
            "/user/my-bookings"
        );

    };


    // ======================================================
    // NO BOOKING FOUND
    // ======================================================

    if (!booking) {

        return (

            <div className="booking-success-page">

                <div className="booking-not-found">

                    <div className="booking-not-found-icon">

                        <Ticket size={32} />

                    </div>


                    <h1>
                        Booking Not Found
                    </h1>


                    <p>
                        We could not find your Langar
                        booking details. Please check
                        your booking history.
                    </p>


                    <div className="booking-not-found-actions">

                        <button
                            type="button"
                            onClick={
                                goToMyBookings
                            }
                            className="primary-success-button"
                        >

                            <ListChecks size={18} />

                            My Bookings

                        </button>


                        <button
                            type="button"
                            onClick={
                                goToDashboard
                            }
                            className="secondary-success-button"
                        >

                            <LayoutDashboard
                                size={18}
                            />

                            Dashboard

                        </button>

                    </div>

                </div>

            </div>

        );

    }


    // ======================================================
    // MAIN UI
    // ======================================================

    return (

        <div className="booking-success-page">


            {/* ==================================================
                TOP HEADER
            ================================================== */}

            <header className="booking-success-header">

                <div className="booking-success-header-inner">


                    {/* BACK */}

                    <button
                        type="button"
                        className="success-back-button"
                        onClick={
                            goToDashboard
                        }
                    >

                        <ArrowLeft size={18} />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    {/* BRAND */}

                    <div className="success-brand">

                        <div className="success-brand-symbol">
                            ੴ
                        </div>

                        <div>

                            <strong>
                                Sahib's Gurudwara
                            </strong>

                            <span>
                                Langar Seva
                            </span>

                        </div>

                    </div>


                    {/* USER */}

                    <div className="success-user">

                        <div className="success-user-avatar">

                            {(
                                user?.name ||
                                "S"
                            )
                                .charAt(0)
                                .toUpperCase()}

                        </div>

                        <span>
                            {user?.name ||
                                "Sangat Ji"}
                        </span>

                    </div>

                </div>

            </header>


            {/* ==================================================
                MAIN
            ================================================== */}

            <main className="booking-success-main">

                <div className="booking-success-container">


                    {/* ==================================================
                        SUCCESS HERO
                    ================================================== */}

                    <section className="success-hero">

                        <div className="success-check-circle">

                            <CheckCircle
                                size={48}
                            />

                        </div>


                        <p className="success-eyebrow">
                            LANGAR SEVA
                        </p>


                        <h1>
                            Booking Confirmed!
                        </h1>


                        <p>
                            Your Langar booking has been
                            successfully confirmed.
                            {typeof booking?.remainingSeats === "number" &&
                                ` ${booking.remainingSeats} seat${booking.remainingSeats === 1 ? "" : "s"} remain for this date.`}
                        </p>

                    </section>


                    {/* ==================================================
                        RECEIPT CARD
                    ================================================== */}

                    <section
                        className="langar-receipt"
                        id="langar-receipt"
                    >


                        {/* RECEIPT HEADER */}

                        <div className="receipt-header">

                            <div className="receipt-gurdwara">

                                <div className="receipt-symbol">
                                    ੴ
                                </div>

                                <div>

                                    <h2>
                                        Sahib's Gurudwara
                                    </h2>

                                    <p>
                                        Langar Seva Booking
                                    </p>

                                </div>

                            </div>


                            <div className="receipt-status">

                                <CheckCircle
                                    size={17}
                                />

                                <span>
                                    {bookingStatus}
                                </span>

                            </div>

                        </div>


                        <div className="receipt-line" />


                        {/* BOOKING NUMBER */}

                        <div className="booking-number-section">

                            <span>
                                BOOKING NUMBER
                            </span>


                            <div className="booking-number-row">

                                <strong>
                                    {bookingNumber}
                                </strong>


                                <button
                                    type="button"
                                    onClick={
                                        copyBookingNumber
                                    }
                                    className="copy-booking-button"
                                    title="Copy booking number"
                                >

                                    {copied ? (

                                        <Check
                                            size={17}
                                        />

                                    ) : (

                                        <Copy
                                            size={17}
                                        />

                                    )}

                                </button>

                            </div>


                            {copied && (

                                <small>
                                    Booking number copied.
                                </small>

                            )}

                        </div>


                        <div className="receipt-line" />


                        {/* BOOKING DETAILS */}

                        <div className="receipt-details">


                            {/* DATE */}

                            <div className="receipt-detail">

                                <div className="receipt-detail-icon">

                                    <CalendarDays
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <span>
                                        Langar Date
                                    </span>

                                    <strong>
                                        {formatDate(
                                            bookingDate
                                        )}
                                    </strong>

                                </div>

                            </div>


                            {/* TIME */}

                            <div className="receipt-detail">
                                <div className="receipt-detail-icon">
                                    <Clock size={19} />
                                </div>
                                <div>
                                    <span>Langar Time</span>
                                    <strong>{bookingTime}</strong>
                                </div>
                            </div>


                            {/* PEOPLE */}

                            <div className="receipt-detail">

                                <div className="receipt-detail-icon">

                                    <Users
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <span>
                                        Number of People
                                    </span>

                                    <strong>
                                        {numberOfPeople}
                                        {" "}
                                        {Number(
                                            numberOfPeople
                                        ) === 1
                                            ? "Person"
                                            : "People"}
                                    </strong>

                                </div>

                            </div>


                            {/* USER */}

                            <div className="receipt-detail">

                                <div className="receipt-detail-icon">

                                    <Ticket
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <span>
                                        Booked For
                                    </span>

                                    <strong>
                                        {user?.name ||
                                            booking?.name ||
                                            "Sangat Ji"}
                                    </strong>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="receipt-detail">

                                <div className="receipt-detail-icon">

                                    <CheckCircle
                                        size={19}
                                    />

                                </div>

                                <div>

                                    <span>
                                        Booking Status
                                    </span>

                                    <strong className="confirmed-text">
                                        {bookingStatus}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        <div className="receipt-line" />


                        {/* LOCATION */}

                        <div className="receipt-location">

                            <MapPin size={19} />

                            <div>

                                <strong>
                                    Sahib's Gurudwara
                                </strong>

                                <span>
                                    Accra, Ghana
                                </span>

                            </div>

                        </div>


                        {/* ARRIVAL */}

                        <div className="receipt-arrival">

                            <Clock size={17} />

                            <span>
                                Please arrive according
                                to the Gurudwara's Langar
                                schedule.
                            </span>

                        </div>


                        {/* RECEIPT FOOTER */}

                        <div className="receipt-footer">

                            <div className="receipt-footer-symbol">
                                ੴ
                            </div>

                            <div>

                                <strong>
                                    Sarbat Da Bhala
                                </strong>

                                <span>
                                    May all beings be blessed
                                    and well.
                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        SHARE MESSAGE
                    ================================================== */}

                    {shareMessage && (

                        <div className="share-message">

                            <Check size={17} />

                            {shareMessage}

                        </div>

                    )}


                    {/* ==================================================
                        ACTION BUTTONS
                    ================================================== */}

                    <div className="success-actions">


                        <button
                            type="button"
                            className="success-primary-action"
                            onClick={
                                downloadReceipt
                            }
                        >

                            <Download size={18} />

                            Download / Save Receipt

                        </button>


                        <button
                            type="button"
                            className="success-secondary-action"
                            onClick={
                                printReceipt
                            }
                        >

                            <Printer size={18} />

                            Print Receipt

                        </button>


                        <button
                            type="button"
                            className="success-secondary-action"
                            onClick={
                                shareBooking
                            }
                        >

                            <Share2 size={18} />

                            Share Booking

                        </button>

                    </div>


                    {/* ==================================================
                        NAVIGATION
                    ================================================== */}

                    <div className="success-navigation">

                        <button
                            type="button"
                            onClick={
                                goToMyBookings
                            }
                        >

                            <ListChecks size={17} />

                            View My Bookings

                        </button>


                        <button
                            type="button"
                            onClick={
                                goToDashboard
                            }
                        >

                            <LayoutDashboard
                                size={17}
                            />

                            Go to Dashboard

                        </button>

                    </div>


                    {/* ==================================================
                        IMPORTANT NOTE
                    ================================================== */}

                    <div className="success-important-note">

                        <Utensils size={20} />

                        <div>

                            <strong>
                                Please keep your booking
                                number safe.
                            </strong>

                            <p>
                                You can use{" "}
                                <strong>
                                    {bookingNumber}
                                </strong>
                                {" "}
                                to identify your Langar
                                booking when contacting
                                the Gurudwara.
                            </p>

                        </div>

                    </div>

                </div>

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <footer className="booking-success-footer">

                <p>
                    Sahib's Gurudwara • Langar Seva
                </p>

                <span>
                    Sarbat Da Bhala 🙏
                </span>

            </footer>

        </div>

    );
}
