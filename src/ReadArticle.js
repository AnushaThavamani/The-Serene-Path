import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen } from 'lucide-react';
import { libraryData } from './biblioData';
import './ReadArticle.css';

const ReadArticle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [readProgress, setReadProgress] = useState(0);
  const articleRef = useRef(null);

  const article = libraryData.find(item => item.id === parseInt(id));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Reading progress bar tied to scroll
  useEffect(() => {
    const handleScroll = () => {
      const el = articleRef.current;
      if (!el) return;
      const { top, height } = el.getBoundingClientRect();
      const windowH = window.innerHeight;
      const scrolled = Math.max(0, windowH - top);
      const total = height + windowH;
      const pct = Math.min(100, Math.round((scrolled / total) * 100));
      setReadProgress(pct);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="read-container error-state">
        <BookOpen size={40} strokeWidth={1.2} color="var(--sage-mid)" />
        <h2 style={{ fontFamily: 'var(--font-display)', color: 'var(--ink)' }}>
          Content not found
        </h2>
        <p>This page may have been moved or deleted.</p>
        <button className="finish-btn" onClick={() => navigate('/bibliotherapy')}>
          <ArrowLeft size={17} /> Return to Library
        </button>
      </div>
    );
  }

  return (
    <div className="read-container animate-fade-in">

      {/* ── READING PROGRESS BAR ── */}
      <div
        className="read-progress-bar"
        style={{ width: `${readProgress}%` }}
        aria-hidden="true"
      />

      {/* ── STICKY HEADER ── */}
      <header className="read-header">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <ArrowLeft size={17} /> Back to Library
        </button>

        <div className="read-meta-header">
          <span className="type-tag-header">
            {article.type}{article.genre ? ` · ${article.genre}` : ''}
          </span>
          <span className="time-tag-header">
            <Clock size={13} /> {article.readTime}
          </span>
        </div>
      </header>

      {/* ── ARTICLE ── */}
      <main className="read-main" ref={articleRef}>
        <article className="article-wrapper">

          {/* Green banner with title */}
          <div className="article-banner">
            <div className="article-tags">
              <span className="type-tag">
                {article.type}{article.genre ? ` · ${article.genre}` : ''}
              </span>
              <span className="read-time">
                <Clock size={13} /> {article.readTime}
              </span>
            </div>
            <h1 className="article-title">{article.title}</h1>
            <p className="article-excerpt">{article.excerpt}</p>
          </div>

          {/* Body */}
          <div className="article-body-wrap">
            <div
              className="article-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>

          {/* Footer CTA */}
          <div className="article-footer">
            <div className="footer-text">
              <strong>Finished reading?</strong>
              Return to the library for your next piece.
            </div>
            <button className="finish-btn" onClick={() => navigate('/bibliotherapy')}>
              <BookOpen size={16} /> Return to Library
            </button>
          </div>

        </article>
      </main>
    </div>
  );
};

export default ReadArticle;