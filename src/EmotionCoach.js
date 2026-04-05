import { useState } from "react";
import { BrainCircuit, Leaf, LoaderCircle, Sparkles, Wind } from "lucide-react";

const starterPrompts = [
  "My mind is racing and I can't slow down.",
  "I feel emotionally heavy and tired.",
  "I am overwhelmed and need one small next step.",
  "I feel unsettled after a hard conversation.",
];

export default function EmotionCoach() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const runGuide = async (textOverride) => {
    const message = (textOverride ?? input).trim();
    if (!message) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/emotion-regulation/guide", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "Success") {
        throw new Error(data.msg || "Unable to get guidance right now.");
      }

      setResult(data.guide);
      setInput(message);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="er-ai-panel">
      <div className="er-ai-intro">
        <div>
          <p className="er-section-kicker">AI Support</p>
          <h3 className="er-ai-title">AI Regulation Guide</h3>
        </div>
        <div className="er-ai-badge">
          <BrainCircuit size={15} strokeWidth={1.9} />
         
        </div>
      </div>

      <p className="er-ai-desc">
        Describe what is happening right now and get one short reflection, one best-fit practice,
        and one grounding step to try next.
      </p>

      <div className="er-ai-prompts">
        {starterPrompts.map((prompt) => (
          <button key={prompt} className="er-ai-prompt" onClick={() => runGuide(prompt)}>
            {prompt}
          </button>
        ))}
      </div>

      <div className="er-ai-input-wrap">
        <textarea
          className="er-ai-input"
          rows={4}
          placeholder="Example: I feel restless, mentally noisy, and I cannot focus on anything."
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="er-primary-action er-ai-action" onClick={() => runGuide()} disabled={loading}>
          {loading ? <LoaderCircle size={15} strokeWidth={2} className="er-spin" /> : <Sparkles size={15} strokeWidth={2} />}
          {loading ? "Thinking..." : "Get guidance"}
        </button>
      </div>

      {error && <p className="er-ai-error">{error}</p>}

      {result && (
        <div className="er-ai-results">
          <article className="er-ai-card">
            <span className="er-ai-card-icon">
              <Leaf size={15} strokeWidth={1.9} />
            </span>
            <div>
              <p className="er-ai-card-label">Reflection</p>
              <p className="er-ai-card-text">{result.reflection}</p>
            </div>
          </article>

          <article className="er-ai-card">
            <span className="er-ai-card-icon">
              <Wind size={15} strokeWidth={1.9} />
            </span>
            <div>
              <p className="er-ai-card-label">Recommended Path</p>
              <p className="er-ai-card-text">{result.recommendedPractice}</p>
            </div>
          </article>

          <article className="er-ai-card">
            <span className="er-ai-card-icon">
              <Sparkles size={15} strokeWidth={1.9} />
            </span>
            <div>
              <p className="er-ai-card-label">Try This Next</p>
              <p className="er-ai-card-text">{result.nextStep}</p>
            </div>
          </article>
        </div>
      )}
    </section>
  );
}
