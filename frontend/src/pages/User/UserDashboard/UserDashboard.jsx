import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    CalendarDays,
    ClipboardList,
    Utensils,
    Heart,
    LogOut,
    User,
    ArrowRight,
    Clock,
    CheckCircle,
    Menu,
    X
} from "lucide-react";

import "./UserDashboard.css";

export default function UserDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // =====================================================
    // LOAD LOGGED-IN USER
    // =====================================================

    useEffect(() => {

        const savedUser = localStorage.getItem("user");

        const userToken = localStorage.getItem("userToken");

        // If there is no user token,
        // send user back to login.

        if (!userToken) {

            navigate("/user/login", {
                replace: true
            });

            return;
        }

        // Load user information

        if (savedUser) {

            try {

                const parsedUser =
                    JSON.parse(savedUser);

                setUser(parsedUser);

            } catch (error) {

                console.error(
                    "Unable to read user data:",
                    error
                );

            }

        }

    }, [navigate]);


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        localStorage.removeItem("userToken");

        localStorage.removeItem("user");

        setMobileMenuOpen(false);

        navigate("/user/login", {
            replace: true
        });

    };


    // =====================================================
    // USER NAME
    // =====================================================

    const userName =
        user?.name ||
        user?.fullName ||
        "Sangat Ji";


    // =====================================================
    // INITIAL
    // =====================================================

    const userInitial =
        userName
            .charAt(0)
            .toUpperCase();


    return (

        <div className="user-dashboard">

            {/* =================================================
                HEADER
            ================================================= */}

            <header className="user-dashboard-header">

                <div className="dashboard-header-inner">

                    {/* LOGO */}

                    <Link
                        to="/user/dashboard"
                        className="dashboard-logo"
                    >

                        <div className="dashboard-logo-symbol">
                            ੴ
                        </div>

                        <div className="dashboard-logo-text">

                            <strong>
                                Sahib's Gurudwara
                            </strong>

                            <span>
                                Langar Seva
                            </span>

                        </div>

                    </Link>


                    {/* DESKTOP NAVIGATION */}

                    <nav className="dashboard-navigation">

                        <Link
                            to="/user/dashboard"
                            className="dashboard-nav-link active"
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/langar"
                            className="dashboard-nav-link"
                        >
                            Book Langar
                        </Link>

                        <Link
                            to="/user/my-bookings"
                            className="dashboard-nav-link"
                        >
                            My Bookings
                        </Link>

                    </nav>


                    {/* USER AREA */}

                    <div className="dashboard-user-area">

                        <div className="dashboard-user-info">

                            <div className="dashboard-user-avatar">
                                {userInitial}
                            </div>

                            <div className="dashboard-user-name">
                                {userName}
                            </div>

                        </div>

                        <button
                            type="button"
                            className="dashboard-logout-button"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>

                    </div>


                    {/* MOBILE MENU BUTTON */}

                    <button
                        type="button"
                        className="dashboard-mobile-button"
                        onClick={() =>
                            setMobileMenuOpen(
                                !mobileMenuOpen
                            )
                        }
                        aria-label="Open menu"
                    >

                        {mobileMenuOpen ? (
                            <X size={25} />
                        ) : (
                            <Menu size={25} />
                        )}

                    </button>

                </div>


                {/* MOBILE NAVIGATION */}

                {mobileMenuOpen && (

                    <div className="dashboard-mobile-menu">

                        <Link
                            to="/user/dashboard"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            Dashboard
                        </Link>

                        <Link
                            to="/langar"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            Book Langar
                        </Link>

                        <Link
                            to="/user/my-bookings"
                            onClick={() =>
                                setMobileMenuOpen(false)
                            }
                        >
                            My Bookings
                        </Link>

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            <LogOut size={17} />
                            Logout
                        </button>

                    </div>

                )}

            </header>


            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <main className="user-dashboard-main">

                <div className="dashboard-content">


                    {/* =================================================
                        WELCOME SECTION
                    ================================================= */}

                    <section className="dashboard-welcome">

                        <div>

                            <p className="welcome-small">
                                ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ
                                ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ
                            </p>

                            <h1>
                                Welcome, {userName} 🙏
                            </h1>

                            <p className="welcome-description">
                                May your visit to Sahib's
                                Gurudwara be filled with
                                peace, seva and blessings.
                            </p>

                        </div>


                        <div className="welcome-icon">
                            <Heart size={38} />
                        </div>

                    </section>


                    {/* =================================================
                        QUICK ACTIONS
                    ================================================= */}

                    <section className="dashboard-section">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Manage your Langar
                                    seva and bookings.
                                </p>

                            </div>

                        </div>


                        <div className="quick-action-grid">


                            {/* BOOK LANGAR */}

                            <Link
                                to="/langar"
                                className="quick-action-card primary"
                            >

                                <div className="quick-action-icon">
                                    <Utensils size={27} />
                                </div>

                                <div className="quick-action-content">

                                    <h3>
                                        Book Langar
                                    </h3>

                                    <p>
                                        Select your visit
                                        date and reserve
                                        Langar seats.
                                    </p>

                                </div>

                                <ArrowRight
                                    className="quick-action-arrow"
                                    size={20}
                                />

                            </Link>


                            {/* MY BOOKINGS */}

                            <Link
                                to="/user/my-bookings"
                                className="quick-action-card"
                            >

                                <div className="quick-action-icon">
                                    <ClipboardList size={27} />
                                </div>

                                <div className="quick-action-content">

                                    <h3>
                                        My Bookings
                                    </h3>

                                    <p>
                                        View your Langar
                                        bookings and
                                        receipts.
                                    </p>

                                </div>

                                <ArrowRight
                                    className="quick-action-arrow"
                                    size={20}
                                />

                            </Link>


                            {/* PROFILE */}

                            <div
                                className="quick-action-card"
                                onClick={() =>
                                    window.scrollTo({
                                        top: document.body
                                            .scrollHeight,
                                        behavior: "smooth"
                                    })
                                }
                            >

                                <div className="quick-action-icon">
                                    <User size={27} />
                                </div>

                                <div className="quick-action-content">

                                    <h3>
                                        My Profile
                                    </h3>

                                    <p>
                                        Your registered
                                        account information.
                                    </p>

                                </div>

                                <ArrowRight
                                    className="quick-action-arrow"
                                    size={20}
                                />

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        INFORMATION CARDS
                    ================================================= */}

                    <section className="dashboard-section">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Langar Seva
                                </h2>

                                <p>
                                    Information for your
                                    upcoming visit.
                                </p>

                            </div>

                        </div>


                        <div className="info-card-grid">


                            {/* DATE */}

                            <div className="info-card">

                                <div className="info-card-icon">
                                    <CalendarDays size={25} />
                                </div>

                                <div>

                                    <span>
                                        Visit Date
                                    </span>

                                    <strong>
                                        Select a date
                                    </strong>

                                </div>

                            </div>


                            {/* TIME */}

                            <div className="info-card">

                                <div className="info-card-icon">
                                    <Clock size={25} />
                                </div>

                                <div>

                                    <span>
                                        Langar Timing
                                    </span>

                                    <strong>
                                        As per Gurudwara
                                        schedule
                                    </strong>

                                </div>

                            </div>


                            {/* STATUS */}

                            <div className="info-card">

                                <div className="info-card-icon">
                                    <CheckCircle size={25} />
                                </div>

                                <div>

                                    <span>
                                        Booking Status
                                    </span>

                                    <strong>
                                        No active booking
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>


                    {/* =================================================
                        SEVA MESSAGE
                    ================================================= */}

                    <section className="seva-message">

                        <div className="seva-symbol">
                            ੴ
                        </div>

                        <div className="seva-content">

                            <h2>
                                Sarbat Da Bhala
                            </h2>

                            <p>
                                May everyone be blessed with
                                peace, prosperity and
                                wellbeing.
                            </p>

                        </div>

                    </section>


                    {/* =================================================
                        PROFILE INFORMATION
                    ================================================= */}

                    <section className="dashboard-profile">

                        <div className="section-heading">

                            <div>

                                <h2>
                                    Account Information
                                </h2>

                                <p>
                                    Your registered details.
                                </p>

                            </div>

                        </div>


                        <div className="profile-card">

                            <div className="profile-avatar">
                                {userInitial}
                            </div>


                            <div className="profile-details">

                                <div className="profile-item">

                                    <span>
                                        Name
                                    </span>

                                    <strong>
                                        {userName}
                                    </strong>

                                </div>


                                <div className="profile-item">

                                    <span>
                                        Email
                                    </span>

                                    <strong>
                                        {user?.email ||
                                            "Not available"}
                                    </strong>

                                </div>


                                <div className="profile-item">

                                    <span>
                                        Phone
                                    </span>

                                    <strong>
                                        {user?.phone ||
                                            "Not available"}
                                    </strong>

                                </div>

                            </div>

                        </div>

                    </section>


                </div>

            </main>


            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="user-dashboard-footer">

                <p>
                    © {new Date().getFullYear()} Sahib's
                    Gurudwara. Langar Seva.
                </p>

                <p>
                    Sarbat Da Bhala 🙏
                </p>

            </footer>

        </div>
    );
}