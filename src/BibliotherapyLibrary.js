import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, BookOpen, Clock, Heart, Leaf, Search, Sparkles } from 'lucide-react';
import { libraryData, quotesData } from './biblioData';
import './BibliotherapyLibrary.css';

const BibliotherapyLibrary = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedItems, setSavedItems] = useState(new Set());
  const articlesRef = useRef(null);
  const storiesRef = useRef(null);
  const thoughtsRef = useRef(null);
  const quotesRef = useRef(null);

  const categories = ['All', 'Article', 'Story', 'Thought'];
  const totalCollections = new Set(libraryData.map((item) => item.collection)).size;
  const totalAuthors = new Set(libraryData.map((item) => item.author)).size;
  const featuredArticle = libraryData.find((item) => item.featured);
  const articles = libraryData.filter((item) => item.type === 'Article');
  const stories = libraryData.filter((item) => item.type === 'Story');
  const thoughts = libraryData.filter((item) => item.type === 'Thought');

  const filteredLibrary = useMemo(() => {
    let items = libraryData.filter((item) => !item.featured);

    if (activeCategory !== 'All') {
      items = items.filter((item) => item.type === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.excerpt.toLowerCase().includes(q) ||
          (item.subtitle && item.subtitle.toLowerCase().includes(q)) ||
          (item.genre && item.genre.toLowerCase().includes(q)) ||
          (item.collection && item.collection.toLowerCase().includes(q)) ||
          (item.author && item.author.toLowerCase().includes(q)) ||
          (item.tags && item.tags.some((tag) => tag.toLowerCase().includes(q)))
      );
    }

    return items;
  }, [activeCategory, searchQuery]);

  const toggleSave = (event, id) => {
    event.stopPropagation();
    setSavedItems((current) => {
      const next = new Set(current);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scrollToSection = (sectionRef) => {
    sectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const showLibraryHome = activeCategory === 'All' && !searchQuery.trim();

  return (
    <div className="biblio2-container">
      <div className="biblio2-ambient biblio2-ambient-one" />
      <div className="biblio2-ambient biblio2-ambient-two" />
      <div className="biblio2-ambient biblio2-ambient-three" />

      <header className="biblio2-header">
        <button className="biblio2-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> Back
        </button>

        <div className="biblio2-title-wrap">
          <div className="biblio2-logo">
            <Leaf size={18} />
          </div>
          <div>
            <h1>Bibliotherapy</h1>
            <p>A reflective library inside The Serene Path</p>
          </div>
        </div>

        <div className="biblio2-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search by title, person, mood, theme..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
          />
        </div>
      </header>

      <main className="biblio2-main">
        {showLibraryHome && featuredArticle && (
          <section className="biblio2-featured">
            <div className="biblio2-featured-card">
              <div className="biblio2-featured-copy">
                <span className="biblio2-badge">
                  <Sparkles size={12} /> Featured Reading
                </span>
                <h2>{featuredArticle.title}</h2>
                <h3>{featuredArticle.subtitle}</h3>
                <p>{featuredArticle.excerpt}</p>
                <div className="biblio2-featured-meta">
                  <span>{featuredArticle.collection}</span>
                  <span>{featuredArticle.author}</span>
                  <span><Clock size={13} /> {featuredArticle.readTime}</span>
                </div>
                <button
                  className="biblio2-primary-btn"
                  onClick={() => navigate(`/bibliotherapy/${featuredArticle.id}`)}
                >
                  Start Reading
                </button>
              </div>

              <div className="biblio2-featured-art">
                <img src={featuredArticle.image} alt={featuredArticle.title} />
                <div className="biblio2-featured-overlay" />
              </div>
            </div>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-overview">
            <div className="biblio2-overview-card">
              <span>Articles</span>
              <strong>{articles.length}</strong>
            </div>
            <div className="biblio2-overview-card">
              <span>Stories</span>
              <strong>{stories.length}</strong>
            </div>
            <div className="biblio2-overview-card">
              <span>Thoughts</span>
              <strong>{thoughts.length}</strong>
            </div>
            <div className="biblio2-overview-card">
              <span>Collections</span>
              <strong>{totalCollections}</strong>
            </div>
            <div className="biblio2-overview-card">
              <span>Voices</span>
              <strong>{totalAuthors}</strong>
            </div>
            <div className="biblio2-overview-card">
              <span>Quotes</span>
              <strong>{quotesData.length}</strong>
            </div>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-jump-nav">
            <button className="biblio2-jump-btn" onClick={() => scrollToSection(articlesRef)}>Articles</button>
            <button className="biblio2-jump-btn" onClick={() => scrollToSection(storiesRef)}>Stories</button>
            <button className="biblio2-jump-btn" onClick={() => scrollToSection(thoughtsRef)}>Thoughts</button>
            <button className="biblio2-jump-btn" onClick={() => scrollToSection(quotesRef)}>Quotes</button>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-shelf" ref={articlesRef}>
            <div className="biblio2-section-head">
              <div>
                <h2>Articles</h2>
                <p>Shorter reflective reads for quick support and gentle clarity.</p>
              </div>
            </div>
            <div className="biblio2-shelf-row">
              {articles.map((item) => (
                <article key={item.id} className="biblio2-card biblio2-card-compact">
                  <div className="biblio2-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="biblio2-card-top">
                    <span className="biblio2-type-tag">{item.type}</span>
                    <button
                      className={`biblio2-save ${savedItems.has(item.id) ? 'saved' : ''}`}
                      onClick={(event) => toggleSave(event, item.id)}
                      aria-label={savedItems.has(item.id) ? 'Unsave' : 'Save'}
                    >
                      <Heart size={16} fill={savedItems.has(item.id) ? '#e07b7b' : 'none'} />
                    </button>
                  </div>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p className="biblio2-excerpt">{item.excerpt}</p>
                  <div className="biblio2-card-footer">
                    <span className="biblio2-time"><Clock size={13} /> {item.readTime}</span>
                    <button className="biblio2-link-btn" onClick={() => navigate(`/bibliotherapy/${item.id}`)}>
                      Read <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-shelf" ref={storiesRef}>
            <div className="biblio2-section-head">
              <div>
                <h2>Stories</h2>
                <p>Slightly longer reading for comfort, meaning, and emotional company.</p>
              </div>
            </div>
            <div className="biblio2-shelf-row">
              {stories.map((item) => (
                <article key={item.id} className="biblio2-card biblio2-card-story">
                  <div className="biblio2-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="biblio2-card-top">
                    <span className="biblio2-type-tag">{item.type} / {item.genre}</span>
                    <span className="biblio2-time"><Clock size={13} /> {item.readTime}</span>
                  </div>
                  <h3>{item.title}</h3>
                  <h4>{item.subtitle}</h4>
                  <p className="biblio2-excerpt">{item.excerpt}</p>
                  <div className="biblio2-mood-row">
                    {(item.moodSupport || []).slice(0, 3).map((mood) => (
                      <span key={mood} className="biblio2-mood-chip">{mood}</span>
                    ))}
                  </div>
                  <div className="biblio2-card-footer">
                    <span className="biblio2-card-note">Longer, immersive reading</span>
                    <button className="biblio2-link-btn" onClick={() => navigate(`/bibliotherapy/${item.id}`)}>
                      Read Story <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-thoughts" ref={thoughtsRef}>
            <div className="biblio2-section-head">
              <div>
                <h2>Motivational Thoughts</h2>
                <p>Small wisdom pieces inspired by widely loved voices and thinkers.</p>
              </div>
            </div>
            <div className="biblio2-thought-grid">
              {thoughts.map((item) => (
                <article key={item.id} className="biblio2-thought-card">
                  <img src={item.image} alt={item.title} />
                  <div className="biblio2-thought-overlay" />
                  <div className="biblio2-thought-content">
                    <span className="biblio2-type-tag">{item.author}</span>
                    <h3>{item.title}</h3>
                    <p className="biblio2-thought-quote">{item.excerpt}</p>
                    <button className="biblio2-primary-btn biblio2-primary-btn-small" onClick={() => navigate(`/bibliotherapy/${item.id}`)}>
                      Read Thought
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {showLibraryHome && (
          <section className="biblio2-quote-gallery" ref={quotesRef}>
            <div className="biblio2-section-head">
              <div>
                <h2>Quote Gallery</h2>
                <p>Short lines with image backgrounds for a more visual, modern pause.</p>
              </div>
            </div>
            <div className="biblio2-quote-grid">
              {quotesData.map((quote) => (
                <article key={quote.id} className="biblio2-quote-panel">
                  <img src={quote.image} alt={quote.author} />
                  <div className="biblio2-quote-overlay" />
                  <div className="biblio2-quote-copy">
                    <p>{quote.text}</p>
                    <span>{quote.author}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <section className="biblio2-controls">
          <div className="biblio2-filter-row">
            {categories.map((category) => (
              <button
                key={category}
                className={`biblio2-filter-pill ${activeCategory === category ? 'active' : ''}`}
                onClick={() => setActiveCategory(category)}
              >
                {category === 'All' ? 'Everything' : `${category}s`}
              </button>
            ))}
          </div>
          <span className="biblio2-count">
            {filteredLibrary.length} {filteredLibrary.length === 1 ? 'piece' : 'pieces'}
          </span>
        </section>

        {!showLibraryHome && (
          <section className="biblio2-grid">
            {filteredLibrary.length === 0 ? (
              <div className="biblio2-empty">
                <BookOpen size={36} strokeWidth={1.2} />
                <p>No results found for "{searchQuery}"</p>
              </div>
            ) : (
              filteredLibrary.map((item) => (
                <article key={item.id} className="biblio2-card">
                  <div className="biblio2-card-image">
                    <img src={item.image} alt={item.title} />
                  </div>
                  <div className="biblio2-card-top">
                    <span className="biblio2-type-tag">
                      {item.type}
                      {item.genre ? ` / ${item.genre}` : ''}
                    </span>
                    <button
                      className={`biblio2-save ${savedItems.has(item.id) ? 'saved' : ''}`}
                      onClick={(event) => toggleSave(event, item.id)}
                      aria-label={savedItems.has(item.id) ? 'Unsave' : 'Save'}
                    >
                      <Heart size={16} fill={savedItems.has(item.id) ? '#e07b7b' : 'none'} />
                    </button>
                  </div>

                  <h3>{item.title}</h3>
                  {item.subtitle && <h4>{item.subtitle}</h4>}
                  <p className="biblio2-excerpt">{item.excerpt}</p>

                  <div className="biblio2-card-meta">
                    <span>{item.author}</span>
                    <span>{item.collection}</span>
                  </div>

                  <div className="biblio2-mood-row">
                    {(item.moodSupport || []).slice(0, 3).map((mood) => (
                      <span key={mood} className="biblio2-mood-chip">{mood}</span>
                    ))}
                  </div>

                  <div className="biblio2-card-footer">
                    <span className="biblio2-time"><Clock size={13} /> {item.readTime}</span>
                    <button className="biblio2-link-btn" onClick={() => navigate(`/bibliotherapy/${item.id}`)}>
                      Read <ArrowRight size={14} />
                    </button>
                  </div>
                </article>
              ))
            )}
          </section>
        )}
      </main>
    </div>
  );
};

export default BibliotherapyLibrary;
