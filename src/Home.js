import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import './App.css';

const Home = () => {
  // --- 1. STATE & HOOKS ---
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Home');
  const [quote, setQuote] = useState("Loading inspiration...");

  // Dropdown State
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Mood Logic State
  const [mood, setMood] = useState(null);
  const [logged, setLogged] = useState(false);

  // --- 2. EFFECTS ---
  useEffect(() => {
    const quotes = [
      "Peace comes from within. Do not seek it without.",
      "Your calm mind is the ultimate weapon against your challenges.",
      "Breathe. It's just a bad day, not a bad life.",
      "The journey of a thousand miles begins with a single step.",
      "Happiness is not out there, it's in you."
    ];
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const timer = setTimeout(() => setQuote(randomQuote), 500);
    return () => clearTimeout(timer);
  }, []);

  // --- 3. HANDLERS ---
  const handleMoodClick = (selectedMood) => {
    setMood(selectedMood);
    setLogged(true);
    console.log(`Mood logged: ${selectedMood}`);
    setTimeout(() => setLogged(false), 3000);
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const modules = [
    { title: "Journaling",           icon: "📖", desc: "Private reflection space.",   path: "/journal" },
    { title: "Mood Analytics",       icon: "📊", desc: "Visual emotional trends.",     path: "/analytics" },
    { title: "Emotion Regulation",   icon: "🧠", desc: "Breathing & Grounding.",       path: "/regulation" },
    { title: "Bibliotherapy",        icon: "📚", desc: "Healing stories.",             path: "/bibliotherapy" },
    { title: "Multimedia Sanctuary", icon: "🎧", desc: "Audio/Video streams.",         path: "/sanctuary" },
    { title: "Feedback",             icon: "💬", desc: "Help us improve.",             path: "/feedback" }
  ];

  const moods = [
    { label: 'Happy',    emoji: '😊', cls: 'yellow'  },
    { label: 'Calm',     emoji: '🌿', cls: 'green'   },
    { label: 'Neutral',  emoji: '😐', cls: 'beige'   },
    { label: 'Sad',      emoji: '😔', cls: 'peach'   },
    { label: 'Stressed', emoji: '😴', cls: 'purple'  },
  ];

  // --- 4. RENDER ---
  return (
    <div className="App">

      {/* ── HEADER ── */}
      <header className="glass-header">
        <div className="auth-buttons">
          <Link to="/login"    className="auth-link">Login</Link>
          <Link to="/register" className="auth-btn-pill">Sign Up</Link>
        </div>

        <div className="institution-bar">
          <div className="logo-wrapper">
            <img
              src="/logo.png"
              alt="College Logo"
              className="college-logo"
              onError={(e) => e.target.style.display = 'none'}
            />
          </div>
          <div className="institution-text">
            <h2 className="college-name">THIAGARAJAR COLLEGE OF ENGINEERING</h2>
            <h3 className="dept-name">Department of Computer Applications</h3>
          </div>
        </div>

        <div className="brand-container">
          <h1 className="main-title">THE SERENE PATH</h1>
          <div className="title-divider"></div>
          <p className="brand-slogan">"Where chaos ends, serenity begins"</p>
        </div>
      </header>

      {/* ── NAVBAR ── */}
      <nav className="glass-pill-nav">

        <Link
          to="/about"
          className={activeTab === 'About' ? 'active' : ''}
          onClick={() => setActiveTab('About')}
        >
          About Us
        </Link>

        <div className="nav-dropdown-container">
          <button
            className={`dropdown-trigger ${activeTab === 'Sanctuary' ? 'active' : ''}`}
            onClick={toggleDropdown}
          >
            Explore Sanctuary {dropdownOpen ? '▴' : '▾'}
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <Link to={localStorage.getItem('user') ? "/journal" : "/login"} className="dropdown-item" onClick={() => setDropdownOpen(false)}>📔 Encrypted Journal</Link>
              <Link to="/emotion-regulation" className="dropdown-item" onClick={() => setDropdownOpen(false)}>🌬️ Emotion Regulation</Link>
              <Link to="/bibliotherapy"      className="dropdown-item" onClick={() => setDropdownOpen(false)}>📚 Bibliotherapy</Link>
              <Link to="/sanctuary"          className="dropdown-item" onClick={() => setDropdownOpen(false)}>🎵 Multimedia Sanctuary</Link>
            </div>
          )}
        </div>

        <Link
          to="/feedback"
          className={activeTab === 'Feedback' ? 'active' : ''}
          onClick={() => setActiveTab('Feedback')}
        >
          Feedback
        </Link>

      </nav>

      {/* ── MAIN ── */}
      <main className="container">

        {/* BLOCK 1 — HERO */}
        <motion.section
          className="hero-card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <div className="hero-content">
            <p className="subtitle">Welcome to your sanctuary</p>
            <h2 className="hero-headline">
              Find Your <span className="italic-accent">Inner Calm</span>
            </h2>
            <p className="hero-desc">
              A private, secure space designed to help you navigate your emotions,
              practice mindfulness, and rediscover your peace.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={() => navigate('/journal')}>
                Begin Journey
              </button>
              <button className="btn-secondary" onClick={() => navigate('/about')}>
                Learn More
              </button>
            </div>

            {/* Quote */}
            <div className="quote-mini">
              <span className="quote-icon">❝</span>
              <p id="quote-text">{quote}</p>
            </div>
          </div>

          <div className="hero-visual">
            <div className="image-arch">
              <img
                src="https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?q=80&w=1974&auto=format&fit=crop"
                alt="Peaceful Nature"
              />
            </div>
          </div>
        </motion.section>

        {/* BLOCK 2 — MOOD */}
        <motion.section
          className="modern-mood-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
        >
          <div className="modern-mood-card">
            <div>
              <p className="mood-greeting">
                Welcome back, <span className="mood-username">User</span>
              </p>
              <h2 className="mood-question">How are you feeling today?</h2>
            </div>

            <div className="mood-action-row">
              {moods.map(({ label, emoji, cls }) => (
                <button
                  key={label}
                  className={`modern-mood-btn ${cls} ${mood === label ? 'mood-selected' : ''}`}
                  onClick={() => handleMoodClick(label)}
                  title={label}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {mood && !logged && (
              <p className="mood-label-text">Last logged: <strong>{mood}</strong></p>
            )}

            {logged && (
              <div className="log-success-msg">
                ✨ Your wellness log has been saved successfully!
              </div>
            )}
          </div>
        </motion.section>

        {/* BLOCK 3 — WELLNESS GRID */}
        <section className="wellness-section">
          <h2 className="section-title">Your Wellness Modules</h2>
          <div className="wellness-grid">
            {modules.map((mod, index) => (
              <motion.div
                key={index}
                className="grid-card"
                initial={{ opacity: 0, scale: 0.92 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
                onClick={() => navigate(mod.path)}
              >
                <div className="grid-icon">{mod.icon}</div>
                <h3>{mod.title}</h3>
                <p>{mod.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

      </main>

      {/* ── FOOTER ── */}
      <footer>
        <p>© 2026 The Serene Path &nbsp;·&nbsp; Thiagarajar College of Engineering</p>
      </footer>

    </div>
  );
};

export default Home;