import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Baby, BookOpen, Coffee, HandHeart, HeartPulse, Languages, Monitor, Music2, UsersRound } from "lucide-react";
import PageHero from "../../components/PageHero/PageHero";
import "./Services.css";

const services = [
  { eyebrow: "SPIRITUAL LEARNING", title: "Gurmat & Spiritual Classes", description: "Learn about Sikh values, Gurbani, Sikh history, traditions, and spiritual teachings in a welcoming environment.", icon: BookOpen, link: "/services/classes-activities" },
  { eyebrow: "EDUCATION", title: "Indian Language Classes", description: "Encourage children and community members to learn Indian languages and stay connected with their cultural heritage.", icon: Languages, link: "/services/classes-activities" },
  { eyebrow: "MUSIC & ARTS", title: "Tabla & Music Classes", description: "Develop musical skills through tabla, harmonium, kirtan, and other traditional music activities.", icon: Music2, link: "/services/classes-activities" },
  { eyebrow: "CHILDREN", title: "Kids Activities", description: "Fun and educational activities designed to help children learn, play, build confidence, and make new friends.", icon: Baby, link: "/services/classes-activities" },
  { eyebrow: "HEALTHCARE", title: "Healthcare Camps", description: "Community healthcare initiatives including health awareness programmes, basic health checks, and special medical camps.", icon: HeartPulse, link: "/services/healthcare-camps" },
  { eyebrow: "COMMUNITY", title: "Seva & Community Support", description: "Participate in seva and community welfare activities that support people and strengthen our local community.", icon: HandHeart, link: "/contact" },
  { eyebrow: "COMMUNITY", title: "Community Gatherings", description: "Join cultural, spiritual, educational, and community events where everyone is welcome.", icon: UsersRound, link: "/programs" },
  { eyebrow: "COMMUNITY SPACE", title: "Coffee & Community Space", description: "A comfortable space to connect with others, enjoy refreshments, and spend meaningful time together.", icon: Coffee, link: "/cafe" },
  { eyebrow: "WORKSPACE", title: "Workspace", description: "A peaceful environment for students, professionals, and community members who need a place to work or study.", icon: Monitor, link: "/contact" },
];

export default function Services() {
  return <main className="services-page">
    <PageHero title="Community Services" subtitle="A welcoming home for learning, care, seva and connection" bgImage="/golden-temple-home-hero.png" />
    <section className="services-intro"><div className="services-container"><span className="services-kicker">OUR COMMUNITY</span><h1>Services for every stage of life.</h1><p>At Sahib's Gurudwara, our services bring people together through learning, wellbeing, culture, and compassionate community support.</p></div></section>
    <section className="services-directory"><div className="services-container"><div className="services-grid">{services.map(({ eyebrow, title, description, icon: Icon, link }) => <article className="service-directory-card" key={title}><div className="service-directory-icon"><Icon size={30} strokeWidth={2.2}/></div><span>{eyebrow}</span><h2>{title}</h2><p>{description}</p><Link to={link}>Learn More <ArrowRight size={18}/></Link></article>)}</div></div></section>
    <section className="services-bottom"><div className="services-container"><div><span className="services-kicker">EVERYONE IS WELCOME</span><h2>Find your place in our community.</h2><p>Whether you want to learn, volunteer, connect, or simply take a quiet moment, there is always a place for you at Sahib's Gurudwara.</p></div><Link to="/contact" className="services-contact">Contact Us <ArrowRight size={18}/></Link></div></section>
  </main>;
}
