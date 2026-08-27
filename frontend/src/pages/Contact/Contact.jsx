import React from 'react';
import PageHero from '../../components/PageHero/PageHero';
import { MapPin, Phone, Mail } from 'lucide-react';

const Contact = () => {
    // Google Maps location
    const locationUrl =
        'https://www.google.com/maps/search/?api=1&query=Shiashie%2C%20East%20Legon%2C%20Accra%2C%20Ghana';

    // Phone number
    const phoneNumber = '+233531032313';

    // WhatsApp URL
    const whatsappUrl = 'https://wa.me/233531032313';

    // Email
    const emailAddress = 'manager@sahibgurudwara.com';

    return (
        <div className="page-wrapper">

            <PageHero
                title="Contact Us"
                subtitle="We'd love to hear from you. Here is how you can reach us."
                bgImage="/golden-temple-home-hero.png"
            />

            <section className="section-padding premium-container">

                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '60px',
                        alignItems: 'start'
                    }}
                >

                    {/* ================= CONTACT INFORMATION ================= */}
                    <div>

                        <h2 className="section-title">
                            Get in Touch
                        </h2>

                        <p
                            style={{
                                color: 'var(--color-text-muted)',
                                marginBottom: '40px'
                            }}
                        >
                            Have a question about our services, timings, or
                            want to volunteer? Send us a message and we will
                            get back to you shortly.
                        </p>

                        <div
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '24px'
                            }}
                        >

                            {/* ================= LOCATION ================= */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >

                                <a
                                    href={locationUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Open Sahib's Gurudwara location in Google Maps"
                                    title="Open in Google Maps"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor:
                                            'var(--color-bg-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--color-primary-dark)',
                                        flexShrink: 0,
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <MapPin size={24} />
                                </a>

                                <div>
                                    <h4 style={{ margin: 0 }}>
                                        Location
                                    </h4>

                                    <a
                                        href={locationUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            color:
                                                'var(--color-text-muted)',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        Shiashie, East Legon, Accra, Ghana.
                                    </a>
                                </div>

                            </div>


                            {/* ================= PHONE / WHATSAPP ================= */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >

                                <a
                                    href={`tel:${phoneNumber}`}
                                    aria-label="Call Sahib's Gurudwara"
                                    title="Call Sahib's Gurudwara"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor:
                                            'var(--color-bg-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color:
                                            'var(--color-primary-dark)',
                                        flexShrink: 0,
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Phone size={24} />
                                </a>

                                <div>
                                    <h4 style={{ margin: 0 }}>
                                        WhatsApp / Call
                                    </h4>

                                    <div
                                        style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '8px'
                                        }}
                                    >

                                        {/* Call */}
                                        <a
                                            href={`tel:${phoneNumber}`}
                                            style={{
                                                color:
                                                    'var(--color-text-muted)',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            +233 531 032 313
                                        </a>

                                        <span
                                            style={{
                                                color:
                                                    'var(--color-text-muted)'
                                            }}
                                        >
                                            |
                                        </span>

                                        {/* WhatsApp */}
                                        <a
                                            href={whatsappUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            style={{
                                                color:
                                                    'var(--color-primary-dark)',
                                                textDecoration: 'none',
                                                fontWeight: '600'
                                            }}
                                        >
                                            WhatsApp
                                        </a>

                                    </div>
                                </div>

                            </div>


                            {/* ================= EMAIL ================= */}
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '16px'
                                }}
                            >

                                <a
                                    href={`mailto:${emailAddress}`}
                                    aria-label="Email Sahib's Gurudwara"
                                    title="Send Email"
                                    style={{
                                        width: '48px',
                                        height: '48px',
                                        backgroundColor:
                                            'var(--color-bg-secondary)',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color:
                                            'var(--color-primary-dark)',
                                        flexShrink: 0,
                                        textDecoration: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Mail size={24} />
                                </a>

                                <div>
                                    <h4 style={{ margin: 0 }}>
                                        Email
                                    </h4>

                                    <a
                                        href={`mailto:${emailAddress}`}
                                        style={{
                                            color:
                                                'var(--color-text-muted)',
                                            textDecoration: 'none',
                                            wordBreak: 'break-word'
                                        }}
                                    >
                                        {emailAddress}
                                    </a>
                                </div>

                            </div>

                        </div>

                    </div>


                    {/* ================= CONTACT FORM ================= */}
                    <div
                        style={{
                            background: 'var(--color-bg-card)',
                            padding: '40px',
                            borderRadius: 'var(--radius-lg)',
                            boxShadow: 'var(--shadow-md)',
                            width: '100%',
                            boxSizing: 'border-box'
                        }}
                    >

                        <h3 style={{ marginBottom: '24px' }}>
                            Send a Message
                        </h3>

                        <form
                            style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '16px'
                            }}
                        >

                            <input
                                type="text"
                                placeholder="Your Name"
                                style={{
                                    padding: '14px',
                                    border:
                                        '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'inherit',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <input
                                type="email"
                                placeholder="Your Email"
                                style={{
                                    padding: '14px',
                                    border:
                                        '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'inherit',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <textarea
                                placeholder="Your Message"
                                rows="5"
                                style={{
                                    padding: '14px',
                                    border:
                                        '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    fontFamily: 'inherit',
                                    resize: 'vertical',
                                    width: '100%',
                                    boxSizing: 'border-box'
                                }}
                            />

                            <button
                                type="button"
                                className="btn-primary"
                                style={{
                                    width: '100%',
                                    marginTop: '8px'
                                }}
                            >
                                Send Message
                            </button>

                        </form>

                    </div>

                </div>

            </section>

        </div>
    );
};

export default Contact;
