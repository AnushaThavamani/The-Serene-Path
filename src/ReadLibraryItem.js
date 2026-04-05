import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Leaf } from 'lucide-react';
import { libraryData } from './biblioData';
import './ReadLibraryItem.css';

const ReadLibraryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const articleRef = useRef(null);
  const [readProgress, setReadProgress] = useState(0);

  const article = useMemo(
    () => libraryData.find((item) => item.id === Number.parseInt(id, 10)),
    [id]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const element = articleRef.current;
      if (!element) return;
      const { top, height } = element.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const scrolled = Math.max(0, windowHeight - top);
      const total = height + windowHeight;
      const progress = Math.min(100, Math.round((scrolled / total) * 100));
      setReadProgress(progress);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!article) {
    return (
      <div className="read2-page read2-error">
        <BookOpen size={40} strokeWidth={1.2} />
        <h2>Library item not found</h2>
        <p>This piece may have been moved or is no longer available in the library.</p>
        <button className="read2-primary-btn" onClick={() => navigate('/bibliotherapy')}>
          <ArrowLeft size={16} /> Return to Library
        </button>
      </div>
    );
  }

  const articleTypeClass = `read2-page read2-page-${article.type.toLowerCase()}`;

  return (
    <div className={articleTypeClass}>
      <div className="read2-progress" style={{ width: `${readProgress}%` }} />
      <div className="read2-ambient read2-ambient-one" />
      <div className="read2-ambient read2-ambient-two" />

      <header className="read2-header">
        <button className="read2-back" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} /> Back to Library
        </button>
        <div className="read2-header-meta">
          <span>{article.type}{article.genre ? ` / ${article.genre}` : ""}</span>
          <span><Clock size={13} /> {article.readTime}</span>
        </div>
      </header>

      <main className="read2-main" ref={articleRef}>
        <article className="read2-article">
          <section className="read2-hero">
            <div className="read2-hero-image">
              <img src={article.image} alt={article.title} />
              <div className="read2-hero-overlay" />
            </div>
            <div className="read2-kicker">
              <Leaf size={13} /> {article.collection}
            </div>
            <h1>{article.title}</h1>
            {article.subtitle && <h2>{article.subtitle}</h2>}
            <div className="read2-meta-grid">
              <span>{article.author}</span>
              <span>{article.publishedOn}</span>
              <span>{article.level}</span>
            </div>
            <p className="read2-excerpt">{article.excerpt}</p>
            <div className="read2-mood-row">
              {(article.moodSupport || []).map((mood) => (
                <span key={mood} className="read2-mood-chip">{mood}</span>
              ))}
            </div>
          </section>

          <section className="read2-body-wrap">
            <div className="read2-intro-card">
              <span className="read2-intro-label">{article.type}</span>
              <p>
                A calm reading space from The Serene Path, designed to keep the visual warmth of the
                library while letting the writing stay central.
              </p>
            </div>
            <div
              className="read2-body"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </section>

          <section className="read2-footer">
            <div>
              <strong>Continue your reading journey</strong>
              <p>Return to the library and choose another piece that meets this moment well.</p>
            </div>
            <button className="read2-primary-btn" onClick={() => navigate('/bibliotherapy')}>
              <BookOpen size={16} /> Back to Library
            </button>
          </section>
        </article>
      </main>
    </div>
  );
};

export default ReadLibraryItem;





