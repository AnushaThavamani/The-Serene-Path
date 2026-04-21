import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './App.css';

const Home = () => {
  const navigate = useNavigate();
  const [quote, setQuote] = useState('Loading inspiration...');
  const [mood, setMood] = useState(null);
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    const quotes = [
      'Calm grows quietly when you give yourself a gentle place to land.',
      'Like leaves after rain, the mind settles when it feels safe enough to rest.',
      "Breathe slowly. You do not need to solve everything in one moment.",
      'Small steady rituals can soften even a very heavy day.',
      'Peace is often a return to yourself, one breath at a time.',
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const timer = setTimeout(() => setQuote(randomQuote), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
    setLogged(true);
    setTimeout(() => setLogged(false), 3000);
  };

  const navLinks = [
    { label: 'Journal', path: '/journal' },
    { label: 'Regulation', path: '/regulation' },
    { label: 'Sanctuary', path: '/sanctuary' },
    { label: 'Feedback', path: '/feedback' },
  ];

  const modules = [
    { title: 'Quiet Journal', eyebrow: 'Private Reflection', desc: 'Let thoughts settle into words in a private space designed for release and clarity.', path: '/journal' },
    { title: 'Breathing Reset', eyebrow: 'Gentle Regulation', desc: 'Use grounding practices, breath prompts, and emotional tools when your nervous system needs support.', path: '/regulation' },
    { title: 'Healing Library', eyebrow: 'Comforting Reads', desc: 'Explore carefully chosen stories and reflections that bring reassurance, hope, and perspective.', path: '/bibliotherapy' },
    { title: 'Nature Sanctuary', eyebrow: 'Audio And Visual Calm', desc: 'Pause with soothing sounds and serene sessions that feel like stepping into a quiet green retreat.', path: '/sanctuary' },
    { title: 'Support Feedback', eyebrow: 'Grow With Us', desc: 'Share what feels helpful so the experience stays more humane, calming, and useful over time.', path: '/feedback' },
  ];

  const highlights = [
    { value: 'Breathe', label: 'slow the pace of a noisy day' },
    { value: 'Reflect', label: 'write and notice what you need' },
    { value: 'Restore', label: 'return to a steadier inner rhythm' },
  ];

  const moods = [
    { label: 'Happy', mark: '01', cls: 'yellow' },
    { label: 'Calm', mark: '02', cls: 'green' },
    { label: 'Neutral', mark: '03', cls: 'beige' },
    { label: 'Sad', mark: '04', cls: 'peach' },
    { label: 'Stressed', mark: '05', cls: 'purple' },
  ];

  return (
    <div className="App home-shell">
      <div className="home-header-stack">
        <header className="home-topbar">
          <Link to="/" className="home-brand-mark">
            <span className="home-brand-dot">
              <span className="home-brand-monogram">SP</span>
            </span>
            <span className="home-brand-wording">
              <strong>The Serene Path</strong>
              <em>Mindful digital care</em>
            </span>
          </Link>

          <nav className="home-topnav">
            {navLinks.map((item) => (
              <Link key={item.label} to={item.path} className="home-topnav-link">
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="home-topbar-actions">
            <Link to="/login" className="home-topbar-link">Sign In</Link>
            <Link to="/register" className="home-topbar-cta">Get Started</Link>
          </div>
        </header>
      </div>

      <main className="container home-page-main">
        <motion.section
          className="home-reference-shell"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: 'easeOut' }}
        >
          <div className="home-reference-hero">
            <div className="home-reference-copy">
              <div className="home-hero-chip-row">
                <span className="home-hero-chip">Leaf green calm</span>
                <span className="home-hero-chip">Psychological ease</span>
              </div>
              <p className="home-kicker">Nature-inspired emotional wellbeing</p>
              <h1 className="home-reference-title">The Serene Path</h1>
              <p className="home-reference-quote">A softer digital space where the mind can unclench.</p>
              <p className="home-reference-text">
                Built around calming greens, quiet rituals, and gentle emotional support,
                this homepage invites you to slow down, check in, and choose the kind of care
                that feels right for today.
              </p>

              <div className="home-hero-actions home-reference-actions">
                <button className="home-primary-btn" onClick={() => navigate('/register')}>
                  Begin Your Calm Routine
                </button>
                <button className="home-secondary-btn" onClick={() => navigate('/login')}>
                  Return To Your Space
                </button>
              </div>

              <div className="home-hero-highlights">
                {highlights.map((item) => (
                  <div key={item.value} className="home-highlight-pill">
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="home-reference-visual" aria-hidden="true">
              <div className="home-visual-aura"></div>
              <div className="home-visual-leaf home-visual-leaf-one"></div>
              <div className="home-visual-leaf home-visual-leaf-two"></div>
              <div className="home-visual-card home-visual-card-main">
                <p>Daily grounding</p>
                <h3>Notice your breath. Relax your shoulders. Let the page meet you gently.</h3>
              </div>
              <div className="home-visual-card home-visual-card-soft">
                <span>Calm cues</span>
                <strong>Soft greens, quiet spacing, and supportive actions</strong>
              </div>
            </div>
          </div>

          <div className="home-reference-bottom">
            <div className="home-reference-panel home-reference-reflection">
              <p className="home-floating-kicker">Today's reflection</p>
              <h3>{quote}</h3>
            </div>

            <div className="home-reference-panel home-reference-mood">
              <div className="home-mood-copy">
                <p className="home-kicker">Mood check-in</p>
                <h2>How are you feeling today?</h2>
                <p>Choose your current mood and continue with the support that fits this moment.</p>
              </div>

              <div className="home-mood-options">
                {moods.map(({ label, mark, cls }) => (
                  <button
                    key={label}
                    className={`home-mood-option ${cls} ${mood === label ? 'selected' : ''}`}
                    onClick={() => handleMoodClick(label)}
                  >
                    <span>{mark}</span>
                    <strong>{label}</strong>
                  </button>
                ))}
              </div>

              <div className="home-mood-status">
                {logged ? 'Mood saved successfully.' : mood ? `Last selected: ${mood}` : 'Choose the feeling that is closest to your present state.'}
              </div>
            </div>

            <div className="home-reference-panel home-reference-modules">
              <div className="home-section-heading">
                <p className="home-kicker">Explore the experience</p>
                <h2>Choose the kind of support that matches your emotional energy.</h2>
                <p>Each space is designed to feel lighter, slower, and more reassuring.</p>
              </div>

              <div className="home-module-grid">
                {modules.map((mod, index) => (
                  <motion.article
                    key={mod.title}
                    className="home-module-card"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: index * 0.06 }}
                    onClick={() => navigate(mod.path)}
                  >
                    <p className="home-module-eyebrow">{mod.eyebrow}</p>
                    <h3>{mod.title}</h3>
                    <p>{mod.desc}</p>
                    <span className="home-module-link">
                      <span>Open module</span>
                      <span aria-hidden="true" className="home-module-link-arrow">↗</span>
                    </span>
                  </motion.article>
                ))}
              </div>
            </div>
          </div>
        </motion.section>

        <motion.section
          className="home-reference-footerband"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <div className="home-final-cta-card">
            <div>
              <p className="home-kicker">Ready to begin?</p>
              <h2>Start with one quiet step and let the rest unfold gently.</h2>
              <p>Create your space or sign in to continue with a softer, leaf-toned rhythm of care.</p>
            </div>
            <div className="home-final-actions">
              <Link to="/register" className="home-primary-btn home-link-btn">Create My Space</Link>
              <Link to="/login" className="home-secondary-btn home-link-btn">Sign In</Link>
            </div>
          </div>
        </motion.section>
      </main>

      <footer className="home-footer">
        <p>© 2026 The Serene Path</p>
      </footer>
    </div>
  );
};

export default Home;
