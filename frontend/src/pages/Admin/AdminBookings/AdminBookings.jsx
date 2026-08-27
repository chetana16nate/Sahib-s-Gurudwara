import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminBookings.css";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const AdminBookings = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");

  const [selectedBooking, setSelectedBooking] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* =========================================
     AUTH CHECK
  ========================================= */

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const storedAdmin = localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login", { replace: true });
      return;
    }

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    }

    fetchBookings();
  }, []);

  /* =========================================
     AUTH HEADERS
  ========================================= */

  const getAuthConfig = () => {
    const token = localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /* =========================================
     FETCH BOOKINGS
  ========================================= */

  const fetchBookings = async () => {
    try {
      setError("");

      const token = localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", { replace: true });
        return;
      }

      setLoading(true);

      const response = await axios.get(
        `${API_URL}/langar/admin/registrations`,
        getAuthConfig()
      );

      const data = response.data;

      const bookingList =
        data.registrations ||
        data.bookings ||
        data.data ||
        data.results ||
        (Array.isArray(data) ? data : []);

      setBookings(bookingList);
    } catch (err) {
      console.error("Admin bookings error:", err);

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("adminUser");
        localStorage.removeItem("userRole");

        navigate("/admin/login", { replace: true });
        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load bookings."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =========================================
     REFRESH
  ========================================= */

  const handleRefresh = async () => {
    setRefreshing(true);

    try {
      await fetchBookings();
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================
     HELPERS
  ========================================= */

  const getBookingName = (booking) => {
    return (
      booking.name ||
      booking.fullName ||
      booking.user?.name ||
      "Unknown User"
    );
  };

  const getBookingPhone = (booking) => {
    return (
      booking.phone ||
      booking.mobile ||
      booking.user?.phone ||
      "N/A"
    );
  };

  const getBookingEmail = (booking) => {
    return (
      booking.email ||
      booking.user?.email ||
      "N/A"
    );
  };

  const getBookingNumber = (booking) => {
    return (
      booking.bookingNumber ||
      booking.bookingId ||
      booking.referenceNumber ||
      booking._id?.slice(-8).toUpperCase() ||
      "N/A"
    );
  };

  const getBookingDate = (booking) => {
    return (
      booking.bookingDate ||
      booking.date ||
      booking.langarDate ||
      ""
    );
  };

  const getPeopleCount = (booking) => {
    return Number(
      booking.numberOfPeople ||
        booking.seats ||
        booking.guests ||
        booking.people ||
        0
    );
  };

  const getBookingStatus = (booking) => {
    return (
      booking.status ||
      booking.bookingStatus ||
      "confirmed"
    ).toLowerCase();
  };

  const getBookingTime = (booking) => {
    return (
      booking.bookingTime ||
      booking.time ||
      booking.langarTime ||
      ""
    );
  };

  const getBookingCreatedAt = (booking) => {
    return booking.createdAt || booking.createdOn || "";
  };

  const normalizeDate = (date) => {
    if (!date) return "";

    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {
      return date.substring(0, 10);
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "";
    }

    return parsedDate.toISOString().substring(0, 10);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatDateTime = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "status-confirmed";

      case "pending":
        return "status-pending";

      case "cancelled":
      case "canceled":
        return "status-cancelled";

      case "completed":
        return "status-completed";

      default:
        return "status-default";
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return "Confirmed";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  /* =========================================
     FILTER BOOKINGS
  ========================================= */

  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return true;

        const name =
          getBookingName(booking).toLowerCase();

        const phone =
          getBookingPhone(booking).toLowerCase();

        const email =
          getBookingEmail(booking).toLowerCase();

        const bookingNumber =
          getBookingNumber(booking).toLowerCase();

        return (
          name.includes(search) ||
          phone.includes(search) ||
          email.includes(search) ||
          bookingNumber.includes(search)
        );
      })
      .filter((booking) => {
        if (statusFilter === "all") {
          return true;
        }

        return (
          getBookingStatus(booking) ===
          statusFilter
        );
      })
      .filter((booking) => {
        if (!dateFilter) return true;

        return (
          normalizeDate(
            getBookingDate(booking)
          ) === dateFilter
        );
      })
      .sort((a, b) => {
        const dateA = new Date(
          getBookingCreatedAt(a) ||
            getBookingDate(a)
        ).getTime();

        const dateB = new Date(
          getBookingCreatedAt(b) ||
            getBookingDate(b)
        ).getTime();

        return dateB - dateA;
      });
  }, [
    bookings,
    searchTerm,
    statusFilter,
    dateFilter,
  ]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalBookings = bookings.length;

  const confirmedBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking) === "confirmed"
  ).length;

  const pendingBookings = bookings.filter(
    (booking) =>
      getBookingStatus(booking) === "pending"
  ).length;

  const cancelledBookings = bookings.filter(
    (booking) => {
      const status = getBookingStatus(booking);

      return (
        status === "cancelled" ||
        status === "canceled"
      );
    }
  ).length;

  const totalPeople = bookings
    .filter((booking) => {
      const status = getBookingStatus(booking);

      return (
        status !== "cancelled" &&
        status !== "canceled"
      );
    })
    .reduce(
      (total, booking) =>
        total + getPeopleCount(booking),
      0
    );

  /* =========================================
     UPDATE BOOKING STATUS
  ========================================= */

  const updateBookingStatus = async (
    booking,
    newStatus
  ) => {
    if (!booking?._id) {
      alert("Booking ID is missing.");
      return;
    }

    const statusText =
      newStatus.charAt(0).toUpperCase() +
      newStatus.slice(1);

    const confirmed = window.confirm(
      `Are you sure you want to mark this booking as ${statusText}?`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      /*
       * Change this URL only if your backend uses
       * a different route.
       */
      await axios.patch(
        `${API_URL}/langar/admin/registrations/${booking._id}`,
        {
          status: newStatus,
        },
        getAuthConfig()
      );

      setBookings((previousBookings) =>
        previousBookings.map((item) =>
          item._id === booking._id
            ? {
                ...item,
                status: newStatus,
                bookingStatus: newStatus,
              }
            : item
        )
      );

      setSelectedBooking((previous) =>
        previous
          ? {
              ...previous,
              status: newStatus,
              bookingStatus: newStatus,
            }
          : null
      );

      alert(
        `Booking successfully marked as ${statusText}.`
      );
    } catch (err) {
      console.error(
        "Update booking status error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to update booking status."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     DELETE BOOKING
  ========================================= */

  const deleteBooking = async (booking) => {
    if (!booking?._id) {
      alert("Booking ID is missing.");
      return;
    }

    const confirmed = window.confirm(
      `Delete booking ${getBookingNumber(
        booking
      )} permanently?\n\nThis action cannot be undone.`
    );

    if (!confirmed) return;

    try {
      setActionLoading(true);

      await axios.delete(
        `${API_URL}/langar/admin/registrations/${booking._id}`,
        getAuthConfig()
      );

      setBookings((previousBookings) =>
        previousBookings.filter(
          (item) => item._id !== booking._id
        )
      );

      setSelectedBooking(null);

      alert("Booking deleted successfully.");
    } catch (err) {
      console.error("Delete booking error:", err);

      alert(
        err.response?.data?.message ||
          "Unable to delete booking."
      );
    } finally {
      setActionLoading(false);
    }
  };

  /* =========================================
     EXPORT CSV
  ========================================= */

  const exportBookings = () => {
    if (filteredBookings.length === 0) {
      alert("There are no bookings to export.");
      return;
    }

    const headers = [
      "Booking Number",
      "Name",
      "Phone",
      "Email",
      "Langar Date",
      "Langar Time",
      "Number of People",
      "Status",
      "Booked On",
    ];

    const rows = filteredBookings.map(
      (booking) => [
        getBookingNumber(booking),
        getBookingName(booking),
        getBookingPhone(booking),
        getBookingEmail(booking),
        formatDate(getBookingDate(booking)),
        getBookingTime(booking) || "N/A",
        getPeopleCount(booking),
        getBookingStatus(booking),
        formatDateTime(
          getBookingCreatedAt(booking)
        ),
      ]
    );

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(
              /"/g,
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url =
      URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = `langar-bookings-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  /* =========================================
     PRINT BOOKING
  ========================================= */

  const printBooking = (booking) => {
    if (!booking) return;

    const printWindow =
      window.open("", "_blank");

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print the booking."
      );
      return;
    }

    const bookingNumber =
      getBookingNumber(booking);

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Langar Booking - ${bookingNumber}</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #3b2a1e;
          }

          .receipt {
            max-width: 650px;
            margin: auto;
            border: 1px solid #ddd;
            padding: 30px;
          }

          h1 {
            text-align: center;
            margin: 0;
            color: #54270d;
          }

          .subtitle {
            text-align: center;
            margin: 8px 0 25px;
            color: #777;
          }

          .booking-number {
            text-align: center;
            font-size: 22px;
            font-weight: bold;
            margin-bottom: 25px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td {
            padding: 12px 8px;
            border-bottom: 1px solid #eee;
          }

          td:first-child {
            font-weight: bold;
            width: 40%;
          }

          .footer {
            text-align: center;
            margin-top: 30px;
            color: #777;
          }
        </style>
      </head>

      <body>

        <div class="receipt">

          <h1>Sahib's Gurudwara</h1>

          <div class="subtitle">
            Langar Seva Booking Receipt
          </div>

          <div class="booking-number">
            ${bookingNumber}
          </div>

          <table>
            <tr>
              <td>Devotee Name</td>
              <td>${getBookingName(booking)}</td>
            </tr>

            <tr>
              <td>Phone</td>
              <td>${getBookingPhone(booking)}</td>
            </tr>

            <tr>
              <td>Email</td>
              <td>${getBookingEmail(booking)}</td>
            </tr>

            <tr>
              <td>Langar Date</td>
              <td>${formatDate(
                getBookingDate(booking)
              )}</td>
            </tr>

            <tr>
              <td>Langar Time</td>
              <td>${getBookingTime(booking) || "N/A"}</td>
            </tr>

            <tr>
              <td>Number of People</td>
              <td>${getPeopleCount(booking)}</td>
            </tr>

            <tr>
              <td>Status</td>
              <td>${getStatusLabel(
                getBookingStatus(booking)
              )}</td>
            </tr>

            <tr>
              <td>Booked On</td>
              <td>${formatDateTime(
                getBookingCreatedAt(booking)
              )}</td>
            </tr>
          </table>

          <div class="footer">
            Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh
          </div>

        </div>

      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  /* =========================================
     RESET FILTERS
  ========================================= */

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFilter("");
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userRole");

    navigate("/admin/login", {
      replace: true,
    });
  };

  const adminName =
    admin?.name ||
    admin?.fullName ||
    admin?.username ||
    "Administrator";

  /* =========================================
     LOADING
  ========================================= */

  if (loading) {
    return (
      <div className="admin-bookings-loading">

        <div className="admin-bookings-loading-symbol">
          🙏
        </div>

        <div className="admin-bookings-spinner"></div>

        <h2>
          Loading Bookings
        </h2>

        <p>
          Please wait while we fetch Langar bookings...
        </p>

      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="admin-bookings-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="admin-bookings-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        ></div>
      )}

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`admin-bookings-sidebar ${
          sidebarOpen
            ? "admin-bookings-sidebar-open"
            : ""
        }`}
      >

        <div className="admin-bookings-brand">

          <div className="admin-bookings-logo">
            🙏
          </div>

          <div>
            <h2>
              Sahib's Gurudwara
            </h2>

            <span>
              ADMIN PANEL
            </span>
          </div>

          <button
            className="admin-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            ×
          </button>

        </div>

        <div className="admin-sidebar-line"></div>

        <nav className="admin-bookings-nav">

          <button
            className="admin-bookings-nav-item"
            onClick={() =>
              navigate("/admin/dashboard")
            }
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className="admin-bookings-nav-item active"
          >
            <span>📋</span>
            All Bookings

            <small>
              {bookings.length}
            </small>
          </button>

          <button
            className="admin-bookings-nav-item"
            onClick={() =>
              navigate(
                "/admin/langar-availability"
              )
            }
          >
            <span>🎟️</span>
            Langar Availability
          </button>

          <button
            className="admin-bookings-nav-item"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            <span>👥</span>
            Users
          </button>

          <button
            className="admin-bookings-nav-item"
            onClick={() =>
              navigate("/admin/reports")
            }
          >
            <span>📈</span>
            Reports
          </button>

        </nav>

        <div className="admin-bookings-sidebar-bottom">

          <div className="admin-seva-card">

            <span>
              ੴ
            </span>

            <div>
              <strong>
                ਸਰਬੱਤ ਦਾ ਭਲਾ
              </strong>

              <small>
                Well-being for all
              </small>
            </div>

          </div>

          <button
            className="admin-bookings-nav-item"
            onClick={() =>
              navigate("/")
            }
          >
            <span>🏠</span>
            Visit Website
          </button>

          <button
            className="admin-bookings-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN
      ====================================== */}

      <main className="admin-bookings-main">

        {/* TOP BAR */}

        <header className="admin-bookings-topbar">

          <div className="admin-bookings-topbar-left">

            <button
              className="admin-bookings-menu"
              onClick={() =>
                setSidebarOpen(true)
              }
            >
              ☰
            </button>

            <div>

              <span>
                LANGAR SEVA MANAGEMENT
              </span>

              <h1>
                All Bookings
              </h1>

            </div>

          </div>

          <div className="admin-bookings-profile">

            <div className="admin-profile-avatar">
              {adminName
                .charAt(0)
                .toUpperCase()}
            </div>

            <div>
              <strong>
                {adminName}
              </strong>

              <small>
                Administrator
              </small>
            </div>

            <button
              onClick={handleLogout}
              title="Logout"
            >
              ↪
            </button>

          </div>

        </header>

        {/* CONTENT */}

        <div className="admin-bookings-content">

          {/* PAGE HEADER */}

          <section className="admin-bookings-heading">

            <div>

              <span>
                BOOKING MANAGEMENT
              </span>

              <h2>
                Langar Bookings
              </h2>

              <p>
                View and manage all devotee Langar
                reservations from one place.
              </p>

            </div>

            <div className="admin-bookings-heading-actions">

              <button
                className="admin-refresh-button"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <span
                  className={
                    refreshing
                      ? "admin-refresh-spin"
                      : ""
                  }
                >
                  ↻
                </span>

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

              <button
                className="admin-export-button"
                onClick={exportBookings}
              >
                ↓ Export CSV
              </button>

            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div className="admin-bookings-error">

              <div>
                <strong>
                  Unable to load bookings
                </strong>

                <p>
                  {error}
                </p>
              </div>

              <button
                onClick={fetchBookings}
              >
                Retry
              </button>

            </div>
          )}

          {/* =================================
              STATISTICS
          ================================== */}

          <section className="admin-booking-stats">

            <div className="admin-booking-stat">

              <div className="booking-stat-icon">
                📋
              </div>

              <div>
                <span>
                  Total Bookings
                </span>

                <strong>
                  {totalBookings}
                </strong>
              </div>

            </div>

            <div className="admin-booking-stat">

              <div className="booking-stat-icon green">
                ✓
              </div>

              <div>
                <span>
                  Confirmed
                </span>

                <strong>
                  {confirmedBookings}
                </strong>
              </div>

            </div>

            <div className="admin-booking-stat">

              <div className="booking-stat-icon yellow">
                ⏳
              </div>

              <div>
                <span>
                  Pending
                </span>

                <strong>
                  {pendingBookings}
                </strong>
              </div>

            </div>

            <div className="admin-booking-stat">

              <div className="booking-stat-icon red">
                ×
              </div>

              <div>
                <span>
                  Cancelled
                </span>

                <strong>
                  {cancelledBookings}
                </strong>
              </div>

            </div>

            <div className="admin-booking-stat">

              <div className="booking-stat-icon blue">
                👥
              </div>

              <div>
                <span>
                  Total Devotees
                </span>

                <strong>
                  {totalPeople}
                </strong>
              </div>

            </div>

          </section>

          {/* =================================
              FILTERS
          ================================== */}

          <section className="admin-bookings-panel">

            <div className="admin-filter-header">

              <div>

                <span>
                  FILTER BOOKINGS
                </span>

                <h3>
                  Search & Filter
                </h3>

              </div>

              <button
                className="reset-filters"
                onClick={resetFilters}
              >
                Reset Filters
              </button>

            </div>

            <div className="admin-filter-grid">

              <div className="admin-search">

                <label>
                  Search
                </label>

                <div className="admin-search-input">

                  <span>
                    🔍
                  </span>

                  <input
                    type="text"
                    placeholder="Name, phone, email or booking number"
                    value={searchTerm}
                    onChange={(e) =>
                      setSearchTerm(
                        e.target.value
                      )
                    }
                  />

                </div>

              </div>

              <div>

                <label>
                  Booking Status
                </label>

                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(
                      e.target.value
                    )
                  }
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="confirmed">
                    Confirmed
                  </option>

                  <option value="pending">
                    Pending
                  </option>

                  <option value="completed">
                    Completed
                  </option>

                  <option value="cancelled">
                    Cancelled
                  </option>

                </select>

              </div>

              <div>

                <label>
                  Langar Date
                </label>

                <input
                  type="date"
                  value={dateFilter}
                  onChange={(e) =>
                    setDateFilter(
                      e.target.value
                    )
                  }
                />

              </div>

            </div>

            <div className="filter-result">

              Showing{" "}
              <strong>
                {filteredBookings.length}
              </strong>{" "}
              of{" "}
              <strong>
                {bookings.length}
              </strong>{" "}
              bookings

            </div>

          </section>

          {/* =================================
              BOOKINGS TABLE
          ================================== */}

          <section className="admin-all-bookings">

            <div className="all-bookings-header">

              <div>

                <span>
                  BOOKING RECORDS
                </span>

                <h3>
                  All Langar Bookings
                </h3>

              </div>

              <span className="booking-count-badge">
                {filteredBookings.length} Records
              </span>

            </div>

            {filteredBookings.length === 0 ? (

              <div className="admin-no-bookings">

                <div>
                  📋
                </div>

                <h3>
                  No bookings found
                </h3>

                <p>
                  Try changing your search or
                  filter options.
                </p>

                <button
                  onClick={resetFilters}
                >
                  Clear Filters
                </button>

              </div>

            ) : (

              <div className="admin-bookings-table-wrap">

                <table className="admin-bookings-table">

                  <thead>

                    <tr>
                      <th>
                        Booking
                      </th>

                      <th>
                        Devotee
                      </th>

                      <th>
                        Langar Date
                      </th>

                      <th>
                        Time
                      </th>

                      <th>
                        People
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Booked On
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>

                  </thead>

                  <tbody>

                    {filteredBookings.map(
                      (booking) => {

                        const status =
                          getBookingStatus(
                            booking
                          );

                        return (

                          <tr
                            key={
                              booking._id
                            }
                          >

                            <td>

                              <strong className="booking-number">
                                {getBookingNumber(
                                  booking
                                )}
                              </strong>

                            </td>

                            <td>

                              <div className="admin-devotee">

                                <div className="admin-devotee-avatar">
                                  {getBookingName(
                                    booking
                                  )
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <div>

                                  <strong>
                                    {getBookingName(
                                      booking
                                    )}
                                  </strong>

                                  <span>
                                    {getBookingPhone(
                                      booking
                                    )}
                                  </span>

                                </div>

                              </div>

                            </td>

                            <td>

                              <strong className="date-value">
                                {formatDate(
                                  getBookingDate(
                                    booking
                                  )
                                )}
                              </strong>

                            </td>

                            <td>

                              <span className="time-value">
                                {getBookingTime(
                                  booking
                                ) || "N/A"}
                              </span>

                            </td>

                            <td>

                              <span className="people-badge">
                                👥{" "}
                                {getPeopleCount(
                                  booking
                                )}
                              </span>

                            </td>

                            <td>

                              <span
                                className={`booking-status ${getStatusClass(
                                  status
                                )}`}
                              >

                                <i></i>

                                {getStatusLabel(
                                  status
                                )}

                              </span>

                            </td>

                            <td>

                              <span className="created-date">
                                {formatDateTime(
                                  getBookingCreatedAt(
                                    booking
                                  )
                                )}
                              </span>

                            </td>

                            <td>

                              <button
                                className="view-booking-btn"
                                onClick={() =>
                                  setSelectedBooking(
                                    booking
                                  )
                                }
                              >
                                View
                              </button>

                            </td>

                          </tr>

                        );
                      }
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

          {/* FOOTER */}

          <footer className="admin-bookings-footer">

            <div>

              <strong>
                🙏 Waheguru Ji Ka Khalsa,
                Waheguru Ji Ki Fateh
              </strong>

              <span>
                Langar Seva Administration
              </span>

            </div>

            <span>
              ©{" "}
              {new Date().getFullYear()}
              {" "}Sahib's Gurudwara
            </span>

          </footer>

        </div>

      </main>

      {/* =====================================
          BOOKING DETAILS MODAL
      ====================================== */}

      {selectedBooking && (

        <div
          className="booking-modal-overlay"
          onClick={() =>
            setSelectedBooking(null)
          }
        >

          <div
            className="booking-details-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="booking-modal-header">

              <div>

                <span>
                  LANGAR BOOKING
                </span>

                <h2>
                  Booking Details
                </h2>

              </div>

              <button
                onClick={() =>
                  setSelectedBooking(null)
                }
              >
                ×
              </button>

            </div>

            {/* BOOKING NUMBER */}

            <div className="modal-booking-id">

              <span>
                BOOKING NUMBER
              </span>

              <strong>
                {getBookingNumber(
                  selectedBooking
                )}
              </strong>

            </div>

            {/* DETAILS */}

            <div className="booking-detail-grid">

              <div className="detail-item">

                <span>
                  Devotee Name
                </span>

                <strong>
                  {getBookingName(
                    selectedBooking
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Phone Number
                </span>

                <strong>
                  {getBookingPhone(
                    selectedBooking
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Email
                </span>

                <strong>
                  {getBookingEmail(
                    selectedBooking
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Number of People
                </span>

                <strong>
                  {getPeopleCount(
                    selectedBooking
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Langar Date
                </span>

                <strong>
                  {formatDate(
                    getBookingDate(
                      selectedBooking
                    )
                  )}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Langar Time
                </span>

                <strong>
                  {getBookingTime(
                    selectedBooking
                  ) || "N/A"}
                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Booking Status
                </span>

                <strong>

                  <span
                    className={`booking-status ${getStatusClass(
                      getBookingStatus(
                        selectedBooking
                      )
                    )}`}
                  >

                    <i></i>

                    {getStatusLabel(
                      getBookingStatus(
                        selectedBooking
                      )
                    )}

                  </span>

                </strong>

              </div>

              <div className="detail-item">

                <span>
                  Booking Created
                </span>

                <strong>
                  {formatDateTime(
                    getBookingCreatedAt(
                      selectedBooking
                    )
                  )}
                </strong>

              </div>

            </div>

            {/* NOTES */}

            {(selectedBooking.notes ||
              selectedBooking.message ||
              selectedBooking.specialRequest) && (

              <div className="booking-notes">

                <span>
                  DEVOTEE NOTE
                </span>

                <p>
                  {selectedBooking.notes ||
                    selectedBooking.message ||
                    selectedBooking.specialRequest}
                </p>

              </div>

            )}

            {/* ACTIONS */}

            <div className="booking-modal-actions">

              {getBookingStatus(
                selectedBooking
              ) !== "confirmed" && (

                <button
                  className="modal-confirm-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateBookingStatus(
                      selectedBooking,
                      "confirmed"
                    )
                  }
                >
                  ✓ Confirm Booking
                </button>

              )}

              {getBookingStatus(
                selectedBooking
              ) !== "completed" && (

                <button
                  className="modal-complete-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateBookingStatus(
                      selectedBooking,
                      "completed"
                    )
                  }
                >
                  ✓ Mark Completed
                </button>

              )}

              {getBookingStatus(
                selectedBooking
              ) !== "cancelled" && (
                <button
                  className="modal-cancel-btn"
                  disabled={actionLoading}
                  onClick={() =>
                    updateBookingStatus(
                      selectedBooking,
                      "cancelled"
                    )
                  }
                >
                  × Cancel Booking
                </button>
              )}

              <button
                className="modal-print-btn"
                onClick={() =>
                  printBooking(
                    selectedBooking
                  )
                }
              >
                🖨 Print
              </button>

              <button
                className="modal-delete-btn"
                disabled={actionLoading}
                onClick={() =>
                  deleteBooking(
                    selectedBooking
                  )
                }
              >
                🗑 Delete
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default AdminBookings;
