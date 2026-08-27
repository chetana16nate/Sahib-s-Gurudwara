import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("userToken");

      if (!token) {
        navigate("/user/login");
        return;
      }

      const response = await api.get("/langar/my-bookings");

      setBookings(response.data.bookings || response.data || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);

      if (err.response?.status === 401) {
        localStorage.removeItem("userToken");
        navigate("/user/login");
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load your bookings. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleViewBooking = (booking) => {
    setSelectedBooking(booking);
  };

  const closeModal = () => {
    setSelectedBooking(null);
  };

  const handleCancelBooking = async (bookingId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?"
    );

    if (!confirmed) return;

    try {
      await api.patch(`/langar/my-bookings/${bookingId}/cancel`);

      alert("Booking cancelled successfully.");
      fetchMyBookings();
    } catch (err) {
      console.error("Cancellation error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to cancel the booking. Please try again."
      );
    }
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed":
        return "status-confirmed";

      case "cancelled":
      case "canceled":
        return "status-cancelled";

      case "completed":
        return "status-completed";

      case "pending":
        return "status-pending";

      default:
        return "status-default";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Confirmed";

    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  const isFutureBooking = (date) => {
    if (!date) return false;

    const bookingDate = new Date(date);
    const today = new Date();

    today.setHours(0, 0, 0, 0);
    bookingDate.setHours(0, 0, 0, 0);

    return bookingDate >= today;
  };

  if (loading) {
    return (
      <div className="my-bookings-page">
        <div className="bookings-loading">
          <div className="loading-spinner"></div>
          <h3>Loading your bookings...</h3>
          <p>Please wait a moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="my-bookings-page">
      {/* Header */}
      <section className="my-bookings-header">
        <div className="header-content">
          <div className="header-icon">🙏</div>

          <div>
            <p className="header-small-title">SEVA • LANGAR</p>

            <h1>My Bookings</h1>

            <p>
              View and manage your Langar bookings in one place.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="my-bookings-container">
        {/* Top Summary */}
        <div className="booking-summary">
          <div className="summary-card">
            <div className="summary-icon">📋</div>

            <div>
              <span>Total Bookings</span>
              <strong>{bookings.length}</strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🙏</div>

            <div>
              <span>Upcoming</span>
              <strong>
                {
                  bookings.filter(
                    (booking) =>
                      booking.status?.toLowerCase() !== "cancelled" &&
                      booking.status?.toLowerCase() !== "canceled" &&
                      isFutureBooking(booking.bookingDate || booking.date)
                  ).length
                }
              </strong>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">🎟️</div>

            <div>
              <span>Total Seats</span>
              <strong>
                {bookings.reduce(
                  (total, booking) =>
                    total +
                    Number(
                      booking.people ||
                        booking.numberOfPeople ||
                        booking.seats ||
                        booking.guests ||
                        0
                    ),
                  0
                )}
              </strong>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="booking-error">
            <span>⚠️</span>
            <div>
              <strong>Something went wrong</strong>
              <p>{error}</p>
            </div>

            <button onClick={fetchMyBookings}>Retry</button>
          </div>
        )}

        {/* No Bookings */}
        {!error && bookings.length === 0 && (
          <div className="no-bookings">
            <div className="empty-icon">🙏</div>

            <h2>No Bookings Yet</h2>

            <p>
              You haven't made any Langar bookings yet.
              Book your Langar seva and your booking details will
              appear here.
            </p>

            <button
              className="primary-btn"
              onClick={() => navigate("/user/langar-booking")}
            >
              Book Langar
            </button>
          </div>
        )}

        {/* Booking List */}
        {!error && bookings.length > 0 && (
          <div className="booking-section">
            <div className="section-heading">
              <div>
                <h2>Your Langar Bookings</h2>
                <p>Keep your booking number handy for verification.</p>
              </div>

              <button
                className="new-booking-btn"
                onClick={() => navigate("/user/langar-booking")}
              >
                + New Booking
              </button>
            </div>

            <div className="booking-list">
              {bookings.map((booking) => {
                const bookingDate =
                  booking.bookingDate || booking.date;

                const seats =
                  booking.people ||
                  booking.numberOfPeople ||
                  booking.seats ||
                  booking.guests ||
                  0;

                const status = booking.status || "confirmed";

                return (
                  <div className="booking-card" key={booking._id}>
                    {/* Booking Card Header */}
                    <div className="booking-card-top">
                      <div>
                        <span className="booking-label">
                          BOOKING NUMBER
                        </span>

                        <h3>
                          {booking.reference ||
                            booking.bookingNumber ||
                            booking.bookingId ||
                            booking._id?.slice(-8).toUpperCase()}
                        </h3>
                      </div>

                      <span
                        className={`booking-status ${getStatusClass(
                          status
                        )}`}
                      >
                        <span className="status-dot"></span>
                        {getStatusText(status)}
                      </span>
                    </div>

                    {/* Booking Details */}
                    <div className="booking-details">
                      <div className="detail-item">
                        <span className="detail-icon">📅</span>

                        <div>
                          <small>Langar Date</small>
                          <strong>{formatDate(bookingDate)}</strong>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">👥</span>

                        <div>
                          <small>Number of People</small>
                          <strong>
                            {seats} {seats === 1 ? "Person" : "People"}
                          </strong>
                        </div>
                      </div>

                      <div className="detail-item">
                        <span className="detail-icon">🕐</span>

                        <div>
                          <small>Langar Time</small>
                          <strong>{booking.time || booking.bookingTime || "Not recorded"}</strong>
                        </div>
                      </div>
                    </div>

                    {/* User Information */}
                    <div className="booking-user-info">
                      <div>
                        <span>Name</span>
                        <strong>
                          {booking.name ||
                            booking.fullName ||
                            booking.user?.name ||
                            "N/A"}
                        </strong>
                      </div>

                      <div>
                        <span>Phone</span>
                        <strong>
                          {booking.phone ||
                            booking.mobile ||
                            booking.user?.phone ||
                            "N/A"}
                        </strong>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="booking-actions">
                      <button
                        className="view-btn"
                        onClick={() => handleViewBooking(booking)}
                      >
                        👁 View Details
                      </button>

                      {status?.toLowerCase() !== "cancelled" &&
                        status?.toLowerCase() !== "canceled" &&
                        isFutureBooking(bookingDate) && (
                          <button
                            className="cancel-btn"
                            onClick={() =>
                              handleCancelBooking(booking._id)
                            }
                          >
                            Cancel Booking
                          </button>
                        )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      {/* Booking Details Modal */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="booking-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={closeModal}>
              ×
            </button>

            <div className="receipt-header">
              <div className="receipt-symbol">🙏</div>

              <h2>Sahib's Gurudwara</h2>

              <p>Langar Booking Receipt</p>
            </div>

            <div className="success-message">
              <div>✓</div>

              <div>
                <strong>
                  {selectedBooking.status?.toLowerCase() ===
                    "cancelled" ||
                  selectedBooking.status?.toLowerCase() ===
                    "canceled"
                    ? "Booking Cancelled"
                    : "Booking Confirmed"}
                </strong>

                <span>
                  Please keep your booking number for reference.
                </span>
              </div>
            </div>

            <div className="receipt-booking-number">
              <span>BOOKING NUMBER</span>

              <strong>
                  {selectedBooking.reference ||
                    selectedBooking.bookingNumber ||
                  selectedBooking.bookingId ||
                  selectedBooking._id?.slice(-8).toUpperCase()}
              </strong>
            </div>

            <div className="receipt-details">
              <div>
                <span>Name</span>

                <strong>
                  {selectedBooking.name ||
                    selectedBooking.fullName ||
                    selectedBooking.user?.name ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Phone</span>

                <strong>
                  {selectedBooking.phone ||
                    selectedBooking.mobile ||
                    selectedBooking.user?.phone ||
                    "N/A"}
                </strong>
              </div>

              <div>
                <span>Langar Date</span>

                <strong>
                  {formatDate(
                    selectedBooking.bookingDate ||
                      selectedBooking.date
                  )}
                </strong>
              </div>

              <div>
                <span>Number of People</span>

                <strong>
                  {selectedBooking.people ||
                    selectedBooking.numberOfPeople ||
                    selectedBooking.seats ||
                    selectedBooking.guests ||
                    0}
                </strong>
              </div>

              <div>
                <span>Langar Time</span>
                <strong>{selectedBooking.time || selectedBooking.bookingTime || "Not recorded"}</strong>
              </div>

              <div>
                <span>Status</span>

                <strong
                  className={getStatusClass(
                    selectedBooking.status
                  )}
                >
                  {getStatusText(selectedBooking.status)}
                </strong>
              </div>

              <div>
                <span>Booked On</span>

                <strong>
                  {selectedBooking.createdAt
                    ? formatDate(selectedBooking.createdAt)
                    : "N/A"}
                </strong>
              </div>
            </div>

            <div className="receipt-note">
              <strong>🙏 Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh</strong>

              <p>
                Thank you for participating in Langar Seva.
                We look forward to welcoming you.
              </p>
            </div>

            <div className="modal-actions">
              <button
                className="modal-primary-btn"
                onClick={() => window.print()}
              >
                🖨 Print Receipt
              </button>

              <button
                className="modal-secondary-btn"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyBookings;
