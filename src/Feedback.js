import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquareHeart, Send, ShieldCheck, Star } from 'lucide-react';
import './Feedback.css';

const categories = [
  { value: 'general', label: 'General' },
  { value: 'journal', label: 'Journal' },
  { value: 'mood', label: 'Mood Analytics' },
  { value: 'bibliotherapy', label: 'Bibliotherapy' },
  { value: 'multimedia', label: 'Multimedia' },
  { value: 'regulation', label: 'Emotion Regulation' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'bug', label: 'Bug Report' },
  { value: 'other', label: 'Other' },
];

const initialForm = {
  subject: '',
  category: 'general',
  message: '',
  rating: 0,
};

const Feedback = () => {
  const navigate = useNavigate();
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      return null;
    }
  }, []);

  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.rating) {
      setStatus({ type: 'error', message: 'Please choose a rating before submitting.' });
      return;
    }

    setSubmitting(true);
    setStatus({ type: '', message: '' });

    try {
      const response = await fetch('http://localhost:5000/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating),
          userEmail: storedUser?.email || '',
          userName: storedUser?.fullName || 'Anonymous',
        }),
      });

      const data = await response.json();

      if (data.status === 'Success') {
        setForm(initialForm);
        setStatus({ type: 'success', message: 'Thank you. Your feedback has been shared with the team.' });
      } else {
        setStatus({ type: 'error', message: data.msg || 'Unable to submit feedback.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: 'Server connection failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="feedback-page">
      <div className="feedback-page-shell">
        <section className="feedback-hero-panel">
          <div className="feedback-hero-copy">
            <button type="button" className="feedback-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <p className="feedback-kicker">The Serene Path Feedback</p>
            <h1>Help us make The Serene Path better.</h1>
            <p className="feedback-lead">
              Share a suggestion, report an issue, or tell us what is working well.
            </p>

            <div className="feedback-feature-list">
              <div className="feedback-feature">
                <MessageSquareHeart size={18} />
                <span>Your feedback helps improve the experience across the platform.</span>
              </div>
              <div className="feedback-feature">
                <ShieldCheck size={18} />
                <span>Private journal content remains protected and is never reviewed here.</span>
              </div>
            </div>
          </div>

          <div className="feedback-hero-image-card">
            <div className="feedback-hero-image-overlay" />
            <img
              src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1600&auto=format&fit=crop"
              alt="Peaceful landscape"
            />
            <div className="feedback-hero-caption">
              <span>Every thoughtful response helps us improve with care.</span>
            </div>
          </div>
        </section>

        <section className="feedback-form-shell">
          <div className="feedback-form-intro">
            <p className="feedback-kicker">Quick Feedback</p>
            <h2>Tell us what you noticed.</h2>
          </div>

          <form className="feedback-form-card" onSubmit={handleSubmit}>
            <div className="feedback-form-grid">
              <div className="feedback-field">
                <label htmlFor="subject">Subject</label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="Example: Journal experience or navigation"
                />
              </div>

              <div className="feedback-field">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" value={form.category} onChange={handleChange}>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="feedback-field">
              <label>Overall Rating</label>
              <div className="feedback-rating-row" role="radiogroup" aria-label="Feedback rating">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    className={`feedback-star ${Number(form.rating) >= value ? 'active' : ''}`}
                    onClick={() => setForm((current) => ({ ...current, rating: value }))}
                    aria-label={`Rate ${value} out of 5`}
                  >
                    <Star size={22} fill={Number(form.rating) >= value ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>

            <div className="feedback-field">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                rows="7"
                value={form.message}
                onChange={handleChange}
                placeholder="Share your experience, concern, or idea."
                required
              />
            </div>

            {status.message && (
              <div className={`feedback-status ${status.type}`}>
                {status.message}
              </div>
            )}

            <div className="feedback-submit-row">
              <button type="submit" className="feedback-submit-btn" disabled={submitting}>
                <Send size={16} />
                {submitting ? 'Submitting...' : 'Submit Feedback'}
              </button>
              {storedUser?.role === 'admin' && (
                <button type="button" className="feedback-admin-link" onClick={() => navigate('/admin')}>
                  Open Admin Console
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Feedback;
