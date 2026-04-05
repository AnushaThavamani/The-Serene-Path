import { useState } from "react";
import { ChevronDown, Clock3, Heart, Leaf, Sparkles, SunMedium } from "lucide-react";
import "./Positivitybuilder.css";

const affirmationSets = [
  {
    theme: "Self-Worth",
    color: "#d98ba6",
    icon: <Heart size={16} strokeWidth={1.9} />,
    affirmations: [
      "I am worthy of love and belonging exactly as I am right now.",
      "My value does not decrease based on someone else's inability to see my worth.",
      "I am becoming a more authentic version of myself every day.",
      "I deserve kindness, especially from myself.",
      "My feelings are valid, even when others do not understand them.",
    ],
  },
  {
    theme: "Resilience",
    color: "#6b8f71",
    icon: <Leaf size={16} strokeWidth={1.9} />,
    affirmations: [
      "I have overcome hard things before, and I will overcome this too.",
      "Difficulty is not a sign that I am doing it wrong. It is part of doing it at all.",
      "I am allowed to be both a work in progress and deeply worthy.",
      "My setbacks are not my whole story.",
      "Every challenge I face is quietly building strength I have not met yet.",
    ],
  },
  {
    theme: "Peace",
    color: "#7795b3",
    icon: <SunMedium size={16} strokeWidth={1.9} />,
    affirmations: [
      "I release the need to control what is beyond my reach.",
      "This moment is enough for now.",
      "I am allowed to rest without earning it first.",
      "Not everything needs to be fixed today.",
      "I choose peace over urgency.",
    ],
  },
  {
    theme: "Growth",
    color: "#c4956a",
    icon: <Sparkles size={16} strokeWidth={1.9} />,
    affirmations: [
      "I am not behind. I am on a path that is still unfolding.",
      "Small consistent steps create lasting change.",
      "My past does not determine my capacity to grow.",
      "Learning to be kind to myself is meaningful work.",
      "Progress is not always visible, but it is still happening.",
    ],
  },
];

const challenges = [
  {
    id: 1,
    title: "The 3 Bright Spots",
    desc: "Write down three small things that went well today, no matter how ordinary they seem.",
    duration: "5 min",
    color: "#c4956a",
    icon: <Sparkles size={16} strokeWidth={1.9} />,
  },
  {
    id: 2,
    title: "Write a Letter to Past You",
    desc: "Write three sentences to the version of you from two years ago about what you have learned or survived.",
    duration: "8 min",
    color: "#7795b3",
    icon: <Heart size={16} strokeWidth={1.9} />,
  },
  {
    id: 3,
    title: "The Already-Have List",
    desc: "List five things you already have that once felt far away or deeply hoped for.",
    duration: "4 min",
    color: "#6b8f71",
    icon: <Leaf size={16} strokeWidth={1.9} />,
  },
  {
    id: 4,
    title: "One Compassionate Act",
    desc: "Offer one deliberate act of kindness today, either to yourself or someone else, and write it down afterward.",
    duration: "Variable",
    color: "#d98ba6",
    icon: <Heart size={16} strokeWidth={1.9} />,
  },
  {
    id: 5,
    title: "The Reframe Challenge",
    desc: "Choose one frustration and look for one realistic lesson, opening, or softer interpretation inside it.",
    duration: "6 min",
    color: "#c4956a",
    icon: <SunMedium size={16} strokeWidth={1.9} />,
  },
  {
    id: 6,
    title: "Unsent Gratitude",
    desc: "Write three grateful sentences to someone who has shaped you, even if you never send them.",
    duration: "5 min",
    color: "#7795b3",
    icon: <Sparkles size={16} strokeWidth={1.9} />,
  },
];

function getDailyIndices(seed) {
  const hash = (seed * 2654435761) >>> 0;
  const affIdx = Math.abs(hash) % affirmationSets.length;
  const setIdx = Math.abs((hash >>> 4) * 1234567) % affirmationSets[affIdx].affirmations.length;
  const chalIdx = Math.abs((hash >>> 8) * 7654321) % challenges.length;
  return { affIdx, setIdx, chalIdx };
}

