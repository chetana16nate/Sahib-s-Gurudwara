import React from "react";
import { Link } from "react-router-dom";
import "./ClassesActivities.css";

const ClassesActivities = () => {
  const languageClasses = [
    {
      title: "Hindi",
      description:
        "Learn Hindi reading, writing, speaking and everyday communication in a friendly community environment.",
    },
    {
      title: "Punjabi",
      description:
        "Explore Punjabi language, Gurmukhi script, reading and conversation while connecting with Punjabi culture.",
    },
    {
      title: "Marathi",
      description:
        "Children and learners can develop Marathi speaking, reading and writing skills through engaging activities.",
    },
    {
      title: "Gujarati",
      description:
        "Build basic Gujarati communication, vocabulary and reading skills through interactive learning.",
    },
    {
      title: "Bengali",
      description:
        "An opportunity to learn Bengali language fundamentals, communication and cultural expressions.",
    },
    {
      title: "Other Indian Languages",
      description:
        "Language learning opportunities can be expanded based on community interest and available teachers.",
    },
  ];

  const activities = [
    {
      icon: "🥁",
      title: "Tabla Classes",
      description:
        "Learn the fundamentals of tabla, rhythm, taal and traditional Indian percussion in a supportive environment.",
    },
    {
      icon: "🎵",
      title: "Indian Music",
      description:
        "Explore Indian music through vocal practice, rhythm, melodies and traditional musical learning.",
    },
    {
      icon: "🎤",
      title: "Vocal Training",
      description:
        "Develop confidence in singing with basic vocal exercises, pronunciation, rhythm and musical expression.",
    },
    {
      icon: "🎨",
      title: "Cultural Activities",
      description:
        "Participate in activities that help children connect with Indian culture, traditions and community.",
    },
  ];

  return (
    <div className="classes-page">
      {/* HERO */}
      <section className="classes-hero">
        <div className="classes-hero-content">
          <span>LEARNING & CULTURE</span>

          <h1>
            Classes &
            <br />
            Activities
          </h1>

          <p>
            Learn languages, music and traditional arts while growing
            together as a community.
          </p>

          <Link to="/services" className="classes-back-btn">
            ← Back to Services
          </Link>
        </div>
      </section>

      {/* INTRO */}
      <section className="classes-intro">
        <div className="classes-intro-content">
          <span className="classes-label">LEARN • CONNECT • GROW</span>

          <h2>
            Keeping Culture
            <br />
            <span>Alive Through Learning</span>
          </h2>

          <p>
            Our classes and activities provide children, families and
            community members with opportunities to learn Indian languages,
            music and traditional arts.
          </p>

          <p>
            The aim is to create a welcoming environment where learning is
            enjoyable and cultural traditions can be shared across
            generations.
          </p>
        </div>
      </section>

      {/* LANGUAGE CLASSES */}
      <section className="language-section">
        <div className="classes-heading">
          <span className="classes-label">LANGUAGE CLASSES</span>

          <h2>Indian Languages</h2>

          <p>
            Learn and practise Indian languages while staying connected
            with our cultural roots.
          </p>
        </div>

        <div className="language-grid">
          {languageClasses.map((language, index) => (
            <div className="language-card" key={index}>
              <div className="language-number">
                {String(index + 1).padStart(2, "0")}
              </div>

              <h3>{language.title}</h3>

              <p>{language.description}</p>

              <span className="learn-more">
                Learn More →
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* MUSIC */}
      <section className="music-section">
        <div className="classes-heading">
          <span className="classes-label">MUSIC & ARTS</span>

          <h2>Music & Traditional Arts</h2>

          <p>
            Discover the joy of Indian music, rhythm and traditional
            cultural activities.
          </p>
        </div>

        <div className="activities-grid">
          {activities.map((activity, index) => (
            <div className="activity-card" key={index}>
              <div className="activity-icon">
                {activity.icon}
              </div>

              <h3>{activity.title}</h3>

              <p>{activity.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CHILDREN SECTION */}
      <section className="children-section">
        <div className="children-content">
          <span className="classes-label">FOR CHILDREN & FAMILIES</span>

          <h2>Learning Beyond the Classroom</h2>

          <p>
            Our activities are designed to give children a chance to
            learn, practise and express themselves while building
            friendships within the community.
          </p>

          <div className="children-points">
            <div>
              <strong>01</strong>
              <span>Language & Communication</span>
            </div>

            <div>
              <strong>02</strong>
              <span>Music & Rhythm</span>
            </div>

            <div>
              <strong>03</strong>
              <span>Cultural Connection</span>
            </div>

            <div>
              <strong>04</strong>
              <span>Community & Friendship</span>
            </div>
          </div>

          <Link to="/contact" className="classes-contact-btn">
            Enquire About Classes →
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ClassesActivities;