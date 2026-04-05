import { useState } from "react";
import {
  ArrowRight,
  Brain,
  Clock3,
  Heart,
  ScanHeart,
  Sparkles,
  Wind,
} from "lucide-react";
import TechniqueDetail from "./Techniquedetail";
import "./Techniques.css";

export const techniques = [
  {
    id: "cognitive-reframing",
    icon: <Brain size={20} strokeWidth={1.8} />,
    color: "#58745f",
    glow: "rgba(88, 116, 95, 0.08)",
    borderHover: "rgba(88, 116, 95, 0.28)",
    tag: "Mindset Shift",
    tagBg: "rgba(88, 116, 95, 0.12)",
    tagColor: "#58745f",
    title: "Cognitive Reframing",
    shortDesc:
      "Gently rework stressful interpretations so your mind moves from alarm toward perspective.",
    duration: "10-15 min",
    intensity: "Reflective",
    atmosphere: "Clearer thinking",
    steps: [
      {
        title: "Catch the thought",
        desc: "Notice the sentence that is tightening your body. Write it exactly as it sounds, without editing or correcting yourself.",
        icon: <Sparkles size={18} strokeWidth={1.8} />,
      },
      {
        title: "Challenge it",
        desc: "Ask what is factual, what is fear, and what you may be assuming. Let honesty matter more than panic.",
        icon: <Brain size={18} strokeWidth={1.8} />,
      },
      {
        title: "Find another angle",
        desc: "Name three alternate interpretations that feel more balanced, grounded, or generous toward yourself.",
        icon: <ArrowRight size={18} strokeWidth={1.8} />,
      },
      {
        title: "Rewrite the narrative",
        desc: "Create one calmer statement that still respects difficulty without turning it into catastrophe.",
        icon: <Heart size={18} strokeWidth={1.8} />,
      },
      {
        title: "Check your body",
        desc: "Pause and notice what shifted physically. Even a small drop in tension is evidence that your system is responding.",
        icon: <ScanHeart size={18} strokeWidth={1.8} />,
      },
    ],
    deepDive:
      "Cognitive reframing comes from Cognitive Behavioral Therapy and is one of the most evidence-backed tools for emotional regulation. The goal is not forced positivity. The goal is to help your brain see situations with more accuracy and less distortion.",
    benefits: [
      "Reduces anxiety spirals",
      "Builds emotional resilience",
      "Improves problem-solving clarity",
      "Breaks rumination cycles",
    ],
  },
  {
    id: "body-scan",
    icon: <Wind size={20} strokeWidth={1.8} />,
    color: "#7b927d",
    glow: "rgba(123, 146, 125, 0.1)",
    borderHover: "rgba(123, 146, 125, 0.28)",
    tag: "Body Awareness",
    tagBg: "rgba(123, 146, 125, 0.14)",
    tagColor: "#58745f",
    title: "Progressive Body Scan",
    shortDesc:
      "Travel through the body slowly to release held stress and rebuild a sense of internal safety.",
    duration: "12-20 min",
    intensity: "Calming",
    atmosphere: "Soft grounding",
    steps: [
      {
        title: "Ground yourself",
        desc: "Sit or lie down comfortably. Take three unhurried breaths and let the surface beneath you do some of the holding.",
        icon: <Wind size={18} strokeWidth={1.8} />,
      },
      {
        title: "Start at your feet",
        desc: "Bring attention to the feet and simply notice sensation, numbness, warmth, or stillness without trying to change it.",
        icon: <Sparkles size={18} strokeWidth={1.8} />,
      },
      {
        title: "Travel slowly upward",
        desc: "Move through the legs, hips, and torso one area at a time. Breathe into each place as if you are softening crowded muscles.",
        icon: <ArrowRight size={18} strokeWidth={1.8} />,
      },
      {
        title: "Scan your core and chest",
        desc: "Notice what emotion may be living in the belly or chest today. Allow awareness without suppression.",
        icon: <ScanHeart size={18} strokeWidth={1.8} />,
      },
      {
        title: "Finish at the crown",
        desc: "Move through shoulders, jaw, face, and scalp, then sense your whole body at once as one connected field.",
        icon: <Heart size={18} strokeWidth={1.8} />,
      },
    ],
    deepDive:
      "Body scan practice is rooted in Mindfulness-Based Stress Reduction. It helps you notice the physical imprint of stress before it becomes the only language your body knows.",
    benefits: [
      "Lowers cortisol levels",
      "Improves sleep quality",
      "Reduces chronic tension",
      "Deepens mind-body connection",
    ],
  },
  {
    id: "gratitude-affirmation",
    icon: <Heart size={20} strokeWidth={1.8} />,
    color: "#c4956a",
    glow: "rgba(196, 149, 106, 0.1)",
    borderHover: "rgba(196, 149, 106, 0.28)",
    tag: "Heart Opening",
    tagBg: "rgba(196, 149, 106, 0.12)",
    tagColor: "#a36d43",
    title: "Gratitude and Affirmations",
    shortDesc:
      "Shift attention toward what is steady, meaningful, and still good while strengthening your inner voice.",
    duration: "5-10 min",
    intensity: "Uplifting",
    atmosphere: "Warm renewal",
    steps: [
      {
        title: "Create the space",
        desc: "Choose a quiet moment. Put your phone down and let this feel like a small ritual rather than another task.",
        icon: <Sparkles size={18} strokeWidth={1.8} />,
      },
      {
        title: "Three genuine gratitudes",
        desc: "Write three specific things that feel true today. Precision helps gratitude land more deeply.",
        icon: <Heart size={18} strokeWidth={1.8} />,
      },
      {
        title: "Feel it, not just think it",
        desc: "Pause with each gratitude long enough for your body to register it, not just your thoughts.",
        icon: <ScanHeart size={18} strokeWidth={1.8} />,
      },
      {
        title: "Speak your affirmations",
        desc: "Choose affirmations that are compassionate and believable, especially for the struggle you are carrying right now.",
        icon: <Brain size={18} strokeWidth={1.8} />,
      },
      {
        title: "Seal it with intention",
        desc: "Name one quality you want to carry into the rest of the day and place it somewhere visible.",
        icon: <ArrowRight size={18} strokeWidth={1.8} />,
      },
    ],
    deepDive:
      "Gratitude and self-affirmation can help quiet negativity bias over time. They work best when they feel embodied and sincere rather than decorative.",
    benefits: [
      "Rewires negativity bias",
      "Increases positive momentum",
      "Strengthens self-worth",
      "Supports steadier mood recovery",
    ],
  },
];

