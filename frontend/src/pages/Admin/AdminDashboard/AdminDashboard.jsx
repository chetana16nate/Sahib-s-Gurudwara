import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowRight, BarChart3, CalendarCheck, CircleX, ClipboardList, House, Landmark, LayoutDashboard, LogOut, Menu, RefreshCw, Search, Settings2, Users, UsersRound, X } from "lucide-react";
import "./AdminDashboard.css";

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5000/api" : "/api");

const DEFAULT_CAPACITY = 100;

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(null);
  const [bookings, setBookings] = useState([]);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [capacity, setCapacity] = useState(DEFAULT_CAPACITY);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [sidebarOpen, setSidebarOpen] = useState(false);

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

    fetchDashboardData();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("adminToken");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchDashboardData = async () => {
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
        getAuthHeaders()
      );

      const data = response.data;

      const bookingList =
        data.registrations ||
        data.bookings ||
        data.data ||
        data.results ||
        (Array.isArray(data) ? data : []);

      setBookings(bookingList);

      /*
       * If your backend provides capacity through the dashboard
       * API, this can be changed to use that value.
       */
      if (data.capacity) {
        setCapacity(Number(data.capacity));
      }
    } catch (err) {
      console.error("Dashboard error:", err);

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
          "Unable to load dashboard data."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      await fetchDashboardData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout from the admin panel?"
    );

    if (!confirmed) return;

    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    localStorage.removeItem("userRole");

    navigate("/admin/login", { replace: true });
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

  const getBookingNumber = (booking) => {
    return (
      booking.bookingNumber ||
      booking.bookingId ||
      booking._id?.slice(-8).toUpperCase() ||
      "N/A"
    );
  };

  const getBookingStatus = (booking) => {
    return (
      booking.status ||
      booking.bookingStatus ||
      "confirmed"
    ).toLowerCase();
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

  const formatTime = (date) => {
    if (!date) return "N/A";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "N/A";
    }

    return parsedDate.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const normalizeDate = (date) => {
    if (!date) return "";

    /*
     * Handles YYYY-MM-DD strings without timezone shifting.
     */
    if (
      typeof date === "string" &&
      /^\d{4}-\d{2}-\d{2}/.test(date)
    ) {
      return date.substring(0, 10);
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return "";
    }

    return parsed.toISOString().substring(0, 10);
  };

  /*
   * Bookings for selected date.
   */
  const selectedDateBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        normalizeDate(getBookingDate(booking)) === selectedDate
    );
  }, [bookings, selectedDate]);

  /*
   * Ignore cancelled bookings when calculating occupied seats.
   */
  const activeBookingsForSelectedDate = useMemo(() => {
    return selectedDateBookings.filter((booking) => {
      const status = getBookingStatus(booking);

      return (
        status !== "cancelled" &&
        status !== "canceled"
      );
    });
  }, [selectedDateBookings]);

  const occupiedSeats = useMemo(() => {
    return activeBookingsForSelectedDate.reduce(
      (total, booking) => total + getPeopleCount(booking),
      0
    );
  }, [activeBookingsForSelectedDate]);

  const availableSeats = Math.max(
    capacity - occupiedSeats,
    0
  );

  const occupancyPercentage =
    capacity > 0
      ? Math.min((occupiedSeats / capacity) * 100, 100)
      : 0;

  /*
   * Today's bookings.
   */
  const today = new Date().toISOString().split("T")[0];

  const todaysBookings = useMemo(() => {
    return bookings.filter(
      (booking) =>
        normalizeDate(getBookingDate(booking)) === today
    );
  }, [bookings, today]);

  const activeBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      return (
        status !== "cancelled" &&
        status !== "canceled"
      );
    });
  }, [bookings]);

  const totalPeople = useMemo(() => {
    return activeBookings.reduce(
      (total, booking) => total + getPeopleCount(booking),
      0
    );
  }, [activeBookings]);

  const cancelledBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const status = getBookingStatus(booking);

      return (
        status === "cancelled" ||
        status === "canceled"
      );
    });
  }, [bookings]);

  /*
   * Filter recent bookings.
   */
  const filteredBookings = useMemo(() => {
    return bookings
      .filter((booking) => {
        const search = searchTerm.toLowerCase().trim();

        if (!search) return true;

        const name = getBookingName(booking).toLowerCase();
        const phone = getBookingPhone(booking).toLowerCase();
        const bookingNumber =
          getBookingNumber(booking).toLowerCase();

        return (
          name.includes(search) ||
          phone.includes(search) ||
          bookingNumber.includes(search)
        );
      })
      .filter((booking) => {
        if (statusFilter === "all") return true;

        return getBookingStatus(booking) === statusFilter;
      })
      .sort((a, b) => {
        const dateA = new Date(
          a.createdAt || getBookingDate(a)
        ).getTime();

        const dateB = new Date(
          b.createdAt || getBookingDate(b)
        ).getTime();

        return dateB - dateA;
      });
  }, [bookings, searchTerm, statusFilter]);

  const recentBookings = filteredBookings.slice(0, 10);

  const getStatusClass = (status) => {
    switch (status) {
      case "confirmed":
        return "admin-status-confirmed";

      case "pending":
        return "admin-status-pending";

      case "cancelled":
      case "canceled":
        return "admin-status-cancelled";

      case "completed":
        return "admin-status-completed";

      default:
        return "admin-status-default";
    }
  };

  const getStatusText = (status) => {
    if (!status) return "Confirmed";

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    );
  };

  const handleViewBooking = (booking) => {
    /*
     * If you already have an Admin Booking Details page,
     * change this to:
     *
     * navigate(`/admin/bookings/${booking._id}`);
     */

    navigate("/admin/bookings", {
      state: {
        selectedBooking: booking,
      },
    });
  };

  const handleViewAllBookings = () => {
    navigate("/admin/bookings");
  };

  const handleCapacityManagement = () => {
    navigate("/admin/availability");
  };

  const adminName =
    admin?.name ||
    admin?.fullName ||
    admin?.username ||
    "Administrator";

  if (loading) {
    return (
      <div className="admin-dashboard-loading">
        <div className="admin-loading-symbol">
          <Landmark aria-hidden="true" />
        </div>

        <div className="admin-loading-spinner"></div>

        <h2>Loading Admin Dashboard</h2>

        <p>
          Preparing your Langar Seva management panel...
        </p>
      </div>
    );
  }

  return <div className="admin-dashboard"><aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}><div className="admin-sidebar-brand"><div className="admin-logo"><Landmark/></div><div><h2>Sahib's Gurudwara</h2><span>ADMIN PANEL</span></div><button className="mobile-sidebar-close" onClick={()=>setSidebarOpen(false)}><X/></button></div><nav className="admin-nav"><button className="admin-nav-item active"><LayoutDashboard size={17}/><span>Dashboard</span></button><button className="admin-nav-item" onClick={handleViewAllBookings}><ClipboardList size={17}/><span>All Bookings</span><small>{bookings.length}</small></button><button className="admin-nav-item" onClick={handleCapacityManagement}><Settings2 size={17}/><span>Langar Availability</span></button><button className="admin-nav-item" onClick={()=>navigate("/admin/programs")}><CalendarCheck size={17}/><span>Programs</span></button><button className="admin-nav-item" onClick={()=>navigate("/admin/reports")}><BarChart3 size={17}/><span>Reports</span></button></nav><div className="admin-sidebar-bottom"><button className="admin-nav-item sidebar-website" onClick={()=>navigate("/")}><House size={17}/><span>Visit Website</span></button><button className="admin-logout-btn" onClick={handleLogout}><LogOut size={17}/>Logout</button></div></aside>{sidebarOpen&&<button className="admin-mobile-overlay" onClick={()=>setSidebarOpen(false)} aria-label="Close menu"/>}<main className="admin-main"><header className="admin-topbar"><div className="topbar-left"><button className="mobile-menu-btn" onClick={()=>setSidebarOpen(true)}><Menu size={21}/></button><div><span className="topbar-label">LANGAR SEVA MANAGEMENT</span><h1>Admin Dashboard</h1></div></div><div className="admin-profile"><div className="admin-profile-avatar">{adminName.charAt(0).toUpperCase()}</div><div className="admin-profile-info"><strong>{adminName}</strong><span>Administrator</span></div><button className="profile-logout" onClick={handleLogout}><LogOut size={17}/></button></div></header><div className="admin-content"><section className="admin-welcome"><div><span className="welcome-label">WAHEGURU JI KA KHALSA</span><h2>Welcome back, {adminName}</h2><p>Here's what's happening with Langar Seva today.</p></div><button className="refresh-btn" onClick={handleRefresh} disabled={refreshing}><RefreshCw size={16} className={refreshing?"refresh-spinning":""}/>{refreshing?"Refreshing...":"Refresh"}</button></section>{error&&<div className="dashboard-error"><div><strong>Unable to load data</strong><p>{error}</p></div><button onClick={fetchDashboardData}>Retry</button></div>}<section className="admin-stat-grid"><div className="admin-stat-card"><div className="stat-card-top"><div className="stat-icon stat-icon-bookings"><ClipboardList/></div><span className="stat-badge">All Time</span></div><span className="stat-label">Total Bookings</span><strong className="stat-number">{bookings.length}</strong><p>All registered Langar bookings</p></div><div className="admin-stat-card"><div className="stat-card-top"><div className="stat-icon stat-icon-today"><CalendarCheck/></div><span className="stat-badge stat-badge-green">Today</span></div><span className="stat-label">Today's Bookings</span><strong className="stat-number">{todaysBookings.length}</strong><p>Bookings scheduled for today</p></div><div className="admin-stat-card"><div className="stat-card-top"><div className="stat-icon stat-icon-people"><UsersRound/></div><span className="stat-badge stat-badge-blue">Active</span></div><span className="stat-label">Total Devotees</span><strong className="stat-number">{totalPeople}</strong><p>People across active bookings</p></div><div className="admin-stat-card"><div className="stat-card-top"><div className="stat-icon stat-icon-cancelled"><CircleX/></div><span className="stat-badge stat-badge-red">Cancelled</span></div><span className="stat-label">Cancelled Bookings</span><strong className="stat-number">{cancelledBookings.length}</strong><p>Bookings that were cancelled</p></div></section><section className="availability-panel"><div className="availability-header"><div><span className="panel-overline">LANGAR CAPACITY</span><h2>Daily Seat Availability</h2><p>Monitor how many Langar seats are occupied and remaining.</p></div><div className="date-selector"><label htmlFor="dashboard-date">Select Date</label><input id="dashboard-date" type="date" value={selectedDate} onChange={e=>setSelectedDate(e.target.value)}/></div></div><div className="availability-content"><div className="availability-number"><span>AVAILABLE SEATS</span><strong>{availableSeats}</strong><small>out of {capacity} total seats</small></div><div className="availability-progress-area"><div className="progress-header"><span>{occupiedSeats} seats occupied</span><strong>{Math.round(occupancyPercentage)}%</strong></div><div className="capacity-progress"><div className="capacity-progress-fill" style={{width:`${occupancyPercentage}%`}}/></div><div className="progress-footer"><span>{selectedDateBookings.length} bookings</span><span>{availableSeats===0?"Fully Booked":`${availableSeats} seats remaining`}</span></div></div><button className="manage-capacity-btn" onClick={handleCapacityManagement}>Manage Capacity <ArrowRight size={17}/></button></div></section><section className="quick-actions-section"><div className="section-title"><div><span className="panel-overline">ADMINISTRATION</span><h2>Quick Actions</h2></div></div><div className="quick-actions-grid"><button className="quick-action-card" onClick={handleViewAllBookings}><span className="quick-action-icon"><ClipboardList/></span><div><strong>View All Bookings</strong><p>Review and manage devotee bookings.</p></div><ArrowRight className="quick-arrow" size={17}/></button><button className="quick-action-card" onClick={handleCapacityManagement}><span className="quick-action-icon"><Settings2/></span><div><strong>Manage Availability</strong><p>Set daily Langar seat capacity.</p></div><ArrowRight className="quick-arrow" size={17}/></button><button className="quick-action-card" onClick={()=>navigate("/admin/reports")}><span className="quick-action-icon"><BarChart3/></span><div><strong>View Reports</strong><p>Check booking statistics and reports.</p></div><ArrowRight className="quick-arrow" size={17}/></button></div></section><section className="recent-bookings-section"><div className="recent-bookings-header"><div><span className="panel-overline">BOOKING MANAGEMENT</span><h2>Recent Bookings</h2><p>Latest Langar bookings from devotees.</p></div><button className="view-all-btn" onClick={handleViewAllBookings}>View All <ArrowRight size={17}/></button></div><div className="booking-filters"><div className="search-box"><Search size={16}/><input value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} placeholder="Search by name, phone or booking number..."/></div><select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}><option value="all">All Statuses</option><option value="confirmed">Confirmed</option><option value="pending">Pending</option><option value="cancelled">Cancelled</option></select></div>{recentBookings.length===0?<div className="no-admin-bookings"><div><ClipboardList size={28}/></div><h3>No bookings found</h3><p>There are no bookings matching your current filters.</p></div>:<div className="admin-table-wrapper"><table className="admin-bookings-table"><thead><tr><th>Booking</th><th>Devotee</th><th>Date</th><th>People</th><th>Booked On</th><th>Status</th><th/></tr></thead><tbody>{recentBookings.map(booking=>{const status=getBookingStatus(booking);return <tr key={booking._id}><td><strong className="table-booking-number">{getBookingNumber(booking)}</strong></td><td><div className="devotee-cell"><div className="devotee-avatar">{getBookingName(booking).charAt(0).toUpperCase()}</div><div><strong>{getBookingName(booking)}</strong><span>{getBookingPhone(booking)}</span></div></div></td><td><strong>{formatDate(getBookingDate(booking))}</strong></td><td><span className="people-count"><Users size={15}/> {getPeopleCount(booking)}</span></td><td><span className="booked-time">{formatDate(booking.createdAt)}<small>{formatTime(booking.createdAt)}</small></span></td><td><span className={`admin-status ${getStatusClass(status)}`}><span/>{getStatusText(status)}</span></td><td><button className="table-view-btn" onClick={()=>handleViewBooking(booking)}>View</button></td></tr>})}</tbody></table></div>}</section><section className="admin-session-panel"><div className="admin-session-icon"><LogOut size={22}/></div><div><span className="panel-overline">ADMIN SESSION</span><h2>Ready to leave the dashboard?</h2><p>You can securely end this administrator session at any time.</p></div><button className="admin-session-logout" onClick={handleLogout}><LogOut size={17}/> Log out securely</button></section><footer className="admin-dashboard-footer"><div><strong>Waheguru Ji Ka Khalsa, Waheguru Ji Ki Fateh</strong><p>Langar Seva Management · Sahib's Gurudwara</p></div><span>© {new Date().getFullYear()} Sahib's Gurudwara</span></footer></div></main></div>;
};
export default AdminDashboard;



