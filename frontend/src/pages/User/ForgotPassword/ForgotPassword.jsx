import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { api } from '../../../api/api';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    try {
      setLoading(true);
      const response = await api.post('/auth/user/forgot-password', { email: email.trim() });
      setMessage(response.data.message);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to submit your recovery request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="forgot-password-page">
      <section className="forgot-password-brand">
        <div>
          <div className="forgot-brand-symbol">ੴ</div>
          <h1>Sahib's Gurudwara</h1>
          <p>We are here to help you return to your Sangat account.</p>
        </div>
      </section>
      <section className="forgot-password-panel">
        <div className="forgot-password-card">
          <Link to="/user/login" className="forgot-back"><ArrowLeft size={17} /> Back to Login</Link>
          <div className="forgot-icon"><ShieldCheck size={30} /></div>
          <span className="forgot-overline">ACCOUNT RECOVERY</span>
          <h2>Forgot your password?</h2>
          <p className="forgot-description">Enter your registered email address. We will submit a secure recovery request to the Gurudwara administration.</p>
          {message && <div className="forgot-message success">{message}</div>}
          {error && <div className="forgot-message error">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label htmlFor="recovery-email">Email Address</label>
            <div className="forgot-input"><Mail size={19} /><input id="recovery-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" autoComplete="email" disabled={loading} /></div>
            <button type="submit" disabled={loading}>{loading ? 'Submitting request...' : 'Request Password Help'}</button>
          </form>
          <p className="forgot-help">Remembered your password? <Link to="/user/login">Login</Link></p>
        </div>
      </section>
    </main>
  );
}
