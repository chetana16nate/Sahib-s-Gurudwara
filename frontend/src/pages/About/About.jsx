import React from 'react';
import PageHero from '../../components/PageHero/PageHero';
import {
    Heart,
    Users,
    HandHeart,
    BookOpen,
    Utensils,
    ArrowRight,
    Calendar
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import './About.css';

const About = () => {
    return (
        <div className="about-page">

            {/* =====================================================
                PAGE HERO
            ===================================================== */}
            <PageHero
                title="About Sahib's Gurudwara"
                subtitle="A spiritual home built on faith, equality, learning and selfless service."
                bgImage="/golden-temple-home-hero.png"
            />


            {/* =====================================================
                INTRODUCTION
            ===================================================== */}
            <section className="about-intro section-padding">

                <div className="premium-container about-intro-grid">

                    <div className="about-intro-content">

                        <span className="about-eyebrow">
                            Welcome to Our Gurudwara
                        </span>

                        <h2>
                            A Place of <span>Faith, Peace & Seva</span>
                        </h2>

                        <p>
                            Sahib's Gurudwara is a spiritual home and
                            community gathering place serving the Sikh
                            Sangat and the wider community of Accra, Ghana.
                        </p>

                        <p>
                            Our doors are open to everyone. Whether you
                            come for prayer, Gurbani, Langar, learning,
                            community activities or simply to find a
                            moment of peace, you are warmly welcomed.
                        </p>

                        <NavLink
                            to="/contact"
                            className="about-primary-btn"
                        >
                            Plan Your Visit
                            <ArrowRight size={17} />
                        </NavLink>

                    </div>


                    <div className="about-spiritual-card">

                        <div className="about-symbol">
                            ੴ
                        </div>

                        <blockquote>
                            "Recognize the whole human race as one."
                        </blockquote>

                        <span>
                            — Guru Gobind Singh Ji
                        </span>

                    </div>

                </div>

            </section>


            {/* =====================================================
                OUR VISION
            ===================================================== */}
            <section className="about-vision section-padding">

                <div className="premium-container">

                    <div className="about-section-heading">

                        <span className="about-eyebrow">
                            Our Vision
                        </span>

                        <h2>
                            Building a Community of <span>Compassion</span>
                        </h2>

                        <p>
                            To create a spiritual home and a community hub
                            that embraces the principles of Sikhism while
                            serving the diverse population of Accra.
                        </p>

                    </div>


                    <div className="about-values-grid">

                        <div className="about-value-card">

                            <div className="about-value-icon">
                                <Heart size={27} />
                            </div>

                            <h3>Faith</h3>

                            <p>
                                Creating a peaceful environment where
                                people can connect with Gurbani, prayer
                                and the Divine.
                            </p>

                        </div>


                        <div className="about-value-card">

                            <div className="about-value-icon">
                                <Users size={27} />
                            </div>

                            <h3>Equality</h3>

                            <p>
                                Welcoming everyone with dignity and
                                treating every person equally, regardless
                                of background or status.
                            </p>

                        </div>


                        <div className="about-value-card">

                            <div className="about-value-icon">
                                <HandHeart size={27} />
                            </div>

                            <h3>Seva</h3>

                            <p>
                                Encouraging selfless service and helping
                                those around us through compassion,
                                generosity and action.
                            </p>

                        </div>


                        <div className="about-value-card">

                            <div className="about-value-icon">
                                <BookOpen size={27} />
                            </div>

                            <h3>Learning</h3>

                            <p>
                                Supporting spiritual, cultural and
                                educational learning for children,
                                families and the wider community.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                OUR HISTORY
            ===================================================== */}
            <section className="about-history section-padding">

                <div className="premium-container about-history-grid">

                    <div className="about-history-symbol">
                        ੴ
                    </div>

                    <div className="about-history-content">

                        <span className="about-eyebrow">
                            Our Journey
                        </span>

                        <h2>
                            Our <span>History</span>
                        </h2>

                        <p>
                            Sahib's Gurudwara was founded with the aim of
                            providing a place of worship and community
                            gathering for the Sikh Sangat in Ghana.
                        </p>

                        <p>
                            Over the years, it has evolved into a vibrant
                            centre that not only hosts religious ceremonies
                            but also acts as a pillar of community support.
                        </p>

                        <p>
                            Today, the Gurudwara continues to bring people
                            together through prayer, Kirtan, Langar,
                            education, healthcare initiatives and
                            selfless service.
                        </p>

                    </div>

                </div>

            </section>


            {/* =====================================================
                SIKH PRINCIPLES
            ===================================================== */}
            <section className="about-principles section-padding">

                <div className="premium-container">

                    <div className="about-section-heading">

                        <span className="about-eyebrow">
                            Sikh Principles
                        </span>

                        <h2>
                            Values That Guide <span>Our Service</span>
                        </h2>

                        <p>
                            We are guided by the universally applicable
                            principles taught by the Sikh Gurus.
                        </p>

                    </div>


                    <div className="principles-grid">

                        <div className="principle-card">

                            <span className="principle-number">
                                01
                            </span>

                            <h3>
                                Naam Japna
                            </h3>

                            <p>
                                Remembering and meditating on the Divine
                                while living a life of spiritual awareness.
                            </p>

                        </div>


                        <div className="principle-card">

                            <span className="principle-number">
                                02
                            </span>

                            <h3>
                                Kirat Karni
                            </h3>

                            <p>
                                Living honestly, working with dignity and
                                earning through honest effort.
                            </p>

                        </div>


                        <div className="principle-card">

                            <span className="principle-number">
                                03
                            </span>

                            <h3>
                                Vand Chakna
                            </h3>

                            <p>
                                Sharing what we have with others and
                                supporting people in our community.
                            </p>

                        </div>

                    </div>

                </div>

            </section>


            {/* =====================================================
                LANGAR & SEVA
            ===================================================== */}
            <section className="about-service section-padding">

                <div className="premium-container about-service-grid">

                    <div className="about-service-card">

                        <div className="about-service-icon">
                            <Utensils size={30} />
                        </div>

                        <span className="about-eyebrow">
                            Langar
                        </span>

                        <h2>
                            Food Without Barriers
                        </h2>

                        <p>
                            Langar represents equality, generosity and
                            community. Everyone sits together and shares
                            a free vegetarian meal, regardless of their
                            background or circumstances.
                        </p>

                        <NavLink
                            to="/langar"
                            className="about-light-link"
                        >
                            Learn About Langar
                            <ArrowRight size={16} />
                        </NavLink>

                    </div>


                    <div className="about-service-card">

                        <div className="about-service-icon">
                            <HandHeart size={30} />
                        </div>

                        <span className="about-eyebrow">
                            Seva
                        </span>

                        <h2>
                            Service Without Expectation
                        </h2>

                        <p>
                            Seva is the spirit of selfless service.
                            Through volunteering, community support,
                            healthcare initiatives and humanitarian
                            activities, we strive to make a positive
                            difference.
                        </p>

                        <NavLink
                            to="/donate"
                            className="about-light-link"
                        >
                            Support Our Seva
                            <ArrowRight size={16} />
                        </NavLink>

                    </div>

                </div>

            </section>


            {/* =====================================================
                COMMUNITY
            ===================================================== */}
            <section className="about-community section-padding">

                <div className="premium-container about-community-content">

                    <span className="about-community-symbol">
                        ੴ
                    </span>

                    <span className="about-eyebrow">
                        One Community • One Humanity
                    </span>

                    <h2>
                        Everyone Is Welcome
                    </h2>

                    <p>
                        Sahib's Gurudwara brings together people from
                        different cultures and backgrounds in the spirit
                        of equality, friendship and humanity.
                    </p>

                    <div className="about-community-actions">

                        <NavLink
                            to="/contact"
                            className="about-primary-btn"
                        >
                            Visit Us
                            <ArrowRight size={17} />
                        </NavLink>

                        <NavLink
                            to="/events"
                            className="about-outline-btn"
                        >
                            Explore Events
                            <Calendar size={17} />
                        </NavLink>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default About;
