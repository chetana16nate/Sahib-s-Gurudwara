import { useEffect, useState } from "react";
import { Globe2, Languages, MessageSquareQuote, Send, Star } from "lucide-react";
import { api } from "../../api/api";
import "./Reviews.css";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [language, setLanguage] = useState("en");
  const [form, setForm] = useState({ name: "", reviewEnglish: "", reviewPunjabi: "", rating: 5 });
  const [status, setStatus] = useState({ loading: true, submitting: false, message: "", error: "" });

  useEffect(() => {
    api.get("/reviews").then(({ data }) => setReviews(data.reviews || []))
      .catch(() => setStatus(s => ({ ...s, error: "Unable to load reviews right now." })))
      .finally(() => setStatus(s => ({ ...s, loading: false })));
  }, []);

  const change = e => setForm({ ...form, [e.target.name]: e.target.value });
  const submit = async e => {
    e.preventDefault();
    const submittedInPunjabi = Boolean(form.reviewPunjabi.trim());
    setStatus(s => ({ ...s, submitting: true, message: "", error: "" }));
    try {
      const { data } = await api.post("/reviews", { ...form, rating: Number(form.rating) });
      setReviews(current => [data.review, ...current]);
      if (submittedInPunjabi) setLanguage("pa");
      setForm({ name: "", reviewEnglish: "", reviewPunjabi: "", rating: 5 });
      setStatus(s => ({ ...s, message: data.message }));
    } catch (error) {
      setStatus(s => ({ ...s, error: error.response?.data?.message || "Unable to submit your review." }));
    } finally {
      setStatus(s => ({ ...s, submitting: false }));
    }
  };

  return <main className="reviews-page">
    <header className="reviews-hero"><MessageSquareQuote size={36}/><span>SANGAT VOICES</span><h1>Stories From Our Community</h1><p>Share how Sahib's Gurudwara, Langar or Seva has touched your life.</p></header>
    <section className="reviews-shell">
      <div className="reviews-toolbar">
        <div><h2>Community Reviews</h2><p>{reviews.length} experience{reviews.length === 1 ? "" : "s"} shared</p></div>
        <div className="language-setting" role="group" aria-label="Review language">
          <Languages size={19}/><button className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")}>English</button><button className={language === "pa" ? "active" : ""} onClick={() => setLanguage("pa")}>ਪੰਜਾਬੀ</button>
        </div>
      </div>
      <div className="reviews-layout">
        <div className="review-list">
          {status.loading && <p className="review-state">Loading reviews…</p>}
          {!status.loading && reviews.length === 0 && <p className="review-state">Be the first person to share an experience.</p>}
          {reviews.map(review => {
            const hasPunjabi = Boolean(review.reviewPunjabi?.trim());
            return <article className="review-card" key={review._id}>
              <div className="review-card-top"><div className="review-avatar">{review.name.charAt(0).toUpperCase()}</div><div><h3>{review.name}</h3><div className="stars" aria-label={`${review.rating} out of 5 stars`}>{Array.from({length:5},(_,i)=><Star key={i} size={17} fill={i < review.rating ? "currentColor" : "none"}/>)}</div></div><Globe2 className="review-language-icon" size={20}/></div>
              <p className={language === "pa" ? "punjabi-review" : ""}>{language === "pa" && hasPunjabi ? review.reviewPunjabi : review.reviewEnglish}</p>
              {language === "pa" && !hasPunjabi && <small className="translation-note">ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਉਪਲਬਧ ਨਹੀਂ ਹੈ — showing original English review.</small>}
            </article>;
          })}
        </div>
        <aside className="review-form-card"><span className="form-eyebrow">SHARE YOUR EXPERIENCE</span><h2>Leave a Review</h2><p>Your English review is required. Add Punjabi too if you can provide an accurate translation.</p>
          {status.error && <div className="review-message error">{status.error}</div>}{status.message && <div className="review-message success">{status.message}</div>}
          <form onSubmit={submit}>
            <label>Name<input name="name" value={form.name} onChange={change} maxLength="80" required placeholder="Your name"/></label>
            <label>Rating<select name="rating" value={form.rating} onChange={change}>{[5,4,3,2,1].map(n=><option value={n} key={n}>{n} star{n===1?"":"s"}</option>)}</select></label>
            <label>Review in English<textarea name="reviewEnglish" value={form.reviewEnglish} onChange={change} maxLength="800" required rows="5" placeholder="Tell us about your experience…"/></label>
            <label>Punjabi translation / ਪੰਜਾਬੀ ਅਨੁਵਾਦ <small>(optional)</small><textarea className="punjabi-input" name="reviewPunjabi" value={form.reviewPunjabi} onChange={change} maxLength="1000" rows="4" lang="pa-Guru" dir="auto" spellCheck="false" inputMode="text" placeholder="ਆਪਣਾ ਪੰਜਾਬੀ ਅਨੁਵਾਦ ਲਿਖੋ…" aria-describedby="punjabi-review-help"/><small id="punjabi-review-help" className="punjabi-help">ਪੰਜਾਬੀ ਵਿੱਚ ਆਪਣਾ ਅਨੁਭਵ ਲਿਖੋ। Submit ਕਰਨ ਤੋਂ ਬਾਅਦ ਇਹ ਪੰਜਾਬੀ ਵਿੱਚ ਦਿਖਾਈ ਦੇਵੇਗਾ।</small></label>
            <button disabled={status.submitting}><Send size={18}/>{status.submitting ? "Submitting…" : "Submit Review"}</button>
          </form>
        </aside>
      </div>
    </section>
  </main>;
}
