import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Clock, ArrowLeft, Heart, Search, ArrowRight, Leaf } from 'lucide-react';
import { libraryData, quotesData } from './biblioData';
import './Bibliotherapy.css';

const Bibliotherapy = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState(new Set());

  const categories = ['All', 'Article', 'Story', 'Blog'];

  const labelFor = (cat) => {
    if (cat === 'All') return 'Everything';
    if (cat === 'Story') return 'Stories';
    return `${cat}s`;
  };

  const toggleSave = (e, id) => {
    e.stopPropagation();
    setSavedItems(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const featuredArticle = libraryData.find(item => item.featured);

  const filteredLibrary = useMemo(() => {
    let items = libraryData.filter(item => !item.featured);
    if (activeCategory !== 'All') {
      items = items.filter(item => item.type === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        item =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.genre && item.genre.toLowerCase().includes(q))
      );
    }
    return items;
  }, [activeCategory, searchQuery]);

  const showHero = activeCategory === 'All' && !searchQuery.trim();

  return (
    <div className="biblio-container animate-fade-in">

      {/* ── HEADER ── */}
      <header className="biblio-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> Back
        </button>

        <div className="header-titles">
          <div className="header-logo">
            <div className="logo-icon">
              <Leaf size={18} />
            </div>
            <h1>Bibliotherapy</h1>
          </div>
          <span className="header-tagline">curated reading for the soul</span>
        </div>

        <div className="biblio-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search articles, stories…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </header>

      <main className="biblio-main">

        {/* ── HERO FEATURED CARD ── */}
        {showHero && featuredArticle && (
          <section className="featured-section">
            <div className="featured-card">
              <div className="featured-content">
                <span className="category-tag">
                  <Leaf size={12} /> Editor's Choice
                </span>
                <h2>{featuredArticle.title}</h2>
                <p>{featuredArticle.excerpt}</p>
                <div className="card-footer-hero">
                  <span className="read-time">
                    <Clock size={13} /> {featuredArticle.readTime}
                  </span>
                  <button
                    className="read-btn"
                    onClick={() => navigate(`/bibliotherapy/${featuredArticle.id}`)}
                  >
                    Start Reading
                  </button>
                </div>
              </div>

              <div className="featured-graphic">
                <div className="hero-visual">
                  <div className="hero-leaf-1" style={{ '--r': '0deg' }} />
                  <div className="hero-leaf-2" style={{ '--r': '45deg' }} />
                  <div className="hero-leaf-3" style={{ '--r': '-30deg' }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── QUOTES CAROUSEL ── */}
        {showHero && (
          <section className="quotes-section">
            <div className="section-header">
              <h2>Moments of Clarity</h2>
              <p>Gentle reminders — scroll to explore</p>
            </div>
            <div className="quotes-scroll-container">
              {quotesData.map(quote => (
                <div key={quote.id} className="quote-card">
                  <div className="quote-mark">"</div>
                  <p className="quote-text">{quote.text}</p>
                  <span className="quote-author">— {quote.author}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── FILTERS & COUNT ── */}
        <div className="filters-bar">
          <div className="category-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`filter-pill ${activeCategory === cat ? 'active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {labelFor(cat)}
              </button>
            ))}
          </div>
          <span className="results-count">
            {filteredLibrary.length} {filteredLibrary.length === 1 ? 'piece' : 'pieces'}
          </span>
        </div>

        {/* ── LIBRARY GRID ── */}
        <section className="library-grid">
          {filteredLibrary.length === 0 ? (
            <div className="empty-state">
              <BookOpen size={36} strokeWidth={1.2} color="var(--sage-mid)" />
              <p>No results found for "{searchQuery}"</p>
            </div>
          ) : (
            filteredLibrary.map(item => (
              <div key={item.id} className="library-card">
                <div className="card-top">
                  <span className="category-tag-standard">
                    {item.type}
                    {item.genre && (
                      <>
                        <span className="genre-dot" />
                        {item.genre}
                      </>
                    )}
                  </span>
                  <button
                    className={`save-btn ${savedItems.has(item.id) ? 'saved' : ''}`}
                    onClick={e => toggleSave(e, item.id)}
                    aria-label={savedItems.has(item.id) ? 'Unsave' : 'Save'}
                  >
                    <Heart size={16} fill={savedItems.has(item.id) ? '#e07b7b' : 'none'} />
                  </button>
                </div>

                <h3>{item.title}</h3>
                <p>{item.excerpt}</p>

                <div className="card-footer">
                  <span className="read-time-standard">
                    <Clock size={13} /> {item.readTime}
                  </span>
                  <button
                    className="text-btn"
                    onClick={() => navigate(`/bibliotherapy/${item.id}`)}
                  >
                    Read <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

      </main>
    </div>
  );
};

export default Bibliotherapy;