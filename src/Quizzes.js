import { useState } from "react";
import "./Quizzes.css";

const quizzes = [
  {
    id: "emotion-style",
    icon: "◎",
   color: "#3a4f41", glow: "rgba(58, 79, 65, 0.05)",
    title: "Your Emotion Style",
    desc: "Discover how you typically experience and process emotions — are you a feeler, thinker, or avoider?",
    duration: "3 min",
    questions: [
      {
        q: "When something upsets you, your first instinct is to...",
        options: [
          { text: "Feel it intensely in your body", value: "feeler" },
          { text: "Analyze what went wrong", value: "thinker" },
          { text: "Distract yourself or stay busy", value: "avoider" },
          { text: "Talk to someone about it", value: "expresser" }
        ]
      },
      {
        q: "How long do difficult emotions typically stay with you?",
        options: [
          { text: "Hours to days — I feel deeply", value: "feeler" },
          { text: "I process quickly through thinking", value: "thinker" },
          { text: "I try not to let them linger", value: "avoider" },
          { text: "Depends — I need to express them to release them", value: "expresser" }
        ]
      },
      {
        q: "When a friend is upset, you tend to...",
        options: [
          { text: "Feel their pain alongside them", value: "feeler" },
          { text: "Help them see the situation clearly", value: "thinker" },
          { text: "Try to cheer them up or change the subject", value: "avoider" },
          { text: "Encourage them to talk it all out", value: "expresser" }
        ]
      },
      {
        q: "Your relationship with crying is...",
        options: [
          { text: "I cry often — it feels like a release", value: "feeler" },
          { text: "Rarely — I process more internally", value: "thinker" },
          { text: "I hold back — it feels vulnerable", value: "avoider" },
          { text: "Only with people I really trust", value: "expresser" }
        ]
      }
    ],
    results: {
      feeler: {
        type: "The Deep Feeler",
        desc: "You experience emotions with intensity and depth. You're highly empathetic and emotionally intelligent — but can sometimes get swept away. Your strength is authenticity. Your growth edge: learning to ride the emotional wave without drowning in it.",
        tip: "Practices like the body scan and journaling will resonate most with you."
      },
      thinker: {
        type: "The Emotional Analyst",
        desc: "You process feelings through your mind. You're calm under pressure and great at problem-solving, but may sometimes intellectualize rather than actually feel. Your strength is clarity. Your growth edge: letting yourself feel before jumping to solutions.",
        tip: "Cognitive reframing will feel natural — but try adding gratitude practices to open the heart side."
      },
      avoider: {
        type: "The Emotional Protector",
        desc: "You manage difficult emotions by keeping busy or creating distance. This serves a purpose — you're often the stable one. But unexpressed emotions compound. Your strength is resilience. Your growth edge: creating small, safe spaces to feel.",
        tip: "Start small — try 2 minutes of body scan daily to build tolerance for sitting with feelings."
      },
      expresser: {
        type: "The Relational Processor",
        desc: "You understand your emotions most clearly through connection and conversation. You're warm, open, and build deep relationships. Your strength is vulnerability. Your growth edge: developing an inner processing practice so you don't always need external validation.",
        tip: "Journaling and affirmation practices can help you build that inner voice."
      }
    }
  },
  {
    id: "stress-triggers",
    icon: "◇",
    color: "#c3b299", glow: "rgba(195, 178, 153, 0.1)",
    title: "Stress Trigger Awareness",
    desc: "Pinpoint what specifically drives your stress — environment, relationships, or internal pressure.",
    duration: "4 min",
    questions: [
      {
        q: "Which scenario stresses you out most?",
        options: [
          { text: "Too many tasks with no clear priority", value: "overwhelm" },
          { text: "Conflict or tension with someone", value: "relational" },
          { text: "Feeling like I'm not good enough", value: "internal" },
          { text: "Unpredictability or lack of control", value: "uncertainty" }
        ]
      },
      {
        q: "When you're stressed, your body usually...",
        options: [
          { text: "Gets tight shoulders or jaw", value: "overwhelm" },
          { text: "Heart races or stomach churns", value: "relational" },
          { text: "Feels heavy or exhausted", value: "internal" },
          { text: "Gets restless — hard to sit still", value: "uncertainty" }
        ]
      },
      {
        q: "What thought is most common during stress?",
        options: [
          { text: "'I have too much to do'", value: "overwhelm" },
          { text: "'They're upset with me / I did something wrong'", value: "relational" },
          { text: "'I'm not doing this right / I'm failing'", value: "internal" },
          { text: "'I don't know what's going to happen'", value: "uncertainty" }
        ]
      },
      {
        q: "After a stressful day, you most need...",
        options: [
          { text: "To cross things off a list and feel in control", value: "overwhelm" },
          { text: "To reconnect with someone and feel okay", value: "relational" },
          { text: "Quiet time alone to restore yourself", value: "internal" },
          { text: "A clear plan for what's coming next", value: "uncertainty" }
        ]
      }
    ],
    results: {
      overwhelm: {
        type: "Capacity Overloader",
        desc: "Your stress peaks when demands exceed your perceived capacity. You're likely high-achieving and responsible — which means you take on a lot. The antidote isn't doing less, it's building better systems for prioritization and self-permission to rest.",
        tip: "Practice cognitive reframing around what 'enough' looks like for you today."
      },
      relational: {
        type: "Relational Reactor",
        desc: "Social tension and disconnection are your main stress drivers. You care deeply about how others feel and about maintaining harmony. This is a gift, but it can lead to people-pleasing. Your work is separating others' emotions from your own worth.",
        tip: "Affirmations that reinforce your independent value (not conditional on approval) will be powerful."
      },
      internal: {
        type: "Inner Critic Driven",
        desc: "Your biggest stressor lives inside you — a demanding inner voice that measures and judges. You likely have high standards and a deep desire to do things well. The goal isn't to silence the critic, but to turn it from enemy to wise coach.",
        tip: "Cognitive reframing and compassionate journaling are your most important tools."
      },
      uncertainty: {
        type: "Control Seeker",
        desc: "Ambiguity and unpredictability are your nervous system's kryptonite. You function best with structure and clarity. This isn't weakness — it's just how your brain wires safety. The practice is building tolerance for 'not knowing.'",
        tip: "Body scan helps you ground in the present when your mind races toward unknown futures."
      }
    }
  },
  {
    id: "attachment",
    icon: "△",
    color: "#d4a373", glow: "rgba(212, 163, 115, 0.05)",
    title: "Attachment & Relationship Patterns",
    desc: "Understand how your early experiences shape how you connect — and protect yourself — in relationships.",
    duration: "4 min",
    questions: [
      {
        q: "When someone you care about doesn't respond quickly, you tend to...",
        options: [
          { text: "Feel slightly anxious and check again", value: "anxious" },
          { text: "Assume they're busy — it doesn't bother me much", value: "secure" },
          { text: "Pull back and act more distant when they do respond", value: "avoidant" },
          { text: "Feel confused — sometimes fine, sometimes spiraling", value: "disorganized" }
        ]
      },
      {
        q: "In close relationships, your deepest fear is...",
        options: [
          { text: "Being abandoned or left", value: "anxious" },
          { text: "Losing myself or my independence", value: "avoidant" },
          { text: "Not really having one — relationships feel mostly safe", value: "secure" },
          { text: "Both abandonment AND losing myself — it's conflicting", value: "disorganized" }
        ]
      },
      {
        q: "After an argument with someone close, you usually...",
        options: [
          { text: "Need to resolve it right away — can't rest until it's okay", value: "anxious" },
          { text: "Need space, then come back when I've processed", value: "avoidant" },
          { text: "Talk it through relatively calmly when ready", value: "secure" },
          { text: "Alternate between wanting to fix it and pulling away", value: "disorganized" }
        ]
      },
      {
        q: "Emotional intimacy makes you feel...",
        options: [
          { text: "Nourished — the closer, the better", value: "anxious" },
          { text: "Comfortable when it builds gradually", value: "secure" },
          { text: "Slightly uncomfortable — I value independence", value: "avoidant" },
          { text: "Both drawn in and scared at the same time", value: "disorganized" }
        ]
      }
    ],
    results: {
      anxious: {
        type: "Anxious Attachment",
        desc: "You love deeply and care intensely — but often worry that love won't last or be reciprocated equally. This stems from early experiences where love felt inconsistent. You're not 'too much' — your nervous system learned to stay alert to protect yourself. The work is self-soothing and building inner security.",
        tip: "Daily affirmations of self-worth (independent of relationship status) and cognitive reframing of 'worst case' relationship thoughts will help."
      },
      secure: {
        type: "Secure Attachment",
        desc: "You have a generally healthy relationship with closeness and independence. You can tolerate both intimacy and distance without panic. This is a genuine asset. Your growth edge is continuing to deepen self-awareness so you can be a secure base for others too.",
        tip: "Focus on techniques that deepen emotional intelligence — body scan and reflective journaling."
      },
      avoidant: {
        type: "Avoidant Attachment",
        desc: "You prize self-sufficiency and can feel smothered by too much closeness. This developed as a smart adaptation — you learned that needing others wasn't always safe. You're not cold, you're careful. The work is slowly expanding your window of tolerance for vulnerability.",
        tip: "Gratitude practices focused on relationships can gently rewire the association between closeness and threat."
      },
      disorganized: {
        type: "Disorganized / Fearful",
        desc: "You simultaneously long for and fear deep connection — which can feel exhausting and confusing. This pattern often comes from experiences where the source of comfort was also a source of fear. This is not permanent. With consistent self-care and possibly therapy, this pattern can shift meaningfully.",
        tip: "Body scan and grounding techniques help regulate the nervous system that underlies this push-pull pattern."
      }
    }
  },
  {
    id: "resilience",
    icon: "✦",
    color: "#8a9a86", glow: "rgba(138, 154, 134, 0.05)",
    title: "Resilience & Coping Style",
    desc: "Find out how you bounce back from adversity and where your resilience can grow stronger.",
    duration: "3 min",
    questions: [
      {
        q: "When life knocks you down, your first response is usually...",
        options: [
          { text: "Take action immediately — solve the problem", value: "active" },
          { text: "Withdraw and process internally first", value: "reflective" },
          { text: "Lean on others for support and perspective", value: "relational" },
          { text: "Try to find meaning in what happened", value: "meaning" }
        ]
      },
      {
        q: "How do you relate to past difficult experiences?",
        options: [
          { text: "They made me stronger — I've grown from them", value: "meaning" },
          { text: "I've moved past them but they still sting sometimes", value: "active" },
          { text: "I still process them — slowly but surely", value: "reflective" },
          { text: "My people helped me through them", value: "relational" }
        ]
      },
      {
        q: "Your 'recovery mode' after a hard week looks like...",
        options: [
          { text: "Physical activity, projects, or getting things done", value: "active" },
          { text: "Quiet — reading, nature, solitude", value: "reflective" },
          { text: "Social time with people who fill me up", value: "relational" },
          { text: "Journaling, thinking, making sense of things", value: "meaning" }
        ]
      },
      {
        q: "What helps most when you feel hopeless?",
        options: [
          { text: "Remembering times I've overcome difficulty before", value: "meaning" },
          { text: "Breaking the situation into small manageable actions", value: "active" },
          { text: "Being heard and validated by someone who cares", value: "relational" },
          { text: "Giving myself permission to rest and not rush", value: "reflective" }
        ]
      }
    ],
    results: {
      active: {
        type: "Action-Oriented Resilient",
        desc: "You rebuild through doing. Movement, productivity, and problem-solving are how your nervous system regulates. This is genuine strength — but watch for bypassing emotional processing through busyness. True resilience includes feeling, not just fixing.",
        tip: "Add a brief reflective practice (body scan or journaling) after solving a problem to complete the emotional cycle."
      },
      reflective: {
        type: "Reflective Resilient",
        desc: "You heal through understanding. Solitude, introspection, and making sense of events are how you restore. You're often wiser than you appear because you process deeply. Watch for over-rumination — sometimes understanding is less important than simply moving forward.",
        tip: "Cognitive reframing can help you shift from circular rumination to productive reflection."
      },
      relational: {
        type: "Relationally Resilient",
        desc: "Your people are your power. Connection is your medicine — and this is a beautiful form of resilience that many people lack. Watch for co-dependence or needing external validation before you can feel okay. Strengthen your inner resilience alongside your relational one.",
        tip: "Daily affirmations help you internalize the support you currently get externally."
      },
      meaning: {
        type: "Meaning-Making Resilient",
        desc: "You transform pain into insight and experience into wisdom. You have a remarkable ability to find purpose even in difficulty. This is the highest form of resilience. Your edge: sometimes meaning-making can delay allowing yourself to simply grieve or be upset without a lesson attached.",
        tip: "Allow raw emotional practices (gratitude for difficulty, body scan) without rushing to the lesson."
      }
    }
  }
];

