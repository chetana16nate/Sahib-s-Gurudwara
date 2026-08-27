import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { api } from "../../../api/api";
import "./UserRegister.css";

export default function UserRegister() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // HANDLE INPUT
    // =====================================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    // =====================================================
    // FORM SUBMIT
    // =====================================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // -----------------------------
        // Required fields
        // -----------------------------

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.phone.trim() ||
            !form.password ||
            !form.confirmPassword
        ) {
            setError("Please fill in all fields.");
            return;
        }

        // -----------------------------
        // Name validation
        // -----------------------------

        if (form.name.trim().length < 2) {
            setError("Please enter a valid name.");
            return;
        }

        // -----------------------------
        // Email validation
        // -----------------------------

        const emailRegex =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        // -----------------------------
        // Phone validation
        // -----------------------------

        const phoneRegex = /^[0-9+\-\s()]{7,20}$/;

        if (!phoneRegex.test(form.phone.trim())) {
            setError("Please enter a valid phone number.");
            return;
        }

        // -----------------------------
        // PASSWORD VALIDATION
        // -----------------------------

        if (form.password.length < 8) {
            setError(
                "Password must contain at least 8 characters."
            );
            return;
        }

        // -----------------------------
        // Confirm password
        // -----------------------------

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            // =================================================
            // USER REGISTER API
            // IMPORTANT:
            // /auth/user/register
            // NOT /users/register
            // =================================================

            const response = await api.post(
                "/auth/user/register",
                {
                    name: form.name.trim(),
                    email: form.email.trim().toLowerCase(),
                    phone: form.phone.trim(),
                    password: form.password,
                }
            );

            // =================================================
            // SAVE USER TOKEN
            // =================================================

            localStorage.setItem(
                "userToken",
                response.data.token
            );

            // =================================================
            // SAVE USER INFORMATION
            // =================================================

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            // =================================================
            // REMOVE ADMIN SESSION
            // =================================================

            localStorage.removeItem("adminToken");
            localStorage.removeItem("admin");

            setSuccess(
                "Registration successful! Redirecting..."
            );

            // =================================================
            // REDIRECT TO LANGAR
            // =================================================

            setTimeout(() => {
                navigate("/langar");
            }, 700);

        } catch (err) {
    console.error("========== USER REGISTRATION ERROR ==========");
    console.error("Status:", err?.response?.status);
    console.error("Response:", err?.response?.data);
    console.error("Message:", err?.message);
    console.error("Full error:", err);

    const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Registration failed. Please try again.";

    setError(message);
}
         finally {
            setLoading(false);
        }
    };

    return (
        <div className="user-register-page">

            {/* =================================================
                LEFT / BRANDING SECTION
            ================================================= */}

            <div className="user-register-brand">

                <div className="brand-overlay">

                    <div className="brand-content">

                        <div className="brand-symbol">
                            ੴ
                        </div>

                        <h1>
                            Sahib's Gurudwara
                        </h1>

                        <p>
                            Welcome to our Sangat community.
                        </p>

                        <p className="brand-subtitle">
                            Register to book Langar and
                            participate in Seva.
                        </p>

                    </div>

                </div>

            </div>


            {/* =================================================
                RIGHT / REGISTER FORM
            ================================================= */}

            <div className="user-register-container">

                <div className="user-register-card">

                    {/* Header */}

                    <div className="register-header">

                        <div className="register-icon">
                            <User size={28} />
                        </div>

                        <h2>
                            Create Account
                        </h2>

                        <p>
                            Join Sahib's Gurudwara
                        </p>

                    </div>


                    {/* Error */}

                    {error && (
                        <div className="register-message error-message">
                            {error}
                        </div>
                    )}


                    {/* Success */}

                    {success && (
                        <div className="register-message success-message">
                            {success}
                        </div>
                    )}


                    {/* Form */}

                    <form
                        onSubmit={handleSubmit}
                        className="register-form"
                    >

                        {/* NAME */}

                        <div className="form-group">

                            <label htmlFor="name">
                                Full Name
                            </label>

                            <div className="input-wrapper">

                                <User
                                    className="input-icon"
                                    size={19}
                                />

                                <input
                                    id="name"
                                    type="text"
                                    name="name"
                                    placeholder="Enter your full name"
                                    value={form.name}
                                    onChange={handleChange}
                                    autoComplete="name"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <div className="input-wrapper">

                                <Mail
                                    className="input-icon"
                                    size={19}
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="Enter your email"
                                    value={form.email}
                                    onChange={handleChange}
                                    autoComplete="email"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* PHONE */}

                        <div className="form-group">

                            <label htmlFor="phone">
                                Phone Number
                            </label>

                            <div className="input-wrapper">

                                <Phone
                                    className="input-icon"
                                    size={19}
                                />

                                <input
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    placeholder="Enter your phone number"
                                    value={form.phone}
                                    onChange={handleChange}
                                    autoComplete="tel"
                                    disabled={loading}
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <Lock
                                    className="input-icon"
                                    size={19}
                                />

                                <input
                                    id="password"
                                    type={
                                        showPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="password"
                                    placeholder="Minimum 8 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            !showPassword
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
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


                        {/* CONFIRM PASSWORD */}

                        <div className="form-group">

                            <label htmlFor="confirmPassword">
                                Confirm Password
                            </label>

                            <div className="input-wrapper">

                                <Lock
                                    className="input-icon"
                                    size={19}
                                />

                                <input
                                    id="confirmPassword"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    name="confirmPassword"
                                    placeholder="Confirm your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    autoComplete="new-password"
                                    disabled={loading}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    disabled={loading}
                                    aria-label={
                                        showConfirmPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* PASSWORD INFO */}

                        <div className="password-info">
                            Password must contain at least 8
                            characters.
                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <span className="spinner"></span>
                                    Creating Account...
                                </>
                            ) : (
                                "Create Account"
                            )}

                        </button>

                    </form>


                    {/* LOGIN */}

                    <div className="login-link">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/user/login">
                            Login
                        </Link>

                    </div>


                    {/* ADMIN LINK */}

                    <div className="admin-login-link">

                        <Link to="/admin/login">
                            Admin Login
                        </Link>

                    </div>

                </div>

            </div>

        </div>
    );
}