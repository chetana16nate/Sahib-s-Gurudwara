import React from 'react';
import { NavLink } from 'react-router-dom';
import { MapPin, Phone, Mail } from 'lucide-react';
import {
    FaInstagram,
    FaFacebookF,
    FaYoutube,
    FaWhatsapp
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {

    // ================= CONTACT LINKS =================

    // Google Maps Location
    const locationUrl =
        'https://www.google.com/maps/search/?api=1&query=Shiashie%2C%20East%20Legon%2C%20Accra%2C%20Ghana';

    // Phone
    const phoneUrl = 'tel:+233531032313';

    // Email
    const emailUrl = 'mailto:manager@sahibgurudwara.com';

    // WhatsApp
    const whatsappUrl = 'https://wa.me/233531032313';


    // ================= SOCIAL MEDIA =================

    // YouTube - Actual Sahib's Gurudwara channel
    const youtubeUrl =
        'https://www.youtube.com/@SahibGurudwaraAccraGhana';

    // Add your actual Instagram URL here
    const instagramUrl = '#';

    // Add your actual Facebook URL here
    const facebookUrl = '#';


    return (
        <footer className="footer">

            <div className="footer-container">

                <div className="footer-main">

                    {/* ================= ABOUT SECTION ================= */}

                    <div className="footer-col about-col">

                        <h2>Sahib's Gurudwara</h2>

                        <p>
                            A welcoming hub for faith, learning, wellness,
                            and community in Accra, Ghana.
                        </p>

                        {/* ================= SOCIAL LINKS ================= */}

                        <div className="social-links">

                            {/* Instagram */}
                            <a
                                href={instagramUrl}
                                aria-label="Sahib's Gurudwara Instagram"
                                className="social-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Instagram"
                            >
                                <FaInstagram />
                            </a>


                            {/* Facebook */}
                            <a
                                href={facebookUrl}
                                aria-label="Sahib's Gurudwara Facebook"
                                className="social-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="Facebook"
                            >
                                <FaFacebookF />
                            </a>


                            {/* YouTube */}
                            <a
                                href={youtubeUrl}
                                aria-label="Sahib's Gurudwara YouTube"
                                className="social-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="YouTube"
                            >
                                <FaYoutube />
                            </a>


                            {/* WhatsApp */}
                            <a
                                href={whatsappUrl}
                                aria-label="Contact Sahib's Gurudwara on WhatsApp"
                                className="social-icon"
                                target="_blank"
                                rel="noopener noreferrer"
                                title="WhatsApp"
                            >
                                <FaWhatsapp />
                            </a>

                        </div>

                    </div>


                    {/* ================= QUICK LINKS ================= */}

                    <div className="footer-col links-col">

                        <h3>Quick Links</h3>

                        <ul>

                            <li>
                                <NavLink to="/about">
                                    About Us
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services">
                                    Langar & Seva
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services/classes-activities">
                                    Classes
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/programs">
                                    Events
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/gallery">
                                    Gallery
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/reviews">
                                    Community Reviews
                                </NavLink>
                            </li>

                        </ul>

                    </div>


                    {/* ================= COMMUNITY SERVICES ================= */}

                    <div className="footer-col links-col">

                        <h3>Community Services</h3>

                        <ul>

                            <li>
                                <NavLink to="/services">
                                    Community Healthcare
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services">
                                    Peaceful Workspace
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services/classes-activities">
                                    Music (Tabla & Harmonium)
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services/classes-activities">
                                    Punjabi Language
                                </NavLink>
                            </li>

                            <li>
                                <NavLink to="/services">
                                    Volunteer / Donate
                                </NavLink>
                            </li>

                        </ul>

                    </div>


                    {/* ================= CONTACT US ================= */}

                    <div className="footer-col contact-col">

                        <h3>Contact Us</h3>

                        <ul className="contact-list">

                            {/* ================= LOCATION ================= */}

                            <li>

                                <a
                                    href={locationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open Sahib's Gurudwara location in Google Maps"
                                    title="Open Location in Google Maps"
                                    className="contact-link"
                                >

                                    <MapPin
                                        size={18}
                                        className="contact-icon"
                                    />

                                    <span>
                                        Shiashie, East Legon,
                                        <br />
                                        Accra, Ghana.
                                    </span>

                                </a>

                            </li>


                            {/* ================= PHONE ================= */}

                            <li>

                                <a
                                    href={phoneUrl}
                                    aria-label="Call Sahib's Gurudwara"
                                    title="Call Sahib's Gurudwara"
                                    className="contact-link"
                                >

                                    <Phone
                                        size={18}
                                        className="contact-icon"
                                    />

                                    <span>
                                        +233 531 032 313
                                    </span>

                                </a>

                            </li>


                            {/* ================= EMAIL ================= */}

                            <li>

                                <a
                                    href={emailUrl}
                                    aria-label="Email Sahib's Gurudwara"
                                    title="Send Email"
                                    className="contact-link"
                                >

                                    <Mail
                                        size={18}
                                        className="contact-icon"
                                    />

                                    <span>
                                        manager@sahibgurudwara.com
                                    </span>

                                </a>

                            </li>

                        </ul>

                    </div>

                </div>


                {/* ================= FOOTER BOTTOM ================= */}

                <div className="footer-bottom">

                    <p>
                        &copy; {new Date().getFullYear()} Sahib's Gurudwara,
                        Accra. All rights reserved.
                    </p>

                    <div className="footer-bottom-links">

                        <NavLink to="/privacy">
                            Privacy Policy
                        </NavLink>

                        <NavLink to="/terms">
                            Terms of Service
                        </NavLink>

                    </div>

                </div>

            </div>

        </footer>
    );
};

export default Footer;
