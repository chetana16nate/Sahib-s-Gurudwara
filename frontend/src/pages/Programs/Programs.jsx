import { useEffect, useMemo, useState } from "react";
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, MapPin, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import "./Programs.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const plannedEvents = [
  {
    _id: "planned-sukhmani-sahib-2026",
    title: "Sukhmani Sahib Path & Community Breakfast",
    description: "Begin the morning with Sukhmani Sahib Path, followed by Ardas and a warm breakfast with the Sangat.",
    category: "PRAYER & FELLOWSHIP",
    eventDate: "2026-09-13",
    schedule: "7:30 AM – 10:30 AM",
    location: "Main Darbar Hall",
  },
  {
    _id: "planned-youth-gurbani-2026",
    title: "Youth Gurbani & Sikh Heritage Workshop",
    description: "An engaging session for young people exploring Gurbani, Sikh history, values, and everyday spiritual practice.",
    category: "YOUTH & LEARNING",
    eventDate: "2026-10-11",
    schedule: "11:00 AM – 1:30 PM",
    location: "Community Learning Hall",
  },
  {
    _id: "planned-langar-seva-2026",
    title: "Community Langar Seva Day",
    description: "Join hands to prepare, serve, and share Guru ka Langar. Volunteers of all ages and experience levels are welcome.",
    category: "SEVA & COMMUNITY",
    eventDate: "2026-11-15",
    schedule: "8:00 AM – 2:00 PM",
    location: "Langar Hall & Kitchen",
  },
  {
    _id: "planned-year-end-kirtan-2026",
    title: "Year-End Kirtan Darbar & Ardas",
    description: "Come together for an uplifting evening of Shabad Kirtan, reflection, Ardas, and Langar with the community.",
    category: "KIRTAN & PRAYER",
    eventDate: "2026-12-27",
    schedule: "5:00 PM – 8:00 PM",
    location: "Main Darbar Hall",
  },
];
const dayKey = (date) => new Date(date).toISOString().slice(0, 10);
const monthLabel = (date) => new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
const dateLabel = (date) => new Intl.DateTimeFormat("en", { weekday: "short", day: "numeric", month: "short" }).format(new Date(date));

