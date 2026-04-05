import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Sanctuary.css';

// ─── CONTENT LIBRARY (no DB — all embedded / YouTube) ────────────────────────
const GENRES = ['All', 'Meditation', 'Yoga', 'Motivation', 'Sleep', 'Breathwork', 'Nature', 'Playlists'];

const MEDIA = [
  // ── MEDITATION ──
  {
    id: 1, genre: 'Meditation', type: 'video',
    title: '10-Minute Morning Meditation',
    description: 'Start your day with clarity and calm.',
    duration: '10:00', youtubeId: 'inpok4MKVLM', thumb: 'https://img.youtube.com/vi/inpok4MKVLM/mqdefault.jpg',
  },
  {
    id: 2, genre: 'Meditation', type: 'video',
    title: 'Body Scan for Deep Relaxation',
    description: 'Release tension from head to toe.',
    duration: '20:00', youtubeId: '3o9etQktCpI', thumb: 'https://img.youtube.com/vi/3o9etQktCpI/mqdefault.jpg',
  },
  {
    id: 3, genre: 'Meditation', type: 'video',
    title: 'Loving-Kindness Meditation',
    description: 'Cultivate compassion for yourself and others.',
    duration: '15:00', youtubeId: 'sz7cpV7ERsM', thumb: 'https://img.youtube.com/vi/sz7cpV7ERsM/mqdefault.jpg',
  },
  {
    id: 4, genre: 'Meditation', type: 'video',
    title: 'Guided Mindfulness — Anxiety Relief',
    description: 'Calm racing thoughts with gentle mindfulness.',
    duration: '12:00', youtubeId: 'O-6f5wQXSu8', thumb: 'https://img.youtube.com/vi/O-6f5wQXSu8/mqdefault.jpg',
  },

  // ── YOGA ──
  {
    id: 5, genre: 'Yoga', type: 'video',
    title: 'Gentle Morning Yoga Flow',
    description: 'Wake the body softly with this gentle flow.',
    duration: '20:00', youtubeId: 'oBu-pQG6sTY', thumb: 'https://img.youtube.com/vi/oBu-pQG6sTY/mqdefault.jpg',
  },
  {
    id: 6, genre: 'Yoga', type: 'video',
    title: 'Yin Yoga for Deep Stretch',
    description: 'Hold poses for deep connective tissue release.',
    duration: '45:00', youtubeId: 'sTANio_2E0Q', thumb: 'https://img.youtube.com/vi/sTANio_2E0Q/mqdefault.jpg',
  },
  {
    id: 7, genre: 'Yoga', type: 'video',
    title: 'Yoga Nidra — Yogic Sleep',
    description: 'The deepest form of conscious relaxation.',
    duration: '30:00', youtubeId: 'wDykOfImzkM', thumb: 'https://img.youtube.com/vi/wDykOfImzkM/mqdefault.jpg',
  },
  {
    id: 8, genre: 'Yoga', type: 'video',
    title: 'Restorative Evening Yoga',
    description: 'Unwind before sleep with restorative poses.',
    duration: '25:00', youtubeId: '4C-gxOE0j7s', thumb: 'https://img.youtube.com/vi/4C-gxOE0j7s/mqdefault.jpg',
  },

  // ── MOTIVATION ──
  {
    id: 9, genre: 'Motivation', type: 'video',
    title: 'The Power of Now — Eckhart Tolle',
    description: 'Live fully in the present moment.',
    duration: '60:00', youtubeId: 'd1yQN6DiZfY', thumb: 'https://img.youtube.com/vi/d1yQN6DiZfY/mqdefault.jpg',
  },
  {
    id: 10, genre: 'Motivation', type: 'video',
    title: 'Build Unshakeable Confidence',
    description: 'Mindset shifts that create lasting confidence.',
    duration: '18:00', youtubeId: '1vx8iUvfyCY', thumb: 'https://img.youtube.com/vi/1vx8iUvfyCY/mqdefault.jpg',
  },
  {
    id: 11, genre: 'Motivation', type: 'video',
    title: 'How to Stop Worrying',
    description: 'Practical wisdom for a lighter mind.',
    duration: '22:00', youtubeId: 'OmLo273D5pk', thumb: 'https://img.youtube.com/vi/OmLo273D5pk/mqdefault.jpg',
  },

  // ── SLEEP ──
  {
    id: 12, genre: 'Sleep', type: 'video',
    title: 'Deep Sleep Meditation',
    description: 'Drift into peaceful sleep effortlessly.',
    duration: '60:00', youtubeId: 'aEqlQvczMJQ', thumb: 'https://img.youtube.com/vi/aEqlQvczMJQ/mqdefault.jpg',
  },
  {
    id: 13, genre: 'Sleep', type: 'video',
    title: 'Sleep Story — Enchanted Forest',
    description: 'A guided journey into restful slumber.',
    duration: '35:00', youtubeId: 'Jyy0ra2WcQQ', thumb: 'https://img.youtube.com/vi/Jyy0ra2WcQQ/mqdefault.jpg',
  },
  {
    id: 14, genre: 'Sleep', type: 'video',
    title: '432 Hz Sleep Music — All Night',
    description: 'Healing frequencies for deep restorative sleep.',
    duration: '8h', youtubeId: 'RaF0fZKMiJ4', thumb: 'https://img.youtube.com/vi/RaF0fZKMiJ4/mqdefault.jpg',
  },

  // ── BREATHWORK ──
  {
    id: 15, genre: 'Breathwork', type: 'video',
    title: 'Wim Hof Breathing Technique',
    description: 'Energise body and mind with powerful breath.',
    duration: '11:00', youtubeId: 'tybOi4hjZFQ', thumb: 'https://img.youtube.com/vi/tybOi4hjZFQ/mqdefault.jpg',
  },
  {
    id: 16, genre: 'Breathwork', type: 'video',
    title: '4-7-8 Breathing for Calm',
    description: 'The natural tranquiliser for the nervous system.',
    duration: '5:00', youtubeId: 'YRPh_GaiL8s', thumb: 'https://img.youtube.com/vi/YRPh_GaiL8s/mqdefault.jpg',
  },
  // FIX: Replaced youtubeId 'tEmt1Znux58' — that video disables embedding.
  {
    id: 17, genre: 'Breathwork', type: 'video',
    title: 'Box Breathing — Navy SEAL Technique',
    description: 'Regain focus and calm under pressure.',
    duration: '8:00', youtubeId: 'aNXKjGFUlMs', thumb: 'https://img.youtube.com/vi/aNXKjGFUlMs/mqdefault.jpg',
  },

  // ── NATURE SOUNDS ──
  {
    id: 18, genre: 'Nature', type: 'audio',
    title: 'Rain on Forest Leaves',
    description: 'Immersive rainfall deep in a lush forest.',
    duration: '3h', youtubeId: 'q76bMs-NwRk', thumb: 'https://img.youtube.com/vi/q76bMs-NwRk/mqdefault.jpg',
  },
  {
    id: 19, genre: 'Nature', type: 'audio',
    title: 'Ocean Waves at Sunrise',
    description: 'Gentle tides lapping a peaceful shore.',
    duration: '2h', youtubeId: 'BHACKCNDMW8', thumb: 'https://img.youtube.com/vi/BHACKCNDMW8/mqdefault.jpg',
  },
  {
    id: 20, genre: 'Nature', type: 'audio',
    title: 'Tibetan Singing Bowls',
    description: 'Ancient bowls tuned to healing frequencies.',
    duration: '1h', youtubeId: '-4rtl36Cz48', thumb: 'https://img.youtube.com/vi/-4rtl36Cz48/mqdefault.jpg',
  },
  {
    id: 21, genre: 'Nature', type: 'audio',
    title: 'Mountain Stream & Birdsong',
    description: 'Peaceful valley sounds for focus or rest.',
    duration: '3h', youtubeId: 'xNN7iTA57jM', thumb: 'https://img.youtube.com/vi/xNN7iTA57jM/mqdefault.jpg',
  },

  // ── PLAYLISTS ──
  {
    id: 22, genre: 'Playlists', type: 'playlist',
    title: 'Peaceful Piano Music',
    description: 'Hours of gentle piano music for calm focus.',
    duration: 'Playlist', youtubeId: 'tCZfPsujMfk', isPlaylist: true,
    thumb: 'https://img.youtube.com/vi/tCZfPsujMfk/mqdefault.jpg',
  },
  {
    id: 23, genre: 'Playlists', type: 'playlist',
    title: 'Lofi Chill — Study & Relax',
    description: 'Uninterrupted lofi beats to calm your mind.',
    duration: 'Live', youtubeId: 'jfKfPfyJRdk', isPlaylist: false,
    thumb: 'https://img.youtube.com/vi/jfKfPfyJRdk/mqdefault.jpg',
  },
  {
    id: 24, genre: 'Playlists', type: 'playlist',
    title: 'Spa & Healing Music Mix',
    description: 'Curated ambient spa sounds and gentle melodies.',
    duration: 'Playlist', youtubeId: 'PLFs4vir_WsTwEd-nJgVJCZPNL3HALHHpF', isPlaylist: true,
    thumb: 'https://img.youtube.com/vi/hlWiI4xVXKY/mqdefault.jpg',
  },
  {
    id: 25, genre: 'Motivation', type: 'video',
    title: 'Morning Motivation Mix',
    description: 'Uplifting talks and music to start the day right.',
    duration: 'Playlist', youtubeId: 'ur6AawoZQuA', 
    thumb: 'https://img.youtube.com/vi/ur6AawoZQuA/mqdefault.jpg',
  },
];

