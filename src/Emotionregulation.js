import { useMemo, useState } from "react";
import {
  BrainCircuit,
  Compass,
  Flower2,
  Leaf,
  Play,
  Sparkles,
  SunMedium,
  Wind,
} from "lucide-react";
import Techniques from "./Techniques";
import Quizzes from "./Quizzes";
import PositivityBuilder from "./Positivitybuilder";
import EmotionCoach from "./EmotionCoach";
import "./Emotionregulation.css";

const tabs = [
  {
    id: "techniques",
    label: "Techniques",
    sub: "Grounding practices",
    icon: Wind,
    title: "Regulate your state with breath, body, and stillness.",
    blurb: "3 guided calming rituals",
    image:
      "https://images.unsplash.com/photo-1508672019048-805c876b67e2?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "quizzes",
    label: "Self Discovery",
    sub: "Reflective insights",
    icon: BrainCircuit,
    title: "Understand your emotional patterns without leaving the serene mood.",
    blurb: "4 short insight paths",
    image:
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1600&auto=format&fit=crop",
  },
  {
    id: "positivity",
    label: "Positivity",
    sub: "Daily renewal",
    icon: SunMedium,
    title: "Build softness, hope, and emotional warmth through small daily rituals.",
    blurb: "Affirmations and gentle challenges",
    image:
      "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=1600&auto=format&fit=crop",
  },
];

const quickResets = [
  { title: "60-second reset", text: "Unclench jaw, drop shoulders, exhale longer than you inhale." },
  { title: "If emotions feel loud", text: "Choose Techniques for body regulation before trying to think clearly." },
  { title: "If you need clarity", text: "Use Self Discovery when you want insight into your patterns." },
];

export default function EmotionRegulation() {
  const [activeTab, setActiveTab] = useState("techniques");
  const activePane = useMemo(
    () => tabs.find((tab) => tab.id === activeTab) ?? tabs[0],
    [activeTab]
  );

  const ActiveIcon = activePane.icon;

  return (
    <div
      className="er-root"
      style={{ "--er-active-image": `url(${activePane.image})` }}
    >
      <div className="er-ambient er-ambient-one" />
      <div className="er-ambient er-ambient-two" />

      <header className="er-header">
        <div className="er-header-inner">
          <div className="er-brand">
            <span className="er-brand-icon">
              <Flower2 size={19} strokeWidth={1.8} />
            </span>
            <div>
              <p className="er-kicker">Emotion Regulation</p>
              <h1 className="er-title">Inner Space</h1>
            </div>
          </div>

          <div className="er-header-badge">
            <Leaf size={15} strokeWidth={1.9} />
            <span>Serene nature theme</span>
          </div>
        </div>
      </header>

      <main className="er-main">
        <section className="er-hero">
          <div className="er-hero-backdrop" />
          <div className="er-hero-overlay" />

          <div className="er-hero-content">
            <div className="er-hero-copy">
              <span className="er-hero-tag">
                <Sparkles size={13} strokeWidth={2} />
                Nature-led calm
              </span>
              <h2 className="er-hero-heading">A captivating serene space for emotional reset.</h2>
              <p className="er-hero-text">
                Less dashboard. More retreat. Choose a path and move straight into the experience.
              </p>

              <div className="er-hero-actions">
                <button className="er-primary-action" onClick={() => setActiveTab("techniques")}>
                  <Play size={15} strokeWidth={2} />
                  Begin calming
                </button>
                <div className="er-hero-meta">
                  <span>Modern nature visuals</span>
                  <span>Content-first layout</span>
                </div>
              </div>
            </div>

            <div className="er-hero-rail">
              {tabs.map((tab) => {
                const TabIcon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    className={`er-rail-card ${activeTab === tab.id ? "er-rail-card--active" : ""}`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    <div className="er-rail-thumb" style={{ backgroundImage: `url(${tab.image})` }} />
                    <div className="er-rail-copy">
                      <span className="er-rail-icon"><TabIcon size={15} strokeWidth={1.9} /></span>
                      <strong>{tab.label}</strong>
                      <span>{tab.blurb}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="er-focus-strip">
          <div className="er-focus-card">
            <span className="er-focus-icon"><ActiveIcon size={16} strokeWidth={1.9} /></span>
            <div>
              <p className="er-focus-label">In focus</p>
              <h3>{activePane.label}</h3>
            </div>
          </div>
          <p className="er-focus-text">{activePane.title}</p>
          <span className="er-focus-chip">{activePane.sub}</span>
        </section>

        <section className="er-quick-strip">
          {quickResets.map((item) => (
            <article key={item.title} className="er-quick-card">
              <p className="er-quick-title">{item.title}</p>
              <p className="er-quick-text">{item.text}</p>
            </article>
          ))}
        </section>

        <EmotionCoach />

        <section className="er-content-shell">
          <div className="er-content-head">
            <div>
              <p className="er-section-kicker">Curated experience</p>
              <h3 className="er-section-title">{activePane.label}</h3>
            </div>
            <div className="er-content-badge">
              <Compass size={15} strokeWidth={1.9} />
              <span>{activePane.blurb}</span>
            </div>
          </div>

          <div className="er-content" key={activeTab}>
            {activeTab === "techniques" && <Techniques />}
            {activeTab === "quizzes" && <Quizzes />}
            {activeTab === "positivity" && <PositivityBuilder />}
          </div>
        </section>
      </main>
    </div>
  );
}