export default function Programs() {
  const [events, setEvents] = useState(plannedEvents);
  const [month, setMonth] = useState(() => {
    const firstEvent = new Date(plannedEvents[0].eventDate);
    return new Date(firstEvent.getFullYear(), firstEvent.getMonth(), 1);
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadEvents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/content/event`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Unable to load upcoming programmes.");

      const apiEvents = (data.items || []).filter((event) => event.eventDate);
      const apiIds = new Set(apiEvents.map((event) => event._id));
      setEvents([...apiEvents, ...plannedEvents.filter((event) => !apiIds.has(event._id))]);
    } catch {
      // Keep the published programme plan available if the API is temporarily offline.
      setEvents(plannedEvents);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let cancelled = false;

    fetch(`${API_URL}/content/event`)
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load upcoming programmes.");
        return (data.items || []).filter((event) => event.eventDate);
      })
      .then((apiEvents) => {
        if (cancelled) return;
        const apiIds = new Set(apiEvents.map((event) => event._id));
        setEvents([...apiEvents, ...plannedEvents.filter((event) => !apiIds.has(event._id))]);
      })
      .catch(() => {
        if (!cancelled) setEvents(plannedEvents);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);
  const upcoming = useMemo(() => events.filter((event) => new Date(`${dayKey(event.eventDate)}T23:59:59`) >= new Date()).sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate)), [events]);
  const eventDays = useMemo(() => new Set(events.map((event) => dayKey(event.eventDate))), [events]);
  const calendarDays = useMemo(() => { const first = new Date(month.getFullYear(), month.getMonth(), 1); const start = new Date(first); start.setDate(1 - first.getDay()); return Array.from({ length: 42 }, (_, index) => { const date = new Date(start); date.setDate(start.getDate() + index); return date; }); }, [month]);
  const selectedMonthEvents = useMemo(() => events.filter((event) => { const date = new Date(event.eventDate); return date.getFullYear() === month.getFullYear() && date.getMonth() === month.getMonth(); }), [events, month]);
  const changeMonth = (amount) => setMonth((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));

  return <main className="programs-page">
    <section className="programs-hero"><div className="programs-hero-overlay"><div className="programs-container"><p className="programs-kicker">SAHIB'S GURUDWARA · ACCRA</p><h1>Upcoming<br/><em>Programs</em></h1><p>Join us for prayer, learning, seva, cultural gatherings, and community moments throughout the year.</p><a href="#upcoming" className="programs-primary">View upcoming events <ChevronRight size={18}/></a></div></div></section>
    <section className="programs-intro"><div className="programs-container"><p className="programs-kicker">COMMUNITY CALENDAR</p><h2>Come together, learn, and grow.</h2><p>Explore upcoming programmes at Sahib's Gurudwara. Dates and details are updated as events are confirmed.</p></div></section>
    <section className="programs-content" id="upcoming"><div className="programs-container"><div className="programs-section-heading"><div><p className="programs-kicker">WHAT'S HAPPENING</p><h2>Upcoming at the Gurudwara</h2></div><button className="programs-refresh" onClick={loadEvents} disabled={loading}><RefreshCw size={16} className={loading ? "spin" : ""}/> Refresh</button></div>{error ? <div className="programs-alert"><strong>We could not load the programme calendar.</strong><span>{error}</span><button onClick={loadEvents}>Try again</button></div> : loading ? <div className="programs-loading">Loading upcoming programmes…</div> : !upcoming.length ? <div className="programs-empty"><CalendarDays size={34}/><h3>No upcoming programmes yet</h3><p>Please check again soon, or contact us to learn about regular weekly activities.</p><Link to="/contact">Contact Us <ChevronRight size={17}/></Link></div> : <div className="upcoming-grid">{upcoming.map((event) => <article className="event-card" key={event._id}><div className="event-date"><strong>{new Date(event.eventDate).getDate()}</strong><span>{new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(event.eventDate))}</span></div><div className="event-details"><span className="event-category">{event.category || "COMMUNITY PROGRAMME"}</span><h3>{event.title}</h3><p>{event.description || "Join the Sangat for this community programme."}</p><div className="event-meta">{event.schedule && <span><Clock3 size={15}/>{event.schedule}</span>}{event.location && <span><MapPin size={15}/>{event.location}</span>}</div></div></article>)}</div>}</div></section>
    <section className="calendar-section"><div className="programs-container calendar-layout"><div className="calendar-copy"><p className="programs-kicker">PLAN YOUR VISIT</p><h2>Programme calendar</h2><p>Choose a month to see scheduled programmes. Dates with a gold marker have an event planned.</p><div className="calendar-event-list">{selectedMonthEvents.length ? selectedMonthEvents.map((event) => <div key={event._id}><b>{dateLabel(event.eventDate)}</b><span>{event.title}</span></div>) : <span>No scheduled programmes this month.</span>}</div></div><div className="calendar-card"><div className="calendar-controls"><button aria-label="Previous month" onClick={() => changeMonth(-1)}><ChevronLeft size={20}/></button><h3>{monthLabel(month)}</h3><button aria-label="Next month" onClick={() => changeMonth(1)}><ChevronRight size={20}/></button></div><div className="calendar-weekdays">{["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map((day) => <span key={day}>{day}</span>)}</div><div className="calendar-days">{calendarDays.map((date) => { const current = date.getMonth() === month.getMonth(); const key = dayKey(date); return <span className={`${current ? "" : "muted"} ${eventDays.has(key) ? "has-event" : ""}`} key={key}>{date.getDate()}</span>; })}</div></div></div></section>
    <section className="programs-cta"><div className="programs-container"><div><p className="programs-kicker">BE PART OF THE COMMUNITY</p><h2>Have a programme idea or want to volunteer?</h2><p>We welcome people who would like to serve, teach, support an event, or simply join the Sangat.</p></div><Link to="/contact">Get in touch <ChevronRight size={18}/></Link></div></section>
  </main>;
}
