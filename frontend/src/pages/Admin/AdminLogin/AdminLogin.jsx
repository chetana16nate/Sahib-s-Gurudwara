import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/api";
import "./AdminLogin.css";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const email = formData.email.trim();
    const password = formData.password;

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post(
        "/auth/login",
        {
          email,
          password,
        }
      );

      const data = response.data;

      /*
       * Different backends sometimes return:
       * {
       *   token: "..."
       * }
       *
       * or:
       *
       * {
       *   data: {
       *      token: "..."
       *   }
       * }
       */

      const token =
        data.token ||
        data.accessToken ||
        data.data?.token ||
        data.data?.accessToken;

      if (!token) {
        throw new Error("Authentication token was not received.");
      }

      /*
       * Store admin-specific authentication.
       * This is deliberately separate from normal user login.
       */
      localStorage.setItem("adminToken", token);

      localStorage.setItem(
        "adminUser",
        JSON.stringify(
          data.admin ||
            data.user ||
            data.data?.admin ||
            data.data?.user ||
            {}
        )
      );

      localStorage.setItem("userRole", "ADMIN");

      /*
       * Redirect to admin dashboard.
       */
      navigate("/admin/dashboard", {
        replace: true,
      });
    } catch (err) {
      console.error("Admin login error:", err);

      if (err.response?.status === 401) {
        setError(
          err.response?.data?.message ||
            "Invalid admin email or password."
        );
      } else if (err.response?.status === 403) {
        setError(
          err.response?.data?.message ||
            "You are not authorized to access the admin panel."
        );
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToWebsite = () => {
    navigate("/");
  };

  const handleUserLogin = () => {
    navigate("/user/login");
  };

  return (
    <div className="admin-login-page">
      {/* Decorative Background */}
      <div className="admin-bg-circle admin-bg-circle-one"></div>
      <div className="admin-bg-circle admin-bg-circle-two"></div>

      <div className="admin-login-wrapper">
        {/* Left Side */}
        <div className="admin-login-info">
          <div className="admin-brand">
            <div className="admin-brand-icon">🙏</div>

            <div>
              <h1>Sahib's Gurudwara</h1>
              <span>Langar Seva Management</span>
            </div>
          </div>

          <div className="admin-info-content">
            <span className="admin-overline">
              ADMINISTRATION
            </span>

            <h2>
              Seva begins with
              <br />
              <span>responsibility.</span>
            </h2>

            <p>
              Manage Langar bookings, monitor daily availability,
              view devotees, and keep the Seva experience organized
              for everyone.
            </p>

            <div className="admin-feature-list">
              <div className="admin-feature">
                <span className="feature-icon">📋</span>

                <div>
                  <strong>Manage Bookings</strong>
                  <p>View and manage all Langar bookings.</p>
                </div>
              </div>

              <div className="admin-feature">
                <span className="feature-icon">👥</span>

                <div>
                  <strong>Devotee Management</strong>
                  <p>Keep track of registered devotees.</p>
                </div>
              </div>

              <div className="admin-feature">
                <span className="feature-icon">🎟️</span>

                <div>
                  <strong>Langar Availability</strong>
                  <p>Monitor daily seat capacity and usage.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="admin-quote">
            <span>ੴ</span>

            <p>
              “ਸਰਬੱਤ ਦਾ ਭਲਾ”
              <br />
              <small>Well-being for all.</small>
            </p>
          </div>
        </div>

        {/* Right Side */}
        <div className="admin-login-card">
          <button
            type="button"
            className="back-website-btn"
            onClick={handleBackToWebsite}
          >
            ← Back to Website
          </button>

          <div className="login-card-content">
            <div className="login-icon">
              🔐
            </div>

            <span className="login-label">
              SECURE ACCESS
            </span>

            <h2>Admin Login</h2>

            <p className="login-description">
              Sign in to access the Langar administration panel.
            </p>

            {error && (
              <div className="admin-error">
                <span className="error-icon">⚠️</span>

                <div>
                  <strong>Login failed</strong>
                  <p>{error}</p>
                </div>

                <button
                  type="button"
                  onClick={() => setError("")}
                  aria-label="Close error"
                >
                  ×
                </button>
              </div>
            )}

            <form
              className="admin-login-form"
              onSubmit={handleSubmit}
            >
              {/* Email */}
              <div className="form-group">
                <label htmlFor="email">
                  Admin Email
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">✉️</span>

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter admin email"
                    autoComplete="email"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <label htmlFor="password">
                  Password
                </label>

                <div className="input-wrapper">
                  <span className="input-icon">🔑</span>

                  <input
                    id="password"
                    type={
                      showPassword ? "text" : "password"
                    }
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    disabled={loading}
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
                    }
                    disabled={loading}
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Remember / Security */}
              <div className="login-security-row">
                <div className="security-message">
                  <span>🛡️</span>
                  <span>Secure administrator access</span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="admin-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="button-spinner"></span>
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to Admin Panel
                    <span>→</span>
                  </>
                )}
              </button>
            </form>

            <div className="login-divider">
              <span>OR</span>
            </div>

            <button
              type="button"
              className="user-login-link"
              onClick={handleUserLogin}
            >
              Login as User
              <span>→</span>
            </button>

            <div className="login-footer">
              <span>🔒</span>

              <p>
                This area is restricted to authorized
                administrators only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