function getTopResult(answers, quiz) {
  const counts = {};
  answers.forEach(a => {
    counts[a] = (counts[a] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
}

function QuizCard({ quiz, onStart }) {
  return (
    <button
      className="quiz-card er-card"
      style={{
        "--card-color": quiz.color,
        "--er-card-glow": `radial-gradient(ellipse at top left, ${quiz.glow}, transparent 60%)`,
        "--er-card-border": `${quiz.color}55`
      }}
      onClick={onStart}
    >
      <div className="quiz-card-icon" style={{ color: quiz.color, background: quiz.glow }}>
        {quiz.icon}
      </div>
      <h3 className="quiz-card-title">{quiz.title}</h3>
      <p className="quiz-card-desc">{quiz.desc}</p>
      <div className="quiz-card-footer">
        <span className="quiz-duration">◷ {quiz.duration}</span>
        <span className="quiz-cta" style={{ color: quiz.color }}>Start →</span>
      </div>
    </button>
  );
}

function QuizRunner({ quiz, onDone, onBack }) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);

  const q = quiz.questions[current];
  const isLast = current === quiz.questions.length - 1;

  const choose = (val) => {
    if (animating) return;
    setSelected(val);
    setAnimating(true);
    setTimeout(() => {
      const newAnswers = [...answers, val];
      if (isLast) {
        onDone(getTopResult(newAnswers, quiz));
      } else {
        setAnswers(newAnswers);
        setCurrent(c => c + 1);
        setSelected(null);
        setAnimating(false);
      }
    }, 400);
  };

  const progress = (current / quiz.questions.length) * 100;

  return (
    <div className="qr-root" style={{ "--qr-color": quiz.color, "--qr-glow": quiz.glow }}>
      <button className="td-back" onClick={onBack}>← All quizzes</button>

      <div className="qr-header">
        <div className="qr-icon">{quiz.icon}</div>
        <h2 className="qr-title">{quiz.title}</h2>
      </div>

      <div className="qr-progress-wrap">
        <div className="qr-progress-label">
          <span>Question {current + 1} of {quiz.questions.length}</span>
          <span style={{ color: quiz.color }}>{Math.round(progress)}%</span>
        </div>
        <div className="qr-progress-track">
          <div className="qr-progress-fill" style={{ width: `${progress}%`, background: quiz.color }} />
        </div>
      </div>

      <div className={`qr-question ${animating ? "qr-question--exit" : "qr-question--enter"}`}>
        <p className="qr-q-text">{q.q}</p>
        <div className="qr-options">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={`qr-option ${selected === opt.value ? "qr-option--selected" : ""}`}
              style={{ "--qr-color": quiz.color }}
              onClick={() => choose(opt.value)}
              disabled={!!selected}
            >
              <span className="qr-option-bullet">{i + 1}</span>
              <span className="qr-option-text">{opt.text}</span>
              {selected === opt.value && <span className="qr-option-check">✓</span>}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function QuizResult({ quiz, resultKey, onRetake, onBack }) {
  const result = quiz.results[resultKey];
  return (
    <div className="qres-root" style={{ "--qr-color": quiz.color, "--qr-glow": quiz.glow }}>
      <button className="td-back" onClick={onBack}>← All quizzes</button>

      <div className="qres-hero">
        <div className="qres-hero-bg" />
        <div className="qres-icon">{quiz.icon}</div>
        <div className="qres-label">Your Result</div>
        <h2 className="qres-type">{result.type}</h2>
      </div>

      <div className="qres-desc-card">
        <p className="qres-desc">{result.desc}</p>
      </div>

      <div className="qres-tip">
        <div className="qres-tip-label" style={{ color: quiz.color }}>◈ Practice Recommendation</div>
        <p className="qres-tip-text">{result.tip}</p>
      </div>

      <div className="qres-actions">
        <button className="er-btn er-btn-ghost" onClick={onRetake}>Retake Quiz</button>
        <button className="er-btn er-btn-ghost" onClick={onBack}>More Quizzes</button>
      </div>
    </div>
  );
}

export default function Quizzes() {
  const [mode, setMode] = useState("list"); // list | quiz | result
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [resultKey, setResultKey] = useState(null);

  const startQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setResultKey(null);
    setMode("quiz");
  };

  const finishQuiz = (key) => {
    setResultKey(key);
    setMode("result");
  };

  if (mode === "quiz") {
    return <QuizRunner quiz={activeQuiz} onDone={finishQuiz} onBack={() => setMode("list")} />;
  }

  if (mode === "result") {
    return <QuizResult quiz={activeQuiz} resultKey={resultKey} onRetake={() => startQuiz(activeQuiz)} onBack={() => setMode("list")} />;
  }

  return (
    <div className="quizzes-root">
      <h2 className="er-section-title">Self-Discovery</h2>
      <p className="er-section-desc">
        These aren't personality tests — they're mirrors. Each quiz offers a moment of honest self-reflection to help you understand how you tick.
      </p>
      <div className="quizzes-grid">
        {quizzes.map((quiz, i) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            onStart={() => startQuiz(quiz)}
          />
        ))}
      </div>
    </div>
  );
}