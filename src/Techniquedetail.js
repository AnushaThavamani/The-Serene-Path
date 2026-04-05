import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Clock3, FlaskConical, Sparkles } from "lucide-react";
import "./Techniquedetail.css";

export default function TechniqueDetail({ technique: t, onBack }) {
  const [activeStep, setActiveStep] = useState(0);
  const [completed, setCompleted] = useState([]);
  const [showComplete, setShowComplete] = useState(false);
  const [animating, setAnimating] = useState(false);

  const goToStep = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActiveStep(idx);
      setAnimating(false);
    }, 200);
  };

  const markComplete = () => {
    if (!completed.includes(activeStep)) {
      setCompleted([...completed, activeStep]);
    }
    if (activeStep < t.steps.length - 1) {
      goToStep(activeStep + 1);
    } else {
      setShowComplete(true);
    }
  };

  const restart = () => {
    setActiveStep(0);
    setCompleted([]);
    setShowComplete(false);
  };

  useEffect(() => {
    setActiveStep(0);
    setCompleted([]);
    setShowComplete(false);
  }, [t.id]);

  const step = t.steps[activeStep];
  const progress = (completed.length / t.steps.length) * 100;

  return (
    <div className="td-root">
      <button className="td-back" onClick={onBack}>
        <ArrowLeft size={14} strokeWidth={2} /> All techniques
      </button>

      <div className="td-hero" style={{ "--td-color": t.color, "--td-glow": t.glow }}>
        <div className="td-hero-bg" />
        <div className="td-hero-icon">{t.icon}</div>
        <div className="td-hero-text">
          <span className="er-tag" style={{ background: t.tagBg, color: t.tagColor }}>
            {t.tag}
          </span>
          <h2 className="td-hero-title">{t.title}</h2>
          <p className="td-hero-desc">{t.shortDesc}</p>
          <div className="td-hero-meta">
            <span>
              <Clock3 size={13} strokeWidth={1.8} /> {t.duration}
            </span>
            <span>
              <Sparkles size={13} strokeWidth={1.8} /> {t.intensity}
            </span>
            <span>
              <Check size={13} strokeWidth={1.8} /> {t.steps.length} steps
            </span>
          </div>
        </div>
      </div>

      <div className="td-benefits">
        {t.benefits.map((b, i) => (
          <div key={i} className="td-benefit" style={{ "--td-color": t.color }}>
            <span className="td-benefit-dot" style={{ background: t.color }} />
            {b}
          </div>
        ))}
      </div>

      <div className="td-progress-wrap">
        <div className="td-progress-label">
          <span>Practice Progress</span>
          <span style={{ color: t.color }}>
            {completed.length}/{t.steps.length} steps
          </span>
        </div>
        <div className="td-progress-track">
          <div
            className="td-progress-fill"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${t.color}, ${t.color}cc)`,
            }}
          />
        </div>
      </div>

      <div className="td-steps-nav">
        {t.steps.map((s, i) => (
          <button
            key={i}
            className={`td-step-btn ${i === activeStep ? "td-step-btn--active" : ""} ${
              completed.includes(i) ? "td-step-btn--done" : ""
            }`}
            style={{ "--td-color": t.color }}
            onClick={() => goToStep(i)}
          >
            <span className="td-step-num">{completed.includes(i) ? <Check size={14} strokeWidth={2.4} /> : i + 1}</span>
            <span className="td-step-name">{s.title}</span>
          </button>
        ))}
      </div>

      {!showComplete && (
        <div
          className={`td-step-panel ${animating ? "td-step-panel--exit" : "td-step-panel--enter"}`}
          style={{
            "--td-color": t.color,
            "--td-glow": t.glow,
            borderColor: completed.includes(activeStep) ? t.color : undefined,
          }}
        >
          <div className="td-step-header">
            <div className="td-step-icon" style={{ color: t.color, background: t.tagBg }}>
              {step.icon}
            </div>
            <div>
              <p className="td-step-counter">
                Step {activeStep + 1} of {t.steps.length}
              </p>
              <h3 className="td-step-title">{step.title}</h3>
            </div>
          </div>
          <p className="td-step-desc">{step.desc}</p>

          <div className="td-step-actions">
            {activeStep > 0 && (
              <button className="er-btn er-btn-ghost" onClick={() => goToStep(activeStep - 1)}>
                <ArrowLeft size={14} strokeWidth={2} /> Previous
              </button>
            )}
            <button
              className="er-btn er-btn-primary"
              style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}bb)` }}
              onClick={markComplete}
            >
              {activeStep === t.steps.length - 1 ? "Complete practice" : "Done and next"}
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </div>
      )}

      {showComplete && (
        <div className="td-complete">
          <div className="td-complete-icon" style={{ color: t.color }}>
            <Sparkles size={42} strokeWidth={1.8} />
          </div>
          <h3 className="td-complete-title">Practice Complete</h3>
          <p className="td-complete-msg">
            You moved through all {t.steps.length} steps. Small, repeated moments of regulation can create real change over time.
          </p>
          <div className="td-complete-actions">
            <button className="er-btn er-btn-ghost" onClick={restart}>
              Practice Again
            </button>
            <button className="er-btn er-btn-ghost" onClick={onBack}>
              <ArrowLeft size={14} strokeWidth={2} /> Back to techniques
            </button>
          </div>
        </div>
      )}

      <div className="td-deepdive" style={{ "--td-color": t.color, "--td-glow": t.glow }}>
        <div className="td-deepdive-label">
          <FlaskConical size={13} strokeWidth={2} /> The Science Behind It
        </div>
        <p className="td-deepdive-text">{t.deepDive}</p>
      </div>
    </div>
  );
}
