import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    LogIn,
    UserPlus
} from 'lucide-react';
import { api } from './../../../api/api';
import './UserLogin.css';

export default function UserLogin() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: '',
        password: ''
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));

        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError('');

        if (!form.email.trim() || !form.password) {
            setError('Please enter your email and password.');
            return;
        }

        try {
            setLoading(true);

            const response = await api.post('/auth/user/login', {
                email: form.email.trim().toLowerCase(),
                password: form.password
            });

            const data = response.data;

            if (!data?.token || !data?.user) {
                setError('Invalid response received from server.');
                return;
            }

            /*
             * Store USER authentication separately.
             *
             * Admin uses a different token:
             * adminToken
             *
             * User uses:
             * userToken
             */

            localStorage.setItem('userToken', data.token);

            localStorage.setItem(
                'user',
                JSON.stringify(data.user)
            );

            /*
             * Remove any old admin session.
             *
             * This prevents the browser from accidentally
             * behaving as both admin and user.
             */

            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');

            /*
             * User goes directly to Langar.
             */

            navigate('/langar', {
                replace: true
            });

        } catch (err) {
            console.error('User login error:', err);

            setError(
                err.response?.data?.message ||
                'Unable to login. Please check your email and password.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-login-page">
            <aside className="user-login-brand" aria-label="Sahib's Gurudwara">
                <div className="user-login-brand-content">
                    <div className="user-login-brand-symbol">ੴ</div>
                    <h2>Sahib's Gurudwara</h2>
                    <p>Welcome to our Sangat community.</p>
                    <span>Login to manage Langar bookings and participate in Seva.</span>
                </div>
            </aside>
            <div className="user-login-container">
            <div className="user-login-card">

                {/* =====================================
                    HEADER
                ====================================== */}

                <div className="user-login-header">

                    <div className="user-login-logo">
                        <span>ੴ</span>
                    </div>

                    <h1>Welcome Back</h1>

                    <p>
                        Login to your Sangat account to
                        manage your Langar bookings.
                    </p>

                </div>

                {/* =====================================
                    ERROR
                ====================================== */}

                {error && (
                    <div className="user-login-error">
                        {error}
                    </div>
                )}

                {/* =====================================
                    LOGIN FORM
                ====================================== */}

                <form
                    className="user-login-form"
                    onSubmit={handleSubmit}
                >

                    {/* EMAIL */}

                    <div className="user-login-field">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <div className="user-login-input">

                            <Mail size={19} />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="Enter your email"
                                autoComplete="email"
                                disabled={loading}
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div className="user-login-field">

                        <label htmlFor="password">
                            Password
                        </label>

                        <div className="user-login-input">

                            <Lock size={19} />

                            <input
                                id="password"
                                name="password"
                                type={
                                    showPassword
                                        ? 'text'
                                        : 'password'
                                }
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                                disabled={loading}
                            />

                            <button
                                type="button"
                                className="user-login-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        (previous) =>
                                            !previous
                                    )
                                }
                                aria-label={
                                    showPassword
                                        ? 'Hide password'
                                        : 'Show password'
                                }
                            >
                                {showPassword ? (
                                    <EyeOff size={19} />
                                ) : (
                                    <Eye size={19} />
                                )}
                            </button>

                        </div>

                    </div>

                    {/* FORGOT PASSWORD */}

                    <div className="user-login-options">

                        <Link
                            to="/forgot-password"
                            className="forgot-password-link"
                        >
                            Forgot Password?
                        </Link>

                    </div>

                    {/* LOGIN */}

                    <button
                        type="submit"
                        className="user-login-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="login-spinner"></span>

                                Logging in...
                            </>
                        ) : (
                            <>
                                <LogIn size={19} />

                                Login
                            </>
                        )}

                    </button>

                </form>

                {/* =====================================
                    REGISTER
                ====================================== */}

                <div className="user-login-register">

                    <p>
                        Don't have a Sangat account?
                    </p>

                    <Link
                        to="/register"
                        className="register-link"
                    >
                        <UserPlus size={17} />

                        Create Account
                    </Link>

                </div>

                {/* =====================================
                    ADMIN
                ====================================== */}

                <div className="user-admin-section">

                    <div className="user-admin-divider">
                        <span>Administration</span>
                    </div>

                    <p>
                        Gurudwara administrators can access
                        the management dashboard separately.
                    </p>

                    <Link
                        to="/admin/login"
                        className="admin-login-link"
                    >
                        Admin Login
                    </Link>

                </div>

                {/* =====================================
                    SPIRITUAL FOOTER
                ====================================== */}

                <div className="user-login-spiritual">

                    <span>ੴ</span>

                    <p>
                        ਸਰਬੱਤ ਦਾ ਭਲਾ
                    </p>

                    <small>
                        May everyone be blessed and well
                    </small>

                </div>
            </div>
            </div>
        </div>
    );
}