export default function PositivityBuilder() {
  const today = new Date();
  const dayNumber = Math.floor(today.getTime() / 86400000);
  const { affIdx, setIdx, chalIdx } = getDailyIndices(dayNumber);

  const set = affirmationSets[affIdx];
  const dailyAffirmation = set.affirmations[setIdx];
  const dailyChallenge = challenges[chalIdx];

  const [affirmed, setAffirmed] = useState(false);
  const [challengeDone, setChallengeDone] = useState(false);
  const [expandAffirmations, setExpandAffirmations] = useState(false);
  const [activeTheme, setActiveTheme] = useState(affIdx);
  const [reflectionText, setReflectionText] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState(false);

  const saveReflection = () => {
    if (!reflectionText.trim()) return;
    setReflectionSaved(true);
    setChallengeDone(true);
  };

  const todayStr = today.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="pb-root">
      <div className="pb-header">
        <h2 className="er-section-title">Positivity Builder</h2>
        <p className="er-section-desc">
          One affirmation and one gentle challenge for a softer, steadier day.
        </p>
      </div>

      <div className="pb-date-badge">
        <SunMedium size={14} strokeWidth={1.9} />
        <span>{todayStr}</span>
      </div>

      <div className="pb-section">
        <div className="pb-section-label">
          <span>Today's Affirmation</span>
          <span className="er-tag" style={{ background: `${set.color}18`, color: set.color }}>
            {set.icon} {set.theme}
          </span>
        </div>

        <div
          className={`pb-affirmation-card ${affirmed ? "pb-affirmed" : ""}`}
          style={{ "--pb-color": set.color, "--pb-glow": `${set.color}15` }}
        >
          <div className="pb-affirmation-bg" />
          <div className="pb-affirmation-icon">{set.icon}</div>
          <blockquote className="pb-affirmation-text">{dailyAffirmation}</blockquote>
          {!affirmed ? (
            <button
              className="er-btn er-btn-primary pb-affirm-btn"
              style={{ background: `linear-gradient(135deg, ${set.color}, ${set.color}bb)` }}
              onClick={() => setAffirmed(true)}
            >
              Hold this today
            </button>
          ) : (
            <div className="pb-affirmed-msg">
              <span style={{ color: set.color }}>
                <Sparkles size={14} strokeWidth={2} />
              </span>
              Held with intention today
            </div>
          )}
        </div>
      </div>

      <div className="pb-section">
        <button className="pb-browse-toggle" onClick={() => setExpandAffirmations(!expandAffirmations)}>
          <span>Browse All Affirmations</span>
          <span className={`pb-toggle-arrow ${expandAffirmations ? "pb-toggle-arrow--open" : ""}`}>
            <ChevronDown size={16} strokeWidth={2} />
          </span>
        </button>

        {expandAffirmations && (
          <div className="pb-all-affirmations">
            <div className="pb-themes">
              {affirmationSets.map((s, i) => (
                <button
                  key={s.theme}
                  className={`pb-theme-btn ${activeTheme === i ? "pb-theme-btn--active" : ""}`}
                  style={{ "--pb-color": s.color }}
                  onClick={() => setActiveTheme(i)}
                >
                  {s.icon} {s.theme}
                </button>
              ))}
            </div>
            <div className="pb-affirmation-list">
              {affirmationSets[activeTheme].affirmations.map((aff, i) => (
                <div key={i} className="pb-aff-item" style={{ "--pb-color": affirmationSets[activeTheme].color }}>
                  <span className="pb-aff-num">{i + 1}</span>
                  <p className="pb-aff-text">{aff}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="pb-section">
        <div className="pb-section-label">
          <span>Today's Challenge</span>
          <span className="pb-duration-tag">
            <Clock3 size={13} strokeWidth={1.9} /> {dailyChallenge.duration}
          </span>
        </div>

        <div
          className="pb-challenge-card"
          style={{ "--pb-color": dailyChallenge.color, "--pb-glow": `${dailyChallenge.color}12` }}
        >
          <div className="pb-challenge-bg" />
          <div className="pb-challenge-top">
            <div
              className="pb-challenge-icon"
              style={{ color: dailyChallenge.color, background: `${dailyChallenge.color}18` }}
            >
              {dailyChallenge.icon}
            </div>
            <h3 className="pb-challenge-title">{dailyChallenge.title}</h3>
          </div>
          <p className="pb-challenge-desc">{dailyChallenge.desc}</p>

          {!challengeDone && (
            <div className="pb-reflection">
              <textarea
                className="pb-reflection-input"
                placeholder="Write your response here... (optional)"
                value={reflectionText}
                onChange={(e) => setReflectionText(e.target.value)}
                rows={3}
              />
              <div className="pb-challenge-actions">
                <button
                  className="er-btn er-btn-primary"
                  style={{ background: `linear-gradient(135deg, ${dailyChallenge.color}, ${dailyChallenge.color}bb)` }}
                  onClick={saveReflection}
                >
                  Save reflection
                </button>
              </div>
            </div>
          )}

          {challengeDone && (
            <div className="pb-challenge-done">
              <span style={{ color: dailyChallenge.color }}>
                <Sparkles size={14} strokeWidth={2} />
              </span>
              {reflectionSaved && reflectionText.trim() ? (
                <span>Reflection saved. That is real inner work.</span>
              ) : (
                <span>Challenge complete. Well done.</span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="pb-section">
        <div className="pb-section-label">
          <span>More Challenges</span>
        </div>
        <div className="pb-challenges-grid">
          {challenges
            .filter((c) => c.id !== dailyChallenge.id)
            .map((ch) => (
              <div key={ch.id} className="pb-mini-challenge" style={{ "--pb-color": ch.color }}>
                <div className="pb-mini-icon" style={{ color: ch.color, background: `${ch.color}15` }}>
                  {ch.icon}
                </div>
                <div>
                  <div className="pb-mini-title">{ch.title}</div>
                  <div className="pb-mini-dur">
                    <Clock3 size={12} strokeWidth={1.9} /> {ch.duration}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
