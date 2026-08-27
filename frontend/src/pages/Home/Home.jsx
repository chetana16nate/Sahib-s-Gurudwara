import React from "react";
import { Link } from "react-router-dom";
import { FaArrowRight, FaHandsHelping, FaMapMarkerAlt, FaUtensils, FaHeart, FaBookOpen, FaClock, FaCalendarAlt, FaCoffee, FaChild } from "react-icons/fa";
import "./Home.css";

const QuickCard = ({to, icon, title, text}) => <Link to={to} className="quick-card"><div className="quick-icon">{icon}</div><div className="quick-text"><h3>{title}</h3><p>{text}</p></div><FaArrowRight className="quick-arrow" /></Link>;
const ServiceCard = ({to, imageClass, icon, title, text}) => <Link to={to} className="service-card"><div className={`service-image ${imageClass}`}><div className="service-image-overlay" /></div><div className="service-content"><div className="service-icon">{icon}</div><div className="service-info"><h3>{title}</h3><p>{text}</p></div></div></Link>;

const Home = () => <main className="home-page">
  <section className="home-hero">
    <div className="hero-overlay" />
    <div className="hero-content">
      <div className="hero-tag"><span className="hero-tag-icon">ੴ</span><span>Welcome to Sahib's Gurudwara</span></div>
      <h1>A Sacred Home for Seva, Simran &amp; Sangat</h1>
      <p className="hero-punjabi">ਵਿਸ਼ਵਾਸ, ਸੇਵਾ ਅਤੇ ਸੰਗਤ ਦਾ ਪਵਿੱਤਰ ਸਥਾਨ</p>
      <div className="hero-divider"><span /><strong>ੴ</strong><span /></div>
      <p className="hero-subtitle">A peaceful spiritual space where everyone is welcome<br className="desktop-break" /> to pray, learn, serve and share.</p>
      <div className="hero-buttons"><Link to="/langar" className="primary-btn"><FaUtensils /> Langar Seva</Link><Link to="/contact" className="secondary-btn"><FaMapMarkerAlt /> Plan Your Visit <FaArrowRight /></Link></div>
    </div>
  </section>
  <section className="quick-actions-section"><div className="container"><div className="quick-actions">
    <QuickCard to="/langar" icon={<FaUtensils />} title="Langar Seva" text="Serve or join the community meal" />
    <QuickCard to="/services" icon={<FaHandsHelping />} title="Community Seva" text="Discover ways to serve" />
    <QuickCard to="/contact" icon={<FaMapMarkerAlt />} title="Visit Us" text="Directions, timings and contact" />
  </div></div></section>
  <section className="today-section" aria-labelledby="today-heading"><div className="container today-panel">
    <div className="today-intro"><span className="section-label">TODAY AT THE GURUDWARA</span><h2 id="today-heading">Come, pause and reconnect.</h2><p>Join the Sangat for prayer, Kirtan and Langar. Everyone is welcome, regardless of faith or background.</p></div>
    <div className="schedule-grid"><div className="schedule-item"><FaClock /><span><small>Morning</small><strong>Nitnem Â· 5:30 AM</strong></span></div><div className="schedule-item"><FaCalendarAlt /><span><small>Evening</small><strong>Rehras Sahib Â· 7:00 PM</strong></span></div><div className="schedule-item"><FaUtensils /><span><small>Daily</small><strong>Guru Ka Langar</strong></span></div></div>
  </div></section>
  <section className="welcome-section"><div className="container welcome-grid">
    <div className="welcome-image"><div className="ik-onkar-large">ੴ</div><div className="welcome-image-badge"><span className="badge-symbol">ੴ</span><span>One Universal Creator</span></div></div>
    <div className="welcome-content"><span className="section-label">WELCOME</span><h2>There are no strangers<br />at <span>Sahib's Gurudwara</span></h2><p>Sahib's Gurudwara is more than a place of worship. It is a welcoming community brought together through prayer, seva, learning and the sharing of Langar.</p><p>Whether you are visiting for the first time, seeking a peaceful place to pray or joining community activities, our doors are open to you.</p><Link to="/about" className="text-btn">Discover Our Story <FaArrowRight /></Link></div>
  </div></section>
  <section className="services-section"><div className="container">
    <div className="section-heading"><span className="section-label">OUR COMMUNITY</span><h2>Serving With Seva</h2><div className="heading-divider"><span /><strong>ੴ</strong><span /></div><p>Spirituality becomes meaningful when it is expressed through selfless service.</p></div>
    <div className="services-grid"><ServiceCard to="/langar" imageClass="langar-image" icon={<FaUtensils />} title="Guru Ka Langar" text="Share a free community meal where everyone sits together as equals." /><ServiceCard to="/services/healthcare-camps" imageClass="healthcare-image" icon={<FaHeart />} title="Healthcare Camps" text="Supporting our community through care, awareness and compassion." /><ServiceCard to="/services/classes-activities" imageClass="learning-image" icon={<FaBookOpen />} title="Learning & Heritage" text="Helping families learn, grow and connect with their heritage." /><ServiceCard to="/cafe" imageClass="coffee-image" icon={<FaCoffee />} title="Coffee CafÃ©" text="Pause for freshly brewed coffee, tea and light refreshments in a warm community space." /><ServiceCard to="/services" imageClass="playroom-image" icon={<FaChild />} title="Kids Play Room" text="A safe, joyful space where children can play, learn and make new friends." /><ServiceCard to="/services" imageClass="library-image" icon={<FaBookOpen />} title="Community Library" text="Discover books, stories and quiet corners for learning and reflection." /></div>
    <div className="center-button"><Link to="/services" className="outline-btn">Explore All Services <FaArrowRight /></Link></div>
  </div></section>
</main>;
export default Home;