const GENRE_META = {
  All:        { icon: '✨', color: '#7a9e87' },
  Meditation: { icon: '🧘', color: '#8b7aad' },
  Yoga:       { icon: '🌸', color: '#c8754a' },
  Motivation: { icon: '🔥', color: '#d4952a' },
  Sleep:      { icon: '🌙', color: '#5a7eb5' },
  Breathwork: { icon: '🌬️', color: '#4aa8a0' },
  Nature:     { icon: '🌿', color: '#5f7e6c' },
  Playlists:  { icon: '🎵', color: '#a06080' },
};

const TYPE_ICON = { video: '▶', audio: '🎧', playlist: '≡' };

// ── Breathwork Timer Component ────────────────────────────────────────────────
const BreathTimer = ({ onClose }) => {
  const phases = [
    { label: 'Inhale',    duration: 4,  color: '#7a9e87' },
    { label: 'Hold',      duration: 7,  color: '#8b7aad' },
    { label: 'Exhale',    duration: 8,  color: '#5a7eb5' },
  ];
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [count, setCount]       = useState(phases[0].duration);
  const [running, setRunning]   = useState(false);
  const [cycles, setCycles]     = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    timerRef.current = setInterval(() => {
      setCount(c => {
        if (c <= 1) {
          setPhaseIdx(p => {
            const next = (p + 1) % phases.length;
            if (next === 0) setCycles(cy => cy + 1);
            return next;
          });
          return phases[(phaseIdx + 1) % phases.length].duration;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, phaseIdx]);

  const toggle = () => { setRunning(r => !r); };
  const reset  = () => { setRunning(false); setPhaseIdx(0); setCount(phases[0].duration); setCycles(0); };
  const phase  = phases[phaseIdx];
  const progress = ((phase.duration - count) / phase.duration) * 100;

  return (
    <motion.div className="breath-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={e => { if (e.target.classList.contains('breath-overlay')) onClose(); }}>
      <motion.div className="breath-modal" initial={{ scale: 0.88 }} animate={{ scale: 1 }}>
        <button className="breath-close" onClick={onClose}>✕</button>
        <h2 className="breath-title">4 · 7 · 8 Breathwork</h2>
        <p className="breath-subtitle">{cycles} cycle{cycles !== 1 ? 's' : ''} completed</p>

        <div className="breath-circle-wrap">
          <svg className="breath-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#e8ddd0" strokeWidth="6"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke={phase.color} strokeWidth="6"
              strokeDasharray={`${2 * Math.PI * 54}`}
              strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress / 100)}`}
              strokeLinecap="round" transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
            />
          </svg>
          <div className="breath-inner">
            <div className="breath-count">{count}</div>
            <div className="breath-phase" style={{ color: phase.color }}>{phase.label}</div>
          </div>
        </div>

        <div className="breath-phases-row">
          {phases.map((p, i) => (
            <div key={p.label} className={`breath-phase-pill ${i === phaseIdx ? 'active' : ''}`}
              style={{ '--pc': p.color }}>
              <span>{p.label}</span>
              <strong>{p.duration}s</strong>
            </div>
          ))}
        </div>

        <div className="breath-controls">
          <button className="breath-btn" onClick={toggle}>{running ? '⏸ Pause' : '▶ Start'}</button>
          <button className="breath-btn secondary" onClick={reset}>↺ Reset</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Sanctuary = () => {
  const [activeGenre, setActiveGenre]   = useState('All');
  const [activeType,  setActiveType]    = useState('All');
  const [searchQuery, setSearchQuery]   = useState('');
  const [playing,     setPlaying]       = useState(null);
  const [showBreath,  setShowBreath]    = useState(false);
  const [favorites,   setFavorites]     = useState(() => {
    try { return JSON.parse(localStorage.getItem('sanctuary_favs') || '[]'); } catch { return []; }
  });
  const [showFavsOnly, setShowFavsOnly] = useState(false);
  const [toast, setToast]               = useState('');

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 2500); };

  const toggleFav = (id) => {
    const updated = favorites.includes(id) ? favorites.filter(f => f !== id) : [...favorites, id];
    setFavorites(updated);
    localStorage.setItem('sanctuary_favs', JSON.stringify(updated));
    showToast(favorites.includes(id) ? 'Removed from favourites' : '❤️ Added to favourites');
  };

  const filtered = MEDIA.filter(m => {
    const genreMatch = activeGenre === 'All' || m.genre === activeGenre;
    const typeMatch  = activeType  === 'All' || m.type  === activeType;
    const favMatch   = !showFavsOnly || favorites.includes(m.id);
    const search     = !searchQuery || m.title.toLowerCase().includes(searchQuery.toLowerCase()) || m.description.toLowerCase().includes(searchQuery.toLowerCase());
    return genreMatch && typeMatch && favMatch && search;
  });

  const getEmbedUrl = (item) => {
    if (item.isPlaylist) return `https://www.youtube.com/embed/videoseries?list=${item.youtubeId}&autoplay=1`;
    return `https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`;
  };

  const featured = MEDIA.filter(m => [12, 1, 5, 18, 9, 22].includes(m.id));

  return (
    <div className="san-root">
      {/* Ambient background orbs */}
      <div className="san-bg">
        <div className="san-orb san-orb-1" />
        <div className="san-orb san-orb-2" />
        <div className="san-orb san-orb-3" />
      </div>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div className="san-toast" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Breathwork modal */}
      <AnimatePresence>
        {showBreath && <BreathTimer onClose={() => setShowBreath(false)} />}
      </AnimatePresence>

      {/* Video Player Modal */}
      <AnimatePresence>
        {playing && (
          <motion.div className="san-player-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={e => { if (e.target.classList.contains('san-player-overlay')) setPlaying(null); }}>
            <motion.div className="san-player-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="san-player-header">
                <div>
                  <h3 className="san-player-title">{playing.title}</h3>
                  <p className="san-player-meta">{GENRE_META[playing.genre].icon} {playing.genre} · {playing.duration}</p>
                </div>
                <button className="san-player-close" onClick={() => setPlaying(null)}>✕</button>
              </div>
              <div className="san-iframe-wrap">
                <iframe
                  src={getEmbedUrl(playing)}
                  title={playing.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <header className="san-hero">
        <motion.div className="san-hero-inner" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="san-hero-badge">✨ Multimedia Sanctuary</div>
          <h1 className="san-hero-title">Your Space to <em>Breathe & Restore</em></h1>
          <p className="san-hero-sub">Curated meditations, yoga flows, soundscapes, and wisdom for your inner journey.</p>
          <div className="san-hero-actions">
            <button className="san-cta-primary" onClick={() => setPlaying(MEDIA[11])}>▶ Begin Today's Session</button>
            <button className="san-cta-ghost"   onClick={() => setShowBreath(true)}>🌬️ Breathwork Timer</button>
          </div>
        </motion.div>
        <div className="san-hero-cards">
          {featured.slice(0,3).map((m, i) => (
            <motion.div key={m.id} className="san-hero-card" style={{ animationDelay: `${i * 0.15}s` }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
              onClick={() => setPlaying(m)}>
              <img src={m.thumb} alt={m.title} />
              <div className="san-hero-card-info">
                <span>{GENRE_META[m.genre].icon}</span>
                <p>{m.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </header>

      {/* ── GENRE PILLS ── */}
      <section className="san-genres-section">
        <div className="san-genres-scroll">
          {GENRES.map(g => (
            <button key={g} className={`san-genre-pill ${activeGenre === g ? 'active' : ''}`}
              style={{ '--gc': GENRE_META[g].color }}
              onClick={() => setActiveGenre(g)}>
              <span>{GENRE_META[g].icon}</span> {g}
            </button>
          ))}
        </div>
      </section>

      {/* ── FILTERS + SEARCH ── */}
      <section className="san-toolbar">
        <div className="san-search-wrap">
          <span>🔍</span>
          <input className="san-search" placeholder="Search sessions…" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)} />
          {searchQuery && <button className="san-search-clear" onClick={() => setSearchQuery('')}>✕</button>}
        </div>

        <div className="san-type-filters">
          {['All','video','audio','playlist'].map(t => (
            <button key={t} className={`san-type-btn ${activeType === t ? 'active' : ''}`}
              onClick={() => setActiveType(t)}>
              {t === 'All' ? 'All' : TYPE_ICON[t] + ' ' + t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
          <button className={`san-type-btn ${showFavsOnly ? 'active fav' : ''}`}
            onClick={() => setShowFavsOnly(f => !f)}>
            {showFavsOnly ? '❤️' : '🤍'} Favourites
          </button>
        </div>
      </section>

      {/* ── MEDIA GRID ── */}
      <section className="san-grid-section">
        <div className="san-section-header">
          <h2 className="san-section-title">
            {activeGenre === 'All' ? 'All Sessions' : `${GENRE_META[activeGenre].icon} ${activeGenre}`}
          </h2>
          <span className="san-count">{filtered.length} {filtered.length === 1 ? 'session' : 'sessions'}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="san-empty">
            <div>🌱</div>
            <p>No sessions found. Try a different filter.</p>
          </div>
        ) : (
          <div className="san-grid">
            <AnimatePresence>
              {filtered.map((item, i) => (
                <motion.div key={item.id} className="san-card"
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: i * 0.04 }}>

                  {/* Thumbnail */}
                  <div className="san-card-thumb" onClick={() => setPlaying(item)}>
                    <img src={item.thumb} alt={item.title} loading="lazy" />
                    <div className="san-card-overlay">
                      <div className="san-play-btn">{TYPE_ICON[item.type]}</div>
                    </div>
                    <div className="san-card-type-badge" style={{ '--gc': GENRE_META[item.genre].color }}>
                      {item.type}
                    </div>
                    <div className="san-card-duration">{item.duration}</div>
                  </div>

                  {/* Info */}
                  <div className="san-card-body">
                    <div className="san-card-genre" style={{ color: GENRE_META[item.genre].color }}>
                      {GENRE_META[item.genre].icon} {item.genre}
                    </div>
                    <h3 className="san-card-title" onClick={() => setPlaying(item)}>{item.title}</h3>
                    <p className="san-card-desc">{item.description}</p>
                    <div className="san-card-footer">
                      <button className="san-play-text-btn" onClick={() => setPlaying(item)}>
                        {item.type === 'playlist' ? '≡ Open Playlist' : item.type === 'audio' ? '🎧 Listen' : '▶ Watch'}
                      </button>
                      <button className={`san-fav-btn ${favorites.includes(item.id) ? 'active' : ''}`}
                        onClick={() => toggleFav(item.id)} title="Favourite">
                        {favorites.includes(item.id) ? '❤️' : '🤍'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>

      {/* ── EMBEDDED PLAYLISTS SECTION ── */}
      <section className="san-playlists-section">
        <div className="san-section-header">
          <h2 className="san-section-title">🎵 Peaceful Playlists</h2>
          <span className="san-count">Always playing</span>
        </div>
        <div className="san-playlists-grid">
          <div className="san-pl-card">
            <h4>☁️ Lofi Chill — Live 24/7</h4>
            <p>Uninterrupted lofi hip-hop to relax and study.</p>
            <div className="san-pl-embed">
              <iframe src="https://www.youtube.com/embed/jfKfPfyJRdk?si=0&autoplay=0"
                title="Lofi Chill" frameBorder="0" allowFullScreen />
            </div>
          </div>
          <div className="san-pl-card">
            <h4>🎹 Peaceful Piano Mix</h4>
            <p>Gentle piano melodies for moments of quiet.</p>
            <div className="san-pl-embed">
              <iframe src="https://www.youtube.com/embed/FS93cEWcwQA?si=0&autoplay=0"
                title="Piano" frameBorder="0" allowFullScreen />
            </div>
          </div>
          <div className="san-pl-card">
            <h4>🌿 Tibetan Singing Bowls</h4>
            <p>Ancient healing frequencies to restore inner peace.</p>
            <div className="san-pl-embed">
              <iframe src="https://www.youtube.com/embed/ur6AawoZQuA?si=0&autoplay=0"
                title="Singing Bowls" frameBorder="0" allowFullScreen />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK TECHNIQUES ── */}
      <section className="san-techniques-section">
        <h2 className="san-section-title" style={{ marginBottom: '20px' }}>🌬️ Peaceful Techniques</h2>
        <div className="san-techniques-grid">
          {[
            // FIX 1: icon was '4' (plain string) → corrected to emoji '🌬️'
            { icon: '🌬️', label: '4-7-8 Breathing', desc: "Inhale 4s · Hold 7s · Exhale 8s. The nervous system's reset button.", action: () => setShowBreath(true), btn: 'Try Now' },
            // FIX 2: id 17 youtubeId replaced above — this call is now safe
            { icon: '🌊', label: 'Box Breathing', desc: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s. Used by Navy SEALs for calm focus.', action: () => setPlaying(MEDIA.find(m => m.id === 17)), btn: 'Watch Guide' },
            { icon: '🧘', label: 'Body Scan', desc: 'Slowly bring awareness from toes to crown, releasing stored tension as you go.', action: () => setPlaying(MEDIA.find(m => m.id === 2)), btn: 'Begin Scan' },
            { icon: '❤️', label: 'Loving Kindness', desc: 'Silently wish wellbeing to yourself, loved ones, strangers, and all beings.', action: () => setPlaying(MEDIA.find(m => m.id === 3)), btn: 'Start Practice' },
            // FIX 3: was action: null — now links to Wim Hof (id 15) as a complement
            { icon: '🌿', label: '5-4-3-2-1 Grounding', desc: 'Name 5 things you see · 4 touch · 3 hear · 2 smell · 1 taste. Instant grounding.', action: () => setPlaying(MEDIA.find(m => m.id === 15)), btn: 'Try Grounding' },
            { icon: '🌙', label: 'Yoga Nidra', desc: 'The most powerful rest — 30 min of Yoga Nidra equals hours of deep sleep.', action: () => setPlaying(MEDIA.find(m => m.id === 7)), btn: 'Try Session' },
          ].map((t, i) => (
            <motion.div key={t.label} className="san-technique-card"
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
              <div className="san-technique-icon">{t.icon}</div>
              <h4>{t.label}</h4>
              <p>{t.desc}</p>
              {t.btn && <button className="san-technique-btn" onClick={t.action}>{t.btn}</button>}
            </motion.div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Sanctuary;