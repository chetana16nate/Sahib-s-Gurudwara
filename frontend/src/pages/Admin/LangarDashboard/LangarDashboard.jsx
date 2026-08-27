import { useEffect, useMemo, useState } from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Clock3,
    LogOut,
    RefreshCw,
    Search,
    Users,
    UtensilsCrossed,
    XCircle,
    Eye,
    EyeOff,
    ShieldCheck,
    HeartHandshake
} from 'lucide-react';

import { api } from '../../api';
import './LangarDashboard.css';

const getToday = () => {
    const date = new Date();
    const offset = date.getTimezoneOffset();

    return new Date(date.getTime() - offset * 60000)
        .toISOString()
        .slice(0, 10);
};

export default function LangarDashboard() {
    const [token, setToken] = useState(
        localStorage.getItem('langarAdminToken') || ''
    );

    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });

    const [date, setDate] = useState(getToday());
    const [data, setData] = useState(null);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginLoading, setLoginLoading] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const headers = {
        Authorization: `Bearer ${token}`
    };

    /* =========================================================
       LOAD DASHBOARD
    ========================================================= */

    const load = async (selectedDate = date) => {
        if (!token) return;

        try {
            setLoading(true);
            setError('');

            const response = await api.get(
                '/langar/admin/dashboard',
                {
                    params: {
                        date: selectedDate
                    },
                    headers
                }
            );

            setData(response.data);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                'Unable to load the Langar dashboard.'
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {
        if (token) {
            load();
        }
    }, [token]);

    /* =========================================================
       LOGIN
    ========================================================= */

    const login = async (e) => {
        e.preventDefault();

        try {
            setLoginLoading(true);
            setError('');

            const response = await api.post(
                '/auth/login',
                credentials
            );

            localStorage.setItem(
                'langarAdminToken',
                response.data.token
            );

            setToken(response.data.token);
        } catch (e) {
            setError(
                e.response?.data?.message ||
                'Login failed. Please check your email and password.'
            );
        } finally {
            setLoginLoading(false);
        }
    };

    /* =========================================================
       LOGOUT
    ========================================================= */

    const logout = () => {
        localStorage.removeItem('langarAdminToken');

        setToken('');
        setData(null);
        setError('');
        setSearch('');
        setStatusFilter('all');
    };

    /* =========================================================
       UPDATE REGISTRATION
    ========================================================= */

    const update = async (id, body) => {
        try {
            setError('');

            await api.patch(
                `/langar/admin/registrations/${id}`,
                body,
                { headers }
            );

            await load();
        } catch (e) {
            setError(
                e.response?.data?.message ||
                'Unable to update this registration.'
            );
        }
    };

    /* =========================================================
       FILTER REGISTRATIONS
    ========================================================= */

    const filteredRegistrations = useMemo(() => {
        if (!data?.registrations) return [];

        return data.registrations.filter((item) => {
            const searchValue = search.toLowerCase().trim();

            const matchesSearch =
                !searchValue ||
                item.fullName?.toLowerCase().includes(searchValue) ||
                item.phone?.toLowerCase().includes(searchValue) ||
                item.reference?.toLowerCase().includes(searchValue) ||
                item.organization?.toLowerCase().includes(searchValue);

            const matchesStatus =
                statusFilter === 'all' ||
                item.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [data, search, statusFilter]);

    /* =========================================================
       LOGIN SCREEN
    ========================================================= */

    if (!token) {
        return (
            <main className="admin-login-page">

                <div className="admin-login-background-symbol">
                    ੴ
                </div>

                <div className="admin-login-card">

                    <div className="admin-login-symbol">
                        ੴ
                    </div>

                    <div className="admin-login-heading">

                        <span className="admin-eyebrow">
                            <ShieldCheck size={15} />
                            Secure Administration
                        </span>

                        <h1>
                            Langar Admin
                        </h1>

                        <p>
                            Manage daily Langar registrations,
                            capacity and community service.
                        </p>

                    </div>

                    {error && (
                        <div className="admin-error">
                            <XCircle size={18} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form
                        className="admin-login-form"
                        onSubmit={login}
                    >

                        <div className="admin-field">

                            <label htmlFor="admin-email">
                                Email Address
                            </label>

                            <input
                                id="admin-email"
                                required
                                type="email"
                                placeholder="Enter your email"
                                value={credentials.email}
                                onChange={(e) =>
                                    setCredentials({
                                        ...credentials,
                                        email: e.target.value
                                    })
                                }
                            />

                        </div>

                        <div className="admin-field">

                            <label htmlFor="admin-password">
                                Password
                            </label>

                            <div className="password-wrapper">

                                <input
                                    id="admin-password"
                                    required
                                    type={
                                        showPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    placeholder="Enter your password"
                                    value={credentials.password}
                                    onChange={(e) =>
                                        setCredentials({
                                            ...credentials,
                                            password: e.target.value
                                        })
                                    }
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    aria-label={
                                        showPassword
                                            ? 'Hide password'
                                            : 'Show password'
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>

                            </div>

                        </div>

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loginLoading}
                        >

                            {loginLoading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <ShieldCheck size={18} />
                                    Sign in securely
                                </>
                            )}

                        </button>

                    </form>

                    <div className="admin-login-footer">

                        <HeartHandshake size={17} />

                        <span>
                            Serving the community through Seva
                        </span>

                    </div>

                </div>

            </main>
        );
    }

    /* =========================================================
       DASHBOARD
    ========================================================= */

    return (
        <main className="admin-langar-page">

            <div className="admin-langar-container">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <header className="admin-dashboard-header">

                    <div className="admin-title-section">

                        <div className="admin-title-symbol">
                            ੴ
                        </div>

                        <div>

                            <span className="admin-eyebrow">
                                Langar Management
                            </span>

                            <h1>
                                Daily Langar Dashboard
                            </h1>

                            <p>
                                Manage registrations and serve the
                                Sangat with care.
                            </p>

                        </div>

                    </div>

                    <div className="admin-header-actions">

                        <button
                            type="button"
                            className="admin-refresh-button"
                            onClick={() => load()}
                            disabled={loading}
                            title="Refresh dashboard"
                        >

                            <RefreshCw
                                size={17}
                                className={loading ? 'spinning' : ''}
                            />

                            <span>
                                Refresh
                            </span>

                        </button>

                        <button
                            type="button"
                            className="admin-logout-button"
                            onClick={logout}
                        >

                            <LogOut size={17} />

                            <span>
                                Logout
                            </span>

                        </button>

                    </div>

                </header>

                {/* =====================================================
                    DATE CONTROL
                ===================================================== */}

                <section className="admin-date-panel">

                    <div className="date-panel-content">

                        <div className="date-icon">
                            <CalendarDays size={21} />
                        </div>

                        <div>

                            <span>
                                Manage Langar for
                            </span>

                            <strong>
                                Select a date
                            </strong>

                        </div>

                    </div>

                    <div className="date-controls">

                        <input
                            type="date"
                            value={date}
                            onChange={(e) =>
                                setDate(e.target.value)
                            }
                        />

                        <button
                            type="button"
                            className="admin-primary-button"
                            onClick={() => load(date)}
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="button-spinner"></span>
                                    Loading...
                                </>
                            ) : (
                                <>
                                    <Eye size={17} />
                                    View Day
                                </>
                            )}

                        </button>

                    </div>

                </section>

                {/* =====================================================
                    ERROR
                ===================================================== */}

                {error && (
                    <div className="admin-error dashboard-error">

                        <XCircle size={19} />

                        <span>
                            {error}
                        </span>

                    </div>
                )}

                {/* =====================================================
                    LOADING
                ===================================================== */}

                {loading && !data && (
                    <div className="admin-loading">

                        <div className="loading-spinner"></div>

                        <p>
                            Loading Langar information...
                        </p>

                    </div>
                )}

                {/* =====================================================
                    DASHBOARD DATA
                ===================================================== */}

                {data && (
                    <>

                        {/* =================================================
                            STATISTICS
                        ================================================= */}

                        <section className="admin-stats">

                            <div className="admin-stat-card capacity">

                                <div className="stat-icon">
                                    <Users size={21} />
                                </div>

                                <div>

                                    <span>
                                        Daily Capacity
                                    </span>

                                    <strong>
                                        {data.capacity}
                                    </strong>

                                    <small>
                                        People
                                    </small>

                                </div>

                            </div>

                            <div className="admin-stat-card confirmed">

                                <div className="stat-icon">
                                    <CheckCircle2 size={21} />
                                </div>

                                <div>

                                    <span>
                                        Confirmed
                                    </span>

                                    <strong>
                                        {data.confirmed}
                                    </strong>

                                    <small>
                                        Registered people
                                    </small>

                                </div>

                            </div>

                            <div className="admin-stat-card remaining">

                                <div className="stat-icon">
                                    <UtensilsCrossed size={21} />
                                </div>

                                <div>

                                    <span>
                                        Remaining
                                    </span>

                                    <strong>
                                        {data.remaining}
                                    </strong>

                                    <small>
                                        Available places
                                    </small>

                                </div>

                            </div>

                            <div className="admin-stat-card waitlist">

                                <div className="stat-icon">
                                    <Clock3 size={21} />
                                </div>

                                <div>

                                    <span>
                                        Waitlist
                                    </span>

                                    <strong>
                                        {data.waitlist}
                                    </strong>

                                    <small>
                                        Awaiting confirmation
                                    </small>

                                </div>

                            </div>

                        </section>

                        {/* =================================================
                            REGISTRATION SECTION
                        ================================================= */}

                        <section className="admin-registration-section">

                            <div className="registration-heading">

                                <div>

                                    <span className="admin-eyebrow">
                                        Sangat Registrations
                                    </span>

                                    <h2>
                                        Today's Guests
                                    </h2>

                                    <p>
                                        Review registrations and
                                        manage check-ins.
                                    </p>

                                </div>

                                <div className="registration-count">
                                    {filteredRegistrations.length}
                                </div>

                            </div>

                            {/* =================================================
                                SEARCH / FILTER
                            ================================================= */}

                            <div className="registration-toolbar">

                                <div className="admin-search">

                                    <Search size={18} />

                                    <input
                                        type="search"
                                        placeholder="Search name, phone or reference..."
                                        value={search}
                                        onChange={(e) =>
                                            setSearch(e.target.value)
                                        }
                                    />

                                </div>

                                <div className="status-filter">

                                    <label htmlFor="status-filter">
                                        Status
                                    </label>

                                    <select
                                        id="status-filter"
                                        value={statusFilter}
                                        onChange={(e) =>
                                            setStatusFilter(e.target.value)
                                        }
                                    >

                                        <option value="all">
                                            All
                                        </option>

                                        <option value="confirmed">
                                            Confirmed
                                        </option>

                                        <option value="waitlisted">
                                            Waitlisted
                                        </option>

                                        <option value="cancelled">
                                            Cancelled
                                        </option>

                                    </select>

                                </div>

                            </div>

                            {/* =================================================
                                DESKTOP TABLE
                            ================================================= */}

                            <div className="admin-table-wrap">

                                <table>

                                    <thead>

                                        <tr>

                                            <th>
                                                Reference
                                            </th>

                                            <th>
                                                Name / Phone
                                            </th>

                                            {/* TYPE IS NOW BEFORE PEOPLE */}
                                            <th>
                                                Type
                                            </th>

                                            <th>
                                                People
                                            </th>

                                            <th>
                                                Group
                                            </th>

                                            <th>
                                                Status
                                            </th>

                                            <th>
                                                Check-in
                                            </th>

                                            <th>
                                                Action
                                            </th>

                                        </tr>

                                    </thead>

                                    <tbody>

                                        {filteredRegistrations.map(
                                            (item) => (

                                                <tr key={item._id}>

                                                    <td>

                                                        <span className="reference-code">
                                                            {item.reference}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <div className="guest-name">
                                                            {item.fullName}
                                                        </div>

                                                        <small className="guest-phone">
                                                            {item.phone}
                                                        </small>

                                                    </td>

                                                    {/* TYPE BEFORE PEOPLE */}
                                                    <td>
                                                        {item.bookingType}
                                                    </td>

                                                    <td>

                                                        <strong>
                                                            {item.people}
                                                        </strong>

                                                    </td>

                                                    <td>
                                                        {item.organization ||
                                                            '—'}
                                                    </td>

                                                    <td>

                                                        <span
                                                            className={`status-badge ${item.status}`}
                                                        >
                                                            {item.status}
                                                        </span>

                                                    </td>

                                                    <td>

                                                        <label className="checkin-control">

                                                            <input
                                                                checked={
                                                                    !!item.checkedIn
                                                                }
                                                                type="checkbox"
                                                                onChange={(e) =>
                                                                    update(
                                                                        item._id,
                                                                        {
                                                                            checkedIn:
                                                                                e
                                                                                    .target
                                                                                    .checked
                                                                        }
                                                                    )
                                                                }
                                                            />

                                                            <span>
                                                                {item.checkedIn
                                                                    ? 'Checked in'
                                                                    : 'Pending'}
                                                            </span>

                                                        </label>

                                                    </td>

                                                    <td>

                                                        <select
                                                            className="status-select"
                                                            value={
                                                                item.status
                                                            }
                                                            onChange={(e) =>
                                                                update(
                                                                    item._id,
                                                                    {
                                                                        status:
                                                                            e
                                                                                .target
                                                                                .value
                                                                    }
                                                                )
                                                            }
                                                        >

                                                            <option value="confirmed">
                                                                Confirm
                                                            </option>

                                                            <option value="waitlisted">
                                                                Waitlist
                                                            </option>

                                                            <option value="cancelled">
                                                                Cancel
                                                            </option>

                                                        </select>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                                {filteredRegistrations.length === 0 && (

                                    <div className="empty-state">

                                        <div className="empty-icon">
                                            <Users size={25} />
                                        </div>

                                        <h3>
                                            No registrations found
                                        </h3>

                                        <p>
                                            Try changing the search
                                            or status filter.
                                        </p>

                                    </div>

                                )}

                            </div>

                            {/* =================================================
                                MOBILE CARDS
                            ================================================= */}

                            <div className="admin-mobile-list">

                                {filteredRegistrations.map((item) => (

                                    <article
                                        className="registration-card"
                                        key={item._id}
                                    >

                                        <div className="registration-card-top">

                                            <div>

                                                <span className="reference-code">
                                                    {item.reference}
                                                </span>

                                                <h3>
                                                    {item.fullName}
                                                </h3>

                                                <p>
                                                    {item.phone}
                                                </p>

                                            </div>

                                            <span
                                                className={`status-badge ${item.status}`}
                                            >
                                                {item.status}
                                            </span>

                                        </div>

                                        {/* TYPE → PEOPLE → GROUP */}
                                        <div className="registration-details">

                                            <div>

                                                <span>
                                                    Type
                                                </span>

                                                <strong>
                                                    {item.bookingType}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    People
                                                </span>

                                                <strong>
                                                    {item.people}
                                                </strong>

                                            </div>

                                            <div>

                                                <span>
                                                    Group
                                                </span>

                                                <strong>
                                                    {item.organization ||
                                                        '—'}
                                                </strong>

                                            </div>

                                        </div>

                                        <div className="registration-card-actions">

                                            <label className="mobile-checkin">

                                                <input
                                                    checked={
                                                        !!item.checkedIn
                                                    }
                                                    type="checkbox"
                                                    onChange={(e) =>
                                                        update(
                                                            item._id,
                                                            {
                                                                checkedIn:
                                                                    e.target
                                                                        .checked
                                                            }
                                                        )
                                                    }
                                                />

                                                <span>
                                                    {item.checkedIn
                                                        ? 'Checked in'
                                                        : 'Check in guest'}
                                                </span>

                                            </label>

                                            <select
                                                className="status-select"
                                                value={item.status}
                                                onChange={(e) =>
                                                    update(
                                                        item._id,
                                                        {
                                                            status:
                                                                e.target.value
                                                        }
                                                    )
                                                }
                                            >

                                                <option value="confirmed">
                                                    Confirm
                                                </option>

                                                <option value="waitlisted">
                                                    Waitlist
                                                </option>

                                                <option value="cancelled">
                                                    Cancel
                                                </option>

                                            </select>

                                        </div>

                                    </article>

                                ))}

                                {filteredRegistrations.length === 0 && (

                                    <div className="empty-state">

                                        <div className="empty-icon">
                                            <Users size={25} />
                                        </div>

                                        <h3>
                                            No registrations found
                                        </h3>

                                        <p>
                                            Try changing the search
                                            or status filter.
                                        </p>

                                    </div>

                                )}

                            </div>

                        </section>

                        {/* =================================================
                            FOOTER NOTE
                        ================================================= */}

                        <div className="admin-seva-note">

                            <span>
                                ੴ
                            </span>

                            <p>
                                Every meal served is an expression of
                                <strong>
                                    {' '}Seva, equality and compassion.
                                </strong>
                            </p>

                        </div>

                    </>
                )}

            </div>

        </main>
    );
}