export default function Techniques() {
  const [selected, setSelected] = useState(null);

  if (selected) {
    return <TechniqueDetail technique={selected} onBack={() => setSelected(null)} />;
  }

  return (
    <div className="tech-root">
      <div className="tech-header">
        <h2 className="er-section-title">Coping Techniques</h2>
        <p className="er-section-desc">
          A calm-first set of practices for slowing stress responses and finding a steadier inner rhythm.
        </p>
      </div>

      <div className="tech-grid">
        {techniques.map((tech, i) => (
          <button
            key={tech.id}
            className="tech-card er-card"
            style={{
              "--card-color": tech.color,
              "--card-glow": tech.glow,
              "--er-card-glow": `radial-gradient(ellipse at top left, ${tech.glow}, transparent 60%)`,
              "--er-card-border": tech.borderHover,
              animationDelay: `${i * 0.1}s`,
            }}
            onClick={() => setSelected(tech)}
          >
            <div className="tech-card-top">
              <div className="tech-card-icon" style={{ color: tech.color, background: tech.tagBg }}>
                {tech.icon}
              </div>
              <span className="er-tag" style={{ background: tech.tagBg, color: tech.tagColor }}>
                {tech.tag}
              </span>
            </div>

            <h3 className="tech-card-title">{tech.title}</h3>
            <p className="tech-card-desc">{tech.shortDesc}</p>

            <div className="tech-card-meta">
              <span className="tech-meta-item">
                <Clock3 size={13} strokeWidth={1.8} className="tech-meta-icon" />
                {tech.duration}
              </span>
              <span className="tech-meta-item">
                <Sparkles size={13} strokeWidth={1.8} className="tech-meta-icon" />
                {tech.intensity}
              </span>
            </div>

            <span className="er-tag" style={{ width: "fit-content", color: tech.color }}>
              {tech.atmosphere}
            </span>

            <div className="tech-card-cta">
              Begin practice <ArrowRight size={14} strokeWidth={2} />
            </div>

            <div className="tech-card-steps-preview">
              {tech.steps.map((_, si) => (
                <div key={si} className="tech-step-dot" style={{ background: tech.color }} />
              ))}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
