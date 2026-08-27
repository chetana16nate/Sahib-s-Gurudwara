import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";

import {
  FaArrowLeft,
  FaCalendarAlt,
  FaUsers,
  FaCheckCircle,
  FaClock,
  FaChevronDown,
  FaSignOutAlt,
  FaUtensils,
  FaInfoCircle,
} from "react-icons/fa";

import "./LangarBooking.css";


const LangarBooking = () => {
  const navigate = useNavigate();

  /* =========================================================
     USER
  ========================================================= */

  const [user, setUser] = useState(null);

  const [showUserMenu, setShowUserMenu] =
    useState(false);


  /* =========================================================
     BOOKING STATE
  ========================================================= */

  const [langarDate, setLangarDate] = useState("");

  const [langarTime, setLangarTime] =
    useState("1:30 PM");

  const [numberOfPeople, setNumberOfPeople] =
    useState(1);

  const [availableSeats, setAvailableSeats] =
    useState(null);

  const [loadingAvailability, setLoadingAvailability] =
    useState(false);

  const [bookingLoading, setBookingLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] =
    useState("");


  /* =========================================================
     READ LOGGED-IN USER
  ========================================================= */

  useEffect(() => {
    try {
      const storedUser =
        localStorage.getItem("user");

      const token =
        localStorage.getItem("userToken");

      /*
       * If there is no user token,
       * send user to login.
       */

      if (!token) {
        navigate("/user/login", {
          replace: true,
        });

        return;
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

    } catch (err) {
      console.error(
        "Unable to read logged-in user:",
        err
      );

      navigate("/user/login", {
        replace: true,
      });
    }
  }, [navigate]);


  /* =========================================================
     USER NAME
  ========================================================= */

  const userName =
    user?.name ||
    user?.fullName ||
    user?.username ||
    "User";


  const userInitial =
    userName.charAt(0).toUpperCase();


  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {

    localStorage.removeItem("userToken");

    localStorage.removeItem("user");

    setShowUserMenu(false);

    navigate("/user/login", {
      replace: true,
    });
  };


  /* =========================================================
     DATE
  ========================================================= */

  const handleDateChange = async (e) => {

    const selectedDate =
      e.target.value;

    setLangarDate(selectedDate);

    setError("");

    setSuccessMessage("");

    setAvailableSeats(null);

    if (!selectedDate) {
      return;
    }

    setLoadingAvailability(true);

    try {
      const { data } = await api.get(
        `/langar/capacity?date=${selectedDate}`
      );

      setAvailableSeats(
        Number(data.remaining ?? data.availableSeats ?? 0)
      );

    } catch (err) {

      console.error(
        "Availability error:",
        err
      );

      setError(
        "Unable to check availability."
      );

    } finally {
      setLoadingAvailability(false);
    }
  };


  /* =========================================================
     NUMBER OF PEOPLE
  ========================================================= */

  const decreasePeople = () => {

    setNumberOfPeople((previous) =>
      Math.max(1, previous - 1)
    );
  };


  const increasePeople = () => {

    if (
      availableSeats !== null &&
      numberOfPeople >= availableSeats
    ) {
      return;
    }

    setNumberOfPeople(
      (previous) => previous + 1
    );
  };


  /* =========================================================
     BOOKING
  ========================================================= */

  const handleBooking = async () => {

    setError("");

    setSuccessMessage("");

    if (!langarDate) {
      setError(
        "Please select a Langar date."
      );

      return;
    }

    if (availableSeats === null) {
      setError(
        "Please wait for seat availability."
      );

      return;
    }

    if (numberOfPeople > availableSeats) {
      setError(
        "The selected number of people exceeds available seats."
      );

      return;
    }

    setBookingLoading(true);

    try {
      const { data } = await api.post("/langar/registrations", {
        fullName: userName,
        phone: user?.phone || user?.mobile || "",
        people: numberOfPeople,
        date: langarDate,
        time: langarTime,
        bookingType: numberOfPeople === 1 ? "individual" : "group",
        confirmed: true,
      });

      const booking = {
        ...data.registration,
        remainingSeats: data.capacity?.remaining,
      };

      localStorage.setItem(
        "lastLangarBooking",
        JSON.stringify(booking)
      );

      navigate("/user/booking-success", {
        state: { booking },
      });

    } catch (err) {

      console.error(
        "Booking error:",
        err
      );

      setError(
        err.response?.data?.message ||
        "Unable to complete Langar booking."
      );

      setBookingLoading(false);
    }
  };


  /* =========================================================
     FORMAT DATE
  ========================================================= */

  const formatDate = (date) => {

    if (!date) {
      return "Select a date";
    }

    const selected =
      new Date(
        `${date}T00:00:00`
      );

    return selected.toLocaleDateString(
      "en-GB",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };


  /* =========================================================
     MINIMUM DATE
  ========================================================= */

  const today =
    new Date()
      .toISOString()
      .split("T")[0];


  /* =========================================================
     LOADING USER
  ========================================================= */

  if (!user) {
    return null;
  }


  /* =========================================================
     JSX
  ========================================================= */

  return (
    <div className="langar-booking-page">


      {/* =====================================================
          TOP BAR
      ====================================================== */}

      <header className="langar-topbar">

        <div className="langar-topbar-inner">


          {/* DASHBOARD */}

          <button
            type="button"
            className="dashboard-back"
            onClick={() =>
              navigate("/dashboard")
            }
          >
            <FaArrowLeft />

            <span>
              Dashboard
            </span>
          </button>


          {/* BRAND */}

          <div className="langar-brand">

            <div className="langar-brand-symbol">
              ੴ
            </div>

            <div className="langar-brand-text">

              <strong>
                Sahib's Gurudwara
              </strong>

              <span>
                Langar Seva
              </span>

            </div>

          </div>


          {/* USER */}

          <div className="langar-user-wrapper">

            <button
              type="button"
              className="langar-user-button"
              onClick={() =>
                setShowUserMenu(
                  (previous) => !previous
                )
              }
              aria-expanded={showUserMenu}
            >

              <span className="langar-user-avatar">
                {userInitial}
              </span>

              <span className="langar-user-name">
                {userName}
              </span>

              <FaChevronDown
                className={
                  showUserMenu
                    ? "langar-user-arrow open"
                    : "langar-user-arrow"
                }
              />

            </button>


            {/* =================================================
                LOGOUT DROPDOWN
            ================================================== */}

            {showUserMenu && (

              <div className="langar-user-dropdown">


                <div className="langar-dropdown-user">

                  <div className="langar-dropdown-avatar">
                    {userInitial}
                  </div>

                  <div className="langar-dropdown-info">

                    <strong>
                      {userName}
                    </strong>

                    <span>
                      Langar Seva User
                    </span>

                  </div>

                </div>


                <div className="langar-dropdown-divider">
                </div>


                <button
                  type="button"
                  className="langar-logout-button"
                  onClick={handleLogout}
                >

                  <FaSignOutAlt />

                  <span>
                    Logout
                  </span>

                </button>

              </div>

            )}

          </div>

        </div>

      </header>


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="langar-main">


        {/* ===================================================
            PAGE HEADER
        ==================================================== */}

        <section className="langar-page-heading">

          <div className="langar-heading-icon">
            <FaUtensils />
          </div>

          <div>

            <span className="langar-eyebrow">
              LANGAR SEVA
            </span>

            <h1>
              Book Your Langar
            </h1>

            <p>
              Select your visit date and number of
              people. Availability will be shown
              automatically.
            </p>

          </div>

        </section>


        {/* ===================================================
            ERROR
        ==================================================== */}

        {error && (

          <div className="langar-error">
            <FaInfoCircle />
            {error}
          </div>

        )}


        {/* ===================================================
            SUCCESS
        ==================================================== */}

        {successMessage && (

          <div className="langar-success">
            <FaCheckCircle />
            {successMessage}
          </div>

        )}


        {/* ===================================================
            BOOKING GRID
        ==================================================== */}

        <div className="langar-booking-grid">


          {/* =================================================
              BOOKING CARD
          ================================================== */}

          <section className="langar-booking-card">


            <div className="booking-card-heading">

              <h2>
                Booking Details
              </h2>

              <p>
                Please select your preferred date.
              </p>

            </div>


            <div className="booking-divider">
            </div>


            {/* DATE */}

            <div className="booking-field">

              <label htmlFor="langar-date">
                <FaCalendarAlt />

                Langar Date
              </label>

              <div className="date-input-wrapper">

                <input
                  id="langar-date"
                  type="date"
                  value={langarDate}
                  min={today}
                  onChange={handleDateChange}
                />

              </div>

              <small>
                Select the date on which you will
                visit the Gurudwara.
              </small>

            </div>


            {/* LANGAR TIME */}

            <div className="booking-field">
              <label htmlFor="langar-time">
                <FaClock /> Langar Time
              </label>

              <div className="date-input-wrapper">
                <select
                  id="langar-time"
                  value={langarTime}
                  onChange={(event) => setLangarTime(event.target.value)}
                >
                  <option value="1:30 PM">Lunch — 1:30 PM</option>
                  <option value="7:00 PM">Dinner — 7:00 PM</option>
                </select>
              </div>

              <small>Choose the Langar serving you plan to attend.</small>
            </div>


            {/* =================================================
                AVAILABILITY
            ================================================== */}

            <div className="availability-box">

              <div className="availability-icon">
                <FaUsers />
              </div>

              <div className="availability-content">

                <span>
                  Seats Available
                </span>

                <strong>

                  {loadingAvailability
                    ? "Checking..."
                    : availableSeats !== null
                    ? availableSeats
                    : "—"}

                </strong>

              </div>

            </div>


            {/* NUMBER OF PEOPLE */}

            <div className="booking-field people-field">

              <label>
                <FaUsers />

                Number of People
              </label>


              <div className="people-counter">

                <button
                  type="button"
                  onClick={decreasePeople}
                  disabled={
                    numberOfPeople <= 1
                  }
                  aria-label="Decrease number of people"
                >
                  −
                </button>


                <span>
                  {numberOfPeople}
                </span>


                <button
                  type="button"
                  onClick={increasePeople}
                  disabled={
                    availableSeats !== null &&
                    numberOfPeople >= availableSeats
                  }
                  aria-label="Increase number of people"
                >
                  +
                </button>

              </div>


              <small>
                Maximum available seats for the
                selected date.
              </small>

            </div>


            {/* BOOKING BUTTON */}

            <button
              type="button"
              className="confirm-booking-button"
              onClick={handleBooking}
              disabled={
                bookingLoading ||
                !langarDate ||
                availableSeats === null ||
                numberOfPeople > availableSeats
              }
            >

              {bookingLoading ? (

                <>
                  <span className="booking-spinner">
                  </span>

                  Confirming Booking...
                </>

              ) : (

                <>
                  <FaCheckCircle />

                  Confirm Langar Booking
                </>

              )}

            </button>

          </section>


          {/* =================================================
              SUMMARY CARD
          ================================================== */}

          <aside className="langar-summary-card">

            <div className="summary-header">

              <div className="summary-icon">
                <FaUtensils />
              </div>

              <div>

                <span>
                  BOOKING SUMMARY
                </span>

                <h2>
                  Your Langar Visit
                </h2>

              </div>

            </div>


            <div className="summary-divider">
            </div>


            {/* DATE */}

            <div className="summary-row">

              <div className="summary-row-icon">
                <FaCalendarAlt />
              </div>

              <div>

                <small>
                  Date
                </small>

                <strong>
                  {formatDate(langarDate)}
                </strong>

              </div>

            </div>


            {/* TIME */}

            <div className="summary-row">
              <div className="summary-row-icon">
                <FaClock />
              </div>

              <div>
                <small>Langar Time</small>
                <strong>{langarTime}</strong>
              </div>
            </div>


            {/* PEOPLE */}

            <div className="summary-row">

              <div className="summary-row-icon">
                <FaUsers />
              </div>

              <div>

                <small>
                  Number of People
                </small>

                <strong>
                  {numberOfPeople}
                </strong>

              </div>

            </div>


            {/* AVAILABLE SEATS */}

            <div className="summary-row">

              <div className="summary-row-icon">
                <FaCheckCircle />
              </div>

              <div>

                <small>
                  Available Seats
                </small>

                <strong>
                  {availableSeats !== null
                    ? availableSeats
                    : "Select a date"}
                </strong>

              </div>

            </div>


            <div className="summary-divider">
            </div>


            {/* INFORMATION */}

            <div className="summary-notice">

              <FaClock />

              <span>
                Please arrive according to the
                Gurudwara's Langar schedule.
              </span>

            </div>


            {/* SPIRITUAL MESSAGE */}

            <div className="summary-spiritual">

              <span>
                ੴ
              </span>

              <strong>
                Sarbat Da Bhala
              </strong>

            </div>

          </aside>

        </div>


        {/* ===================================================
            INFORMATION CARDS
        ==================================================== */}

        <section className="langar-info-grid">


          <div className="langar-info-card">

            <FaCheckCircle />

            <div>

              <h3>
                Real-time availability
              </h3>

              <p>
                Seats are checked for your selected
                date before booking.
              </p>

            </div>

          </div>


          <div className="langar-info-card">

            <FaCheckCircle />

            <div>

              <h3>
                Booking confirmation
              </h3>

              <p>
                You will receive a unique booking
                number after confirmation.
              </p>

            </div>

          </div>


          <div className="langar-info-card">

            <FaCheckCircle />

            <div>

              <h3>
                Digital receipt
              </h3>

              <p>
                Your booking receipt can be viewed
                after successful booking.
              </p>

            </div>

          </div>


        </section>

      </main>


      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="langar-footer">

        <p>
          Sahib's Gurudwara • Langar Seva
        </p>

        <span>
          Sarbat Da Bhala 🙏
        </span>

      </footer>

    </div>
  );
};


export default LangarBooking;
