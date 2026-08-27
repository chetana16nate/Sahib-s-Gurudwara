import React from "react";
import { Link } from "react-router-dom";
import "./HealthcareCamps.css";

const HealthcareCamps = () => {
  const healthcareServices = [
    {
      icon: "🩺",
      title: "General Health Checkups",
      description:
        "Regular health checkup camps to help community members monitor their general health and wellbeing.",
    },
    {
      icon: "❤️",
      title: "Heart & Blood Pressure",
      description:
        "Basic blood pressure, pulse and cardiovascular health screening conducted during selected camps.",
    },
    {
      icon: "🩸",
      title: "Blood Sugar Screening",
      description:
        "Basic blood glucose screening and awareness sessions to encourage healthy lifestyle choices.",
    },
    {
      icon: "👁️",
      title: "Eye Care Camps",
      description:
        "Eye screening and awareness programmes to support better vision and eye health within the community.",
    },
    {
      icon: "🦷",
      title: "Dental Awareness",
      description:
        "Dental health awareness sessions covering oral hygiene, preventive care and healthy habits.",
    },
    {
      icon: "👩‍⚕️",
      title: "Health Awareness",
      description:
        "Educational sessions and community awareness programmes focused on preventive healthcare.",
    },
  ];

  return (
    <div className="healthcare-page">
      {/* Hero */}
      <section className="healthcare-hero">
        <div className="healthcare-hero-overlay">
          <span className="healthcare-small-title">COMMUNITY CARE</span>

          <h1>Healthcare Camps</h1>

          <p>
            Caring for our community through accessible healthcare,
            awareness and wellness initiatives.
          </p>

          <Link to="/services" className="healthcare-back-btn">
            ← Back to Services
          </Link>
        </div>
      </section>

      {/* Introduction */}
      <section className="healthcare-intro">
        <div className="healthcare-intro-content">
          <span className="section-label">HEALTH & WELLBEING</span>

          <h2>
            Healthcare with
            <br />
            <span>Seva at Heart</span>
          </h2>

          <p>
            At Sahib's Gurudwara, we believe that seva extends beyond
            spiritual service. Our healthcare initiatives aim to support
            individuals and families by providing access to basic health
            screenings, awareness programmes and community wellness
            activities.
          </p>

          <p>
            Healthcare camps are organised periodically with the support of
            healthcare professionals and volunteers.
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="healthcare-services">
        <div className="healthcare-section-heading">
          <span className="section-label">OUR INITIATIVES</span>

          <h2>Community Healthcare</h2>

          <p>
            Supporting healthier families through awareness, prevention
            and community care.
          </p>
        </div>

        <div className="healthcare-grid">
          {healthcareServices.map((service, index) => (
            <div className="healthcare-card" key={index}>
              <div className="healthcare-icon">
                {service.icon}
              </div>

              <h3>{service.title}</h3>

              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Camp Information */}
      <section className="healthcare-seva">
        <div className="healthcare-seva-box">
          <div>
            <span className="section-label">SEVA</span>

            <h2>Everyone is Welcome</h2>

            <p>
              Our healthcare initiatives are designed to serve members of
              the community with compassion, dignity and respect.
            </p>
          </div>

          <Link to="/contact" className="healthcare-contact-btn">
            Contact Us →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HealthcareCamps;