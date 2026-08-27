import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaArrowRight,
  FaHome,
  FaSearch,
} from "react-icons/fa";

import "./NotFound.css";

const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <main className="not-found-page">

      {/* Decorative background */}
      <div className="not-found-decoration decoration-one"></div>
      <div className="not-found-decoration decoration-two"></div>

      <div className="not-found-container">

        {/* Spiritual Symbol */}
        <div className="not-found-symbol">
          <span>ੴ</span>
        </div>

        {/* 404 */}
        <div className="not-found-number">
          404
        </div>

        {/* Content */}
        <div className="not-found-content">

          <span className="not-found-label">
            PAGE NOT FOUND
          </span>

          <h1>
            This Path Could Not Be Found
          </h1>

          <p>
            The page you are looking for may have been moved,
            removed, or the address you entered may be incorrect.
          </p>

          <p className="not-found-spiritual-text">
            Take a moment, return to the home page, and continue
            your journey with us.
          </p>

        </div>

        {/* Buttons */}
        <div className="not-found-actions">

          <Link
            to="/"
            className="not-found-home-btn"
          >
            <FaHome />
            Go to Home
            <FaArrowRight />
          </Link>

          <button
            type="button"
            className="not-found-back-btn"
            onClick={handleGoBack}
          >
            <FaArrowLeft />
            Go Back
          </button>

        </div>

        {/* Search suggestion */}
        <div className="not-found-help">

          <div className="help-icon">
            <FaSearch />
          </div>

          <div>
            <strong>Looking for something?</strong>

            <p>
              Use the navigation menu to explore Sahib's Gurudwara.
            </p>
          </div>

        </div>

        {/* Footer quote */}
        <div className="not-found-quote">

          <span className="quote-line"></span>

          <div>
            <strong>ਸਰਬੱਤ ਦਾ ਭਲਾ</strong>

            <p>
              May everyone be blessed with peace and wellbeing.
            </p>
          </div>

          <span className="quote-line"></span>

        </div>

      </div>
    </main>
  );
};

export default NotFound;