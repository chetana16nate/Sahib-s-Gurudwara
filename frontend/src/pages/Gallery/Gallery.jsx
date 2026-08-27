import React from "react";
import { Camera, Heart } from "lucide-react";
import "./Gallery.css";
import firstGurudwara from "./1st_Gurudwara.jpeg";
import amardeep from "./AA1WmOed.jpeg";
import gurudwara from "./gurudwara.jpeg";
import communityVisit from "./images2.jpeg";
import visitors from "./images3.jpeg";
import langarPhoto from "./images4.jpeg";
import kirtan from "./images5.jpeg";
import gathering from "./images6.jpg";
import sangat from "./images15.jpeg";
import community from "./images25.jpeg";

const images = [
  { src: "/Gurudwara-home.jpg", title: "Sahib's Gurudwara", text: "A sacred home for prayer and Sangat." },
  { src: "/langar.avif", title: "Guru Ka Langar", text: "Serving everyone with equality and love." },
  { src: "/classes.jpg", title: "Learning Together", text: "Connecting the next generation with heritage." },
  { src: "/healthcare.jpg", title: "Community Care", text: "Compassion expressed through service." },
  { src: "/waheguru-logo.jpg", title: "Waheguru", text: "Remembering the One Universal Creator." },
  { src: firstGurudwara, title: "Sahib's Gurudwara", text: "Our sacred space in Accra." },
  { src: amardeep, title: "Community Member", text: "Part of our growing Sangat." },
  { src: gurudwara, title: "Gurudwara Sahib", text: "A peaceful place for prayer." },
  { src: communityVisit, title: "Community Visit", text: "Welcoming visitors with warmth." },
  { src: visitors, title: "Visitors", text: "Everyone is welcome here." },
  { src: langarPhoto, title: "Langar", text: "Sharing food as equals." },
  { src: kirtan, title: "Kirtan", text: "Connecting through sacred music." },
  { src: gathering, title: "Sangat Gathering", text: "Faith and community together." },
  { src: sangat, title: "Special Moments", text: "Memories from our community." },
  { src: community, title: "Serving Together", text: "Seva in action." },
];

export default function Gallery() {
  return <main className="gallery-page">
    <header className="gallery-hero">
      <Camera size={34} />
      <span>OUR COMMUNITY</span>
      <h1>Moments of Faith &amp; Seva</h1>
      <p>A glimpse into prayer, Langar, learning and community life at Sahib's Gurudwara.</p>
    </header>
    <section className="gallery-container" aria-label="Gurudwara gallery">
      {images.map((item, index) => <figure className="gallery-item" key={`${item.title}-${index}`}>
        <img src={item.src} alt={item.title} loading={index > 1 ? "lazy" : "eager"} />
        <figcaption><Heart size={17} /><div><h2>{item.title}</h2><p>{item.text}</p></div></figcaption>
      </figure>)}
    </section>
  </main>;
}
