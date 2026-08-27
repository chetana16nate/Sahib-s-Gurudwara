import React from "react";
import { NavLink } from "react-router-dom";
import { FaHeart, FaBars, FaTimes, FaMapMarkerAlt } from "react-icons/fa";
import "./Navbar.css";

const links = [["Home","/"],["About","/about"],["Services","/services"],["Programs","/programs"],["Gallery","/gallery"],["Reviews","/reviews"],["Contact","/contact"]];

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const close = () => setIsOpen(false);
  return <>
    <div className="devotional-strip"><span lang="pa">ਵਾਹਿਗੁਰੂ ਜੀ ਕਾ ਖਾਲਸਾ, ਵਾਹਿਗੁਰੂ ਜੀ ਕੀ ਫਤਹਿ</span><span className="strip-note">Everyone is welcome</span></div>
    <nav className="navbar" aria-label="Main navigation">
      <div className="premium-container navbar-container">
        <NavLink to="/" className="navbar-logo" onClick={close}>
          <div className="logo-symbol" aria-hidden="true">ੴ</div>
          <div className="logo-text"><h2>Sahib's Gurudwara</h2><span><FaMapMarkerAlt /> Accra, Ghana</span></div>
        </NavLink>
        <ul className={`nav-links ${isOpen ? "active" : ""}`}>
          {links.map(([name,path]) => <li key={name}><NavLink to={path} end={path === "/"} className={({isActive}) => isActive ? "nav-link active-link" : "nav-link"} onClick={close}>{name}</NavLink></li>)}
          <li className="nav-donate-wrapper"><NavLink to="/seva" className="donate-btn" onClick={close}><FaHeart /><span>Join Seva</span></NavLink></li>
        </ul>
        <button type="button" className="mobile-toggle" onClick={() => setIsOpen(!isOpen)} aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"} aria-expanded={isOpen}>{isOpen ? <FaTimes /> : <FaBars />}</button>
      </div>
    </nav>
  </>;
};
export default Navbar;



