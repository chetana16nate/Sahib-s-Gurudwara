import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AdminAvailability.css";

const API_URL = "http://localhost:5000/api";

const AdminAvailability = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);

  const [availability, setAvailability] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");

  const [formData, setFormData] = useState({
    date: "",
    capacity: 100,
    openingTime: "11:00",
    closingTime: "15:00",
    isAvailable: true,
  });

  const [editingId, setEditingId] = useState(null);

  /* =========================================
     TODAY
  ========================================= */

  const getToday = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  /* =========================================
     AUTH
  ========================================= */

  useEffect(() => {
    const token =
      localStorage.getItem("adminToken");

    const storedAdmin =
      localStorage.getItem("adminUser");

    if (!token) {
      navigate("/admin/login", {
        replace: true,
      });

      return;
    }

    if (storedAdmin) {
      try {
        setAdmin(JSON.parse(storedAdmin));
      } catch {
        setAdmin(null);
      }
    }

    setSelectedDate(getToday());

    fetchAvailability();
  }, []);

  /* =========================================
     AUTH CONFIG
  ========================================= */

  const getAuthConfig = () => {
    const token =
      localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  /* =========================================
     FETCH AVAILABILITY
  ========================================= */

  const fetchAvailability = async () => {
    try {
      setError("");

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setLoading(true);

      /*
       * Expected backend:
       *
       * GET /api/availability
       */

      const response = await axios.get(
        `${API_URL}/availability`,
        getAuthConfig()
      );

      const data = response.data;

      const list =
        data.availability ||
        data.data ||
        data.results ||
        (Array.isArray(data)
          ? data
          : []);

      setAvailability(list);
    } catch (err) {
      console.error(
        "Availability fetch error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        localStorage.removeItem(
          "userRole"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to load Langar availability."
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
      await fetchAvailability();
    } finally {
      setRefreshing(false);
    }
  };

  /* =========================================
     HELPERS
  ========================================= */

  const normalizeDate = (date) => {
    if (!date) return "";

    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {
      return date.substring(0, 10);
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(parsedDate.getTime())
    ) {
      return "";
    }

    /*
     * Use local date instead of UTC so that
     * the selected Langar date does not shift.
     */

    const year =
      parsedDate.getFullYear();

    const month = String(
      parsedDate.getMonth() + 1
    ).padStart(2, "0");

    const day = String(
      parsedDate.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";

    const normalized =
      normalizeDate(date);

    if (!normalized) return "N/A";

    const [year, month, day] =
      normalized.split("-");

    const parsed = new Date(
      Number(year),
      Number(month) - 1,
      Number(day)
    );

    return parsed.toLocaleDateString(
      "en-IN",
      {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  const getAvailabilityDate = (item) => {
    return (
      item.date ||
      item.bookingDate ||
      item.langarDate ||
      ""
    );
  };

  const getCapacity = (item) => {
    return Number(
      item.capacity ||
        item.totalCapacity ||
        item.limit ||
        item.maxSeats ||
        0
    );
  };

  const getBookedSeats = (item) => {
    return Number(
      item.bookedSeats ||
        item.booked ||
        item.reservedSeats ||
        item.totalBooked ||
        0
    );
  };

  const getAvailableSeats = (item) => {
    if (
      item.availableSeats !==
        undefined &&
      item.availableSeats !== null
    ) {
      return Number(item.availableSeats);
    }

    return Math.max(
      getCapacity(item) -
        getBookedSeats(item),
      0
    );
  };

  const getIsAvailable = (item) => {
    if (
      item.isAvailable ===
        undefined
    ) {
      return true;
    }

    return Boolean(item.isAvailable);
  };

  const getOpeningTime = (item) => {
    return (
      item.openingTime ||
      item.startTime ||
      item.fromTime ||
      "11:00"
    );
  };

  const getClosingTime = (item) => {
    return (
      item.closingTime ||
      item.endTime ||
      item.toTime ||
      "15:00"
    );
  };

  const getStatus = (item) => {
    const capacity =
      getCapacity(item);

    const available =
      getAvailableSeats(item);

    if (!getIsAvailable(item)) {
      return "closed";
    }

    if (available <= 0) {
      return "full";
    }

    if (
      capacity > 0 &&
      available <=
        Math.ceil(capacity * 0.2)
    ) {
      return "limited";
    }

    return "available";
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "available":
        return "Available";

      case "limited":
        return "Limited Seats";

      case "full":
        return "Full";

      case "closed":
        return "Closed";

      default:
        return "Available";
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "available":
        return "availability-status-available";

      case "limited":
        return "availability-status-limited";

      case "full":
        return "availability-status-full";

      case "closed":
        return "availability-status-closed";

      default:
        return "";
    }
  };

  /* =========================================
     SORT AVAILABILITY
  ========================================= */

  const sortedAvailability =
    useMemo(() => {
      return [...availability].sort(
        (a, b) => {
          const dateA = normalizeDate(
            getAvailabilityDate(a)
          );

          const dateB = normalizeDate(
            getAvailabilityDate(b)
          );

          return dateA.localeCompare(
            dateB
          );
        }
      );
    }, [availability]);

  /* =========================================
     UPCOMING DAYS
  ========================================= */

  const upcomingAvailability =
    useMemo(() => {
      const today = getToday();

      return sortedAvailability.filter(
        (item) =>
          normalizeDate(
            getAvailabilityDate(item)
          ) >= today
      );
    }, [sortedAvailability]);

  /* =========================================
     STATISTICS
  ========================================= */

  const totalCapacity =
    upcomingAvailability.reduce(
      (sum, item) =>
        sum + getCapacity(item),
      0
    );

  const totalBooked =
    upcomingAvailability.reduce(
      (sum, item) =>
        sum + getBookedSeats(item),
      0
    );

  const totalAvailable =
    upcomingAvailability.reduce(
      (sum, item) =>
        sum + getAvailableSeats(item),
      0
    );

  const fullyBookedDays =
    upcomingAvailability.filter(
      (item) =>
        getStatus(item) === "full"
    ).length;

  /* =========================================
     INPUT HANDLERS
  ========================================= */

  const handleInputChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  /* =========================================
     RESET FORM
  ========================================= */

  const resetForm = () => {
    setFormData({
      date: selectedDate || getToday(),
      capacity: 100,
      openingTime: "11:00",
      closingTime: "15:00",
      isAvailable: true,
    });

    setEditingId(null);
  };

  /* =========================================
     SELECT DATE
  ========================================= */

  const handleDateSelect = (date) => {
    setSelectedDate(date);

    const existing =
      availability.find(
        (item) =>
          normalizeDate(
            getAvailabilityDate(item)
          ) === date
      );

    if (existing) {
      setEditingId(
        existing._id || null
      );

      setFormData({
        date,
        capacity:
          getCapacity(existing),
        openingTime:
          getOpeningTime(existing),
        closingTime:
          getClosingTime(existing),
        isAvailable:
          getIsAvailable(existing),
      });
    } else {
      setEditingId(null);

      setFormData({
        date,
        capacity: 100,
        openingTime: "11:00",
        closingTime: "15:00",
        isAvailable: true,
      });
    }
  };

  /* =========================================
     EDIT
  ========================================= */

  const handleEdit = (item) => {
    const date =
      normalizeDate(
        getAvailabilityDate(item)
      );

    setSelectedDate(date);

    setEditingId(
      item._id || null
    );

    setFormData({
      date,
      capacity: getCapacity(item),
      openingTime:
        getOpeningTime(item),
      closingTime:
        getClosingTime(item),
      isAvailable:
        getIsAvailable(item),
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  /* =========================================
     SAVE AVAILABILITY
  ========================================= */

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.date) {
      alert(
        "Please select a Langar date."
      );
      return;
    }

    if (
      !formData.capacity ||
      Number(formData.capacity) <= 0
    ) {
      alert(
        "Capacity must be greater than 0."
      );
      return;
    }

    if (
      formData.openingTime >=
      formData.closingTime
    ) {
      alert(
        "Closing time must be after opening time."
      );
      return;
    }

    try {
      setSaving(true);

      const payload = {
        date: formData.date,
        capacity: Number(
          formData.capacity
        ),
        openingTime:
          formData.openingTime,
        closingTime:
          formData.closingTime,
        isAvailable:
          formData.isAvailable,
      };

      let response;

      if (editingId) {
        /*
         * Update existing date
         *
         * PATCH /api/availability/:id
         */

        response = await axios.patch(
          `${API_URL}/availability/${editingId}`,
          payload,
          getAuthConfig()
        );
      } else {
        /*
         * Create new date
         *
         * POST /api/availability
         */

        response = await axios.post(
          `${API_URL}/availability`,
          payload,
          getAuthConfig()
        );
      }

      const saved =
        response.data?.availability ||
        response.data?.data ||
        response.data;

      if (
        saved &&
        saved._id
      ) {
        setAvailability((previous) => {
          if (editingId) {
            return previous.map(
              (item) =>
                item._id === editingId
                  ? saved
                  : item
            );
          }

          return [
            ...previous,
            saved,
          ];
        });
      } else {
        await fetchAvailability();
      }

      alert(
        editingId
          ? "Langar availability updated successfully."
          : "Langar availability created successfully."
      );

      resetForm();
    } catch (err) {
      console.error(
        "Save availability error:",
        err
      );

      if (
        err.response?.status === 401 ||
        err.response?.status === 403
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        localStorage.removeItem(
          "adminUser"
        );

        navigate("/admin/login", {
          replace: true,
        });

        return;
      }

      alert(
        err.response?.data?.message ||
          "Unable to save Langar availability."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     DELETE DATE
  ========================================= */

  const handleDelete = async (item) => {
    if (!item?._id) {
      alert(
        "This availability record does not have an ID."
      );
      return;
    }

    const booked =
      getBookedSeats(item);

    if (booked > 0) {
      alert(
        `This date already has ${booked} booked seat(s).\n\nYou should disable the date instead of deleting it.`
      );

      return;
    }

    const confirmed =
      window.confirm(
        `Delete Langar availability for ${formatDate(
          getAvailabilityDate(item)
        )}?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);

      await axios.delete(
        `${API_URL}/availability/${item._id}`,
        getAuthConfig()
      );

      setAvailability((previous) =>
        previous.filter(
          (record) =>
            record._id !== item._id
        )
      );

      if (
        editingId === item._id
      ) {
        resetForm();
      }

      alert(
        "Availability deleted successfully."
      );
    } catch (err) {
      console.error(
        "Delete availability error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to delete availability."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     TOGGLE AVAILABILITY
  ========================================= */

  const handleToggle = async (item) => {
    if (!item?._id) {
      return;
    }

    try {
      setSaving(true);

      const newValue =
        !getIsAvailable(item);

      await axios.patch(
        `${API_URL}/availability/${item._id}`,
        {
          isAvailable: newValue,
        },
        getAuthConfig()
      );

      setAvailability((previous) =>
        previous.map((record) =>
          record._id === item._id
            ? {
                ...record,
                isAvailable:
                  newValue,
              }
            : record
        )
      );
    } catch (err) {
      console.error(
        "Toggle availability error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Unable to change availability."
      );
    } finally {
      setSaving(false);
    }
  };

  /* =========================================
     LOGOUT
  ========================================= */

  const handleLogout = () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to logout?"
      );

    if (!confirmed) {
      return;
    }

    localStorage.removeItem(
      "adminToken"
    );

    localStorage.removeItem(
      "adminUser"
    );

    localStorage.removeItem(
      "userRole"
    );

    navigate("/admin/login", {
      replace: true,
    });
  };

  /* =========================================
     ADMIN NAME
  ========================================= */

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
      <div className="admin-availability-loading">

        <div className="availability-loading-symbol">
          🙏
        </div>

        <div className="availability-spinner"></div>

        <h2>
          Loading Langar Availability
        </h2>

        <p>
          Please wait while we prepare the
          availability panel...
        </p>

      </div>
    );
  }

  /* =========================================
     UI
  ========================================= */

  return (
    <div className="admin-availability-page">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="availability-overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================
          SIDEBAR
      ====================================== */}

      <aside
        className={`admin-availability-sidebar ${
          sidebarOpen
            ? "availability-sidebar-open"
            : ""
        }`}
      >

        <div className="availability-brand">

          <div className="availability-logo">
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
            className="availability-sidebar-close"
            onClick={() =>
              setSidebarOpen(false)
            }
          >
            ×
          </button>

        </div>

        <div className="availability-sidebar-line" />

        <nav className="availability-nav">

          <button
            className="availability-nav-item"
            onClick={() =>
              navigate(
                "/admin/dashboard"
              )
            }
          >
            <span>📊</span>
            Dashboard
          </button>

          <button
            className="availability-nav-item"
            onClick={() =>
              navigate(
                "/admin/bookings"
              )
            }
          >
            <span>📋</span>
            All Bookings
          </button>

          <button
            className="availability-nav-item active"
          >
            <span>🎟️</span>
            Langar Availability
          </button>

          <button
            className="availability-nav-item"
            onClick={() =>
              navigate("/admin/users")
            }
          >
            <span>👥</span>
            Users
          </button>

          <button
            className="availability-nav-item"
            onClick={() =>
              navigate("/admin/reports")
            }
          >
            <span>📈</span>
            Reports
          </button>

        </nav>

        <div className="availability-sidebar-bottom">

          <div className="availability-seva-card">

            <span>ੴ</span>

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
            className="availability-nav-item"
            onClick={() =>
              navigate("/")
            }
          >
            <span>🏠</span>
            Visit Website
          </button>

          <button
            className="availability-logout"
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

      <main className="admin-availability-main">

        {/* TOPBAR */}

        <header className="availability-topbar">

          <div className="availability-topbar-left">

            <button
              className="availability-menu"
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
                Availability
              </h1>

            </div>

          </div>

          <div className="availability-profile">

            <div className="availability-avatar">
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

        {/* =====================================
            CONTENT
        ====================================== */}

        <div className="availability-content">

          {/* HEADER */}

          <section className="availability-heading">

            <div>

              <span>
                LANGAR CAPACITY CONTROL
              </span>

              <h2>
                Langar Availability
              </h2>

              <p>
                Set daily Langar capacity,
                timings and booking availability.
              </p>

            </div>

            <div className="availability-heading-actions">

              <button
                className="availability-refresh"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <span
                  className={
                    refreshing
                      ? "availability-refresh-spin"
                      : ""
                  }
                >
                  ↻
                </span>

                {refreshing
                  ? "Refreshing..."
                  : "Refresh"}
              </button>

            </div>

          </section>

          {/* ERROR */}

          {error && (
            <div className="availability-error">

              <div>

                <strong>
                  Unable to load availability
                </strong>

                <p>
                  {error}
                </p>

              </div>

              <button
                onClick={fetchAvailability}
              >
                Retry
              </button>

            </div>
          )}

          {/* =====================================
              STATISTICS
          ====================================== */}

          <section className="availability-stats">

            <div className="availability-stat-card">

              <div className="availability-stat-icon">
                📅
              </div>

              <div>

                <span>
                  Upcoming Days
                </span>

                <strong>
                  {upcomingAvailability.length}
                </strong>

              </div>

            </div>

            <div className="availability-stat-card">

              <div className="availability-stat-icon green">
                🎟️
              </div>

              <div>

                <span>
                  Total Capacity
                </span>

                <strong>
                  {totalCapacity}
                </strong>

              </div>

            </div>

            <div className="availability-stat-card">

              <div className="availability-stat-icon blue">
                👥
              </div>

              <div>

                <span>
                  Seats Booked
                </span>

                <strong>
                  {totalBooked}
                </strong>

              </div>

            </div>

            <div className="availability-stat-card">

              <div className="availability-stat-icon yellow">
                ✓
              </div>

              <div>

                <span>
                  Seats Available
                </span>

                <strong>
                  {totalAvailable}
                </strong>

              </div>

            </div>

            <div className="availability-stat-card">

              <div className="availability-stat-icon red">
                ⚠
              </div>

              <div>

                <span>
                  Fully Booked Days
                </span>

                <strong>
                  {fullyBookedDays}
                </strong>

              </div>

            </div>

          </section>

          {/* =====================================
              CREATE / EDIT FORM
          ====================================== */}

          <section className="availability-form-panel">

            <div className="availability-panel-header">

              <div>

                <span>
                  {editingId
                    ? "UPDATE SCHEDULE"
                    : "CREATE SCHEDULE"}
                </span>

                <h3>
                  {editingId
                    ? "Edit Langar Availability"
                    : "Add Langar Availability"}
                </h3>

              </div>

              {editingId && (
                <button
                  className="availability-cancel-edit"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}

            </div>

            <form
              onSubmit={handleSubmit}
              className="availability-form"
            >

              {/* DATE */}

              <div className="availability-field">

                <label>
                  Langar Date
                  <span>*</span>
                </label>

                <input
                  type="date"
                  name="date"
                  min={getToday()}
                  value={formData.date}
                  onChange={
                    handleInputChange
                  }
                  required
                />

              </div>

              {/* CAPACITY */}

              <div className="availability-field">

                <label>
                  Maximum Seats
                  <span>*</span>
                </label>

                <input
                  type="number"
                  name="capacity"
                  min="1"
                  max="10000"
                  value={
                    formData.capacity
                  }
                  onChange={
                    handleInputChange
                  }
                  required
                />

                <small>
                  Maximum number of devotees
                  allowed for this date.
                </small>

              </div>

              {/* OPENING TIME */}

              <div className="availability-field">

                <label>
                  Opening Time
                </label>

                <input
                  type="time"
                  name="openingTime"
                  value={
                    formData.openingTime
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* CLOSING TIME */}

              <div className="availability-field">

                <label>
                  Closing Time
                </label>

                <input
                  type="time"
                  name="closingTime"
                  value={
                    formData.closingTime
                  }
                  onChange={
                    handleInputChange
                  }
                />

              </div>

              {/* AVAILABLE */}

              <div className="availability-toggle-field">

                <div>

                  <label>
                    Accept Bookings
                  </label>

                  <small>
                    Users can book Langar seats
                    for this date.
                  </small>

                </div>

                <label className="availability-switch">

                  <input
                    type="checkbox"
                    name="isAvailable"
                    checked={
                      formData.isAvailable
                    }
                    onChange={
                      handleInputChange
                    }
                  />

                  <span></span>

                </label>

              </div>

              {/* SUBMIT */}

              <div className="availability-form-actions">

                <button
                  type="submit"
                  className="availability-save-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "✓ Update Availability"
                    : "+ Add Availability"}
                </button>

                <button
                  type="button"
                  className="availability-reset-btn"
                  onClick={resetForm}
                >
                  Reset
                </button>

              </div>

            </form>

          </section>

          {/* =====================================
              DATE QUICK SELECTOR
          ====================================== */}

          <section className="availability-calendar-panel">

            <div className="availability-panel-header">

              <div>

                <span>
                  DATE SELECTOR
                </span>

                <h3>
                  Select a Langar Date
                </h3>

              </div>

            </div>

            <div className="availability-date-selector">

              <input
                type="date"
                min={getToday()}
                value={
                  selectedDate
                }
                onChange={(e) =>
                  handleDateSelect(
                    e.target.value
                  )
                }
              />

              {selectedDate && (
                <div className="selected-date-info">

                  <span>
                    SELECTED DATE
                  </span>

                  <strong>
                    {formatDate(
                      selectedDate
                    )}
                  </strong>

                </div>
              )}

            </div>

          </section>

          {/* =====================================
              AVAILABILITY TABLE
          ====================================== */}

          <section className="availability-table-panel">

            <div className="availability-panel-header">

              <div>

                <span>
                  LANGAR SCHEDULE
                </span>

                <h3>
                  Daily Availability
                </h3>

              </div>

              <span className="schedule-count">
                {sortedAvailability.length}
                {" "}Days
              </span>

            </div>

            {sortedAvailability.length === 0 ? (

              <div className="availability-empty">

                <div>
                  📅
                </div>

                <h3>
                  No availability configured
                </h3>

                <p>
                  Add a Langar date and capacity
                  using the form above.
                </p>

              </div>

            ) : (

              <div className="availability-table-wrap">

                <table className="availability-table">

                  <thead>

                    <tr>

                      <th>
                        Date
                      </th>

                      <th>
                        Timings
                      </th>

                      <th>
                        Capacity
                      </th>

                      <th>
                        Booked
                      </th>

                      <th>
                        Available
                      </th>

                      <th>
                        Utilization
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {sortedAvailability.map(
                      (item) => {

                        const capacity =
                          getCapacity(
                            item
                          );

                        const booked =
                          getBookedSeats(
                            item
                          );

                        const available =
                          getAvailableSeats(
                            item
                          );

                        const utilization =
                          capacity > 0
                            ? Math.min(
                                Math.round(
                                  (booked /
                                    capacity) *
                                    100
                                ),
                                100
                              )
                            : 0;

                        const status =
                          getStatus(item);

                        const date =
                          normalizeDate(
                            getAvailabilityDate(
                              item
                            )
                          );

                        return (

                          <tr
                            key={
                              item._id ||
                              date
                            }
                            className={
                              selectedDate ===
                              date
                                ? "selected-availability-row"
                                : ""
                            }
                          >

                            {/* DATE */}

                            <td>

                              <div className="schedule-date">

                                <div className="schedule-calendar-icon">
                                  📅
                                </div>

                                <div>

                                  <strong>
                                    {formatDate(
                                      getAvailabilityDate(
                                        item
                                      )
                                    )}
                                  </strong>

                                  {date ===
                                    getToday() && (
                                    <span className="today-badge">
                                      Today
                                    </span>
                                  )}

                                </div>

                              </div>

                            </td>

                            {/* TIMING */}

                            <td>

                              <div className="schedule-time">

                                <strong>
                                  {getOpeningTime(
                                    item
                                  )}
                                </strong>

                                <span>
                                  to
                                </span>

                                <strong>
                                  {getClosingTime(
                                    item
                                  )}
                                </strong>

                              </div>

                            </td>

                            {/* CAPACITY */}

                            <td>

                              <span className="capacity-number">
                                {capacity}
                              </span>

                            </td>

                            {/* BOOKED */}

                            <td>

                              <span className="booked-number">
                                {booked}
                              </span>

                            </td>

                            {/* AVAILABLE */}

                            <td>

                              <span
                                className={
                                  available <=
                                  0
                                    ? "available-number danger"
                                    : available <=
                                      Math.ceil(
                                        capacity *
                                          0.2
                                      )
                                    ? "available-number warning"
                                    : "available-number"
                                }
                              >
                                {available}
                              </span>

                            </td>

                            {/* UTILIZATION */}

                            <td>

                              <div className="utilization">

                                <div className="utilization-text">

                                  <span>
                                    {utilization}%
                                  </span>

                                </div>

                                <div className="utilization-bar">

                                  <div
                                    style={{
                                      width: `${utilization}%`,
                                    }}
                                  ></div>

                                </div>

                              </div>

                            </td>

                            {/* STATUS */}

                            <td>

                              <span
                                className={`availability-status ${getStatusClass(
                                  status
                                )}`}
                              >

                                <i></i>

                                {getStatusLabel(
                                  status
                                )}

                              </span>

                            </td>

                            {/* ACTIONS */}

                            <td>

                              <div className="schedule-actions">

                                <button
                                  className="schedule-edit-btn"
                                  onClick={() =>
                                    handleEdit(
                                      item
                                    )
                                  }
                                >
                                  Edit
                                </button>

                                <button
                                  className={`schedule-toggle-btn ${
                                    getIsAvailable(
                                      item
                                    )
                                      ? "close"
                                      : "open"
                                  }`}
                                  onClick={() =>
                                    handleToggle(
                                      item
                                    )
                                  }
                                  disabled={
                                    saving
                                  }
                                >
                                  {getIsAvailable(
                                    item
                                  )
                                    ? "Close"
                                    : "Open"}
                                </button>

                                <button
                                  className="schedule-delete-btn"
                                  onClick={() =>
                                    handleDelete(
                                      item
                                    )
                                  }
                                >
                                  Delete
                                </button>

                              </div>

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

          {/* =====================================
              BOOKING RULE INFORMATION
          ====================================== */}

          <section className="availability-info">

            <div className="availability-info-icon">
              ℹ
            </div>

            <div>

              <h4>
                How Langar availability works
              </h4>

              <ul>

                <li>
                  <strong>
                    Capacity:
                  </strong>{" "}
                  Maximum number of devotees
                  allowed for the selected date.
                </li>

                <li>
                  <strong>
                    Booked:
                  </strong>{" "}
                  Number of seats already
                  reserved by users.
                </li>

                <li>
                  <strong>
                    Available:
                  </strong>{" "}
                  Capacity minus confirmed
                  bookings.
                </li>

                <li>
                  <strong>
                    Limited:
                  </strong>{" "}
                  Automatically shown when
                  20% or less seats remain.
                </li>

                <li>
                  <strong>
                    Full:
                  </strong>{" "}
                  Automatically shown when all
                  seats have been booked.
                </li>

                <li>
                  <strong>
                    Closed:
                  </strong>{" "}
                  Admin can temporarily stop
                  bookings without deleting
                  the date.
                </li>

              </ul>

            </div>

          </section>

          {/* =====================================
              FOOTER
          ====================================== */}

          <footer className="availability-footer">

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

    </div>
  );
};

export default AdminAvailability;