import React from 'react';
import './PageHero.css';

const PageHero = ({ title, subtitle, bgImage }) => {
    return (
        <div className="page-hero" style={{ backgroundImage: `url(${bgImage})` }}>
            <div className="page-hero-overlay"></div>
            <div className="premium-container page-hero-content animate-fade-in">
                <h1>{title}</h1>
                {subtitle && <p>{subtitle}</p>}
            </div>
        </div>
    );
};

export default PageHero;
