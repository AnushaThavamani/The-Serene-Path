import { useState } from "react";
import "./Quizzes.css";

const QUESTION_COUNT = 10;

const emotionRegulationQuestionBank = [
  {
    q: "When a strong emotion shows up, your first instinct is to...",
    options: [
      { text: "Feel it fully and sit with the intensity", value: "feeler" },
      { text: "Figure out why it happened", value: "thinker" },
      { text: "Keep moving so you do not dwell on it", value: "avoider" },
      { text: "Reach out and talk it through", value: "expresser" }
    ]
  },
  {
    q: "After a stressful interaction, what helps you most?",
    options: [
      { text: "Letting myself cry or release emotion", value: "feeler" },
      { text: "Replaying it to understand the pattern", value: "thinker" },
      { text: "Switching tasks and staying productive", value: "avoider" },
      { text: "Calling someone I trust", value: "expresser" }
    ]
  },
  {
    q: "How do you usually notice anxiety in yourself first?",
    options: [
      { text: "A heavy emotional wave in my body", value: "feeler" },
      { text: "Racing thoughts and overanalysis", value: "thinker" },
      { text: "An urge to escape or numb out", value: "avoider" },
      { text: "A strong need for reassurance", value: "expresser" }
    ]
  },
  {
    q: "When someone asks how you are doing, you usually...",
    options: [
      { text: "Answer honestly because I feel things deeply", value: "feeler" },
      { text: "Explain what is happening logically", value: "thinker" },
      { text: "Say I am fine and move on", value: "avoider" },
      { text: "Open up more once the conversation starts", value: "expresser" }
    ]
  },
  {
    q: "Which habit sounds most like you during overwhelm?",
    options: [
      { text: "I absorb the mood of everything around me", value: "feeler" },
      { text: "I try to solve every part of the problem", value: "thinker" },
      { text: "I distract myself with chores, scrolling, or work", value: "avoider" },
      { text: "I need to talk before I can settle down", value: "expresser" }
    ]
  },
  {
    q: "When you are upset with someone, what is hardest?",
    options: [
      { text: "Managing the intensity of what I feel", value: "feeler" },
      { text: "Stopping myself from overthinking the whole situation", value: "thinker" },
      { text: "Actually facing the conversation", value: "avoider" },
      { text: "Waiting until they are available to talk", value: "expresser" }
    ]
  },
  {
    q: "What does self-awareness look like for you on a hard day?",
    options: [
      { text: "I can name the emotional weight I am carrying", value: "feeler" },
      { text: "I can trace what triggered me and why", value: "thinker" },
      { text: "I notice I am pulling away or shutting down", value: "avoider" },
      { text: "I know I need connection to process clearly", value: "expresser" }
    ]
  },
  {
    q: "What usually happens when you try to calm yourself down?",
    options: [
      { text: "I need time to let the feelings move through me", value: "feeler" },
      { text: "I talk myself through it step by step", value: "thinker" },
      { text: "I avoid the feeling until it fades", value: "avoider" },
      { text: "I settle once I feel heard", value: "expresser" }
    ]
  },
  {
    q: "Which statement fits your stress pattern best?",
    options: [
      { text: "Stress feels emotional and physical at the same time", value: "feeler" },
      { text: "Stress makes my mind run nonstop", value: "thinker" },
      { text: "Stress makes me detach and go numb", value: "avoider" },
      { text: "Stress makes me seek comfort from people", value: "expresser" }
    ]
  },
  {
    q: "If you receive unexpected criticism, you tend to...",
    options: [
      { text: "Take it to heart and feel it deeply", value: "feeler" },
      { text: "Analyze whether it is fair and what it means", value: "thinker" },
      { text: "Brush it off outwardly and avoid revisiting it", value: "avoider" },
      { text: "Need to talk it through with someone", value: "expresser" }
    ]
  },
  {
    q: "How do you usually recover after an anxious day?",
    options: [
      { text: "Rest, cry, journal, or listen inward", value: "feeler" },
      { text: "Reflect and make a plan for tomorrow", value: "thinker" },
      { text: "Keep busy until I stop noticing it", value: "avoider" },
      { text: "Share what happened with someone close", value: "expresser" }
    ]
  },
  {
    q: "What is most true about your emotional boundaries?",
    options: [
      { text: "I sometimes carry other people's emotions as my own", value: "feeler" },
      { text: "I protect myself by staying objective", value: "thinker" },
      { text: "I keep distance so emotions do not overwhelm me", value: "avoider" },
      { text: "I process best in emotionally open relationships", value: "expresser" }
    ]
  },
  {
    q: "When your mood changes suddenly, you are most likely to...",
    options: [
      { text: "Notice it in your body right away", value: "feeler" },
      { text: "Search for the reason behind it", value: "thinker" },
      { text: "Push it aside and stay functional", value: "avoider" },
      { text: "Mention it to someone close", value: "expresser" }
    ]
  },
  {
    q: "In emotionally intense moments, what do you value most?",
    options: [
      { text: "Permission to feel without judgment", value: "feeler" },
      { text: "Clarity and understanding", value: "thinker" },
      { text: "Space from the emotion", value: "avoider" },
      { text: "Connection and reassurance", value: "expresser" }
    ]
  },
  {
    q: "How do you usually handle sadness?",
    options: [
      { text: "I sink into it and feel it deeply", value: "feeler" },
      { text: "I try to understand where it is coming from", value: "thinker" },
      { text: "I stay distracted so it does not catch up with me", value: "avoider" },
      { text: "I want to share it with someone safe", value: "expresser" }
    ]
  },
  {
    q: "What makes emotional regulation hardest for you?",
    options: [
      { text: "The feelings can be intense and lingering", value: "feeler" },
      { text: "I get stuck in mental loops", value: "thinker" },
      { text: "I avoid emotions until they build up", value: "avoider" },
      { text: "I rely heavily on others to feel steady", value: "expresser" }
    ]
  },
  {
    q: "When you feel misunderstood, you tend to...",
    options: [
      { text: "Feel hurt very quickly", value: "feeler" },
      { text: "Explain yourself in more detail", value: "thinker" },
      { text: "Withdraw and keep it to yourself", value: "avoider" },
      { text: "Keep talking until you feel understood", value: "expresser" }
    ]
  },
  {
    q: "How do you usually experience self-awareness in relationships?",
    options: [
      { text: "I notice my emotions strongly in connection with others", value: "feeler" },
      { text: "I study patterns in communication and behavior", value: "thinker" },
      { text: "I notice when I want to retreat or disconnect", value: "avoider" },
      { text: "I understand myself best through honest conversation", value: "expresser" }
    ]
  },
  {
    q: "What best describes your approach to emotional healing?",
    options: [
      { text: "Feel, release, and gently recover", value: "feeler" },
      { text: "Reflect, learn, and reframe", value: "thinker" },
      { text: "Cope quietly and keep going", value: "avoider" },
      { text: "Talk, connect, and process together", value: "expresser" }
    ]
  },
  {
    q: "If your nervous system feels overloaded, what do you most often need?",
    options: [
      { text: "Grounding and emotional rest", value: "feeler" },
      { text: "Mental structure and perspective", value: "thinker" },
      { text: "Distance and fewer demands", value: "avoider" },
      { text: "Comforting connection", value: "expresser" }
    ]
  }
];

const quizzes = [
  {
    id: "emotion-style",
    icon: "\u25CE",
    color: "#3a4f41",
    glow: "rgba(58, 79, 65, 0.05)",
    title: "Your Emotion Style",
    desc: "Discover how you typically experience and process emotions - are you a feeler, thinker, or avoider?",
    duration: "3 min",
    questionBank: emotionRegulationQuestionBank,
    results: {
      feeler: {
        type: "The Deep Feeler",
        desc: "You experience emotions with intensity and depth. You are highly empathetic and emotionally intelligent, but can sometimes get swept away. Your strength is authenticity. Your growth edge is learning to ride the emotional wave without drowning in it.",
        tip: "Practices like the body scan and journaling will resonate most with you."
      },
      thinker: {
        type: "The Emotional Analyst",
        desc: "You process feelings through your mind. You are calm under pressure and great at problem-solving, but may sometimes intellectualize rather than actually feel. Your strength is clarity. Your growth edge is letting yourself feel before jumping to solutions.",
        tip: "Cognitive reframing will feel natural, but try adding gratitude practices to open the heart side."
      },
      avoider: {
        type: "The Emotional Protector",
        desc: "You manage difficult emotions by keeping busy or creating distance. This serves a purpose and often makes you seem stable. But unexpressed emotions compound over time. Your strength is resilience. Your growth edge is creating small, safe spaces to feel.",
        tip: "Start small - try 2 minutes of body scan daily to build tolerance for sitting with feelings."
      },
      expresser: {
        type: "The Relational Processor",
        desc: "You understand your emotions most clearly through connection and conversation. You are warm, open, and build deep relationships. Your strength is vulnerability. Your growth edge is developing an inner processing practice so you do not always need external validation.",
        tip: "Journaling and affirmation practices can help you build that inner voice."
      }
    }
  },
  {
    id: "stress-triggers",
    icon: "\u25C7",
    color: "#c3b299",
    glow: "rgba(195, 178, 153, 0.1)",
    title: "Stress Trigger Awareness",
    desc: "Pinpoint what specifically drives your stress - environment, relationships, or internal pressure.",
    duration: "4 min",
    questions: [
      {
        q: "Which scenario stresses you out most?",
        options: [
          { text: "Too many tasks with no clear priority", value: "overwhelm" },
          { text: "Conflict or tension with someone", value: "relational" },
          { text: "Feeling like I am not good enough", value: "internal" },
          { text: "Unpredictability or lack of control", value: "uncertainty" }
        ]
      },
      {
        q: "When you are stressed, your body usually...",
        options: [
          { text: "Gets tight shoulders or jaw", value: "overwhelm" },
          { text: "Heart races or stomach churns", value: "relational" },
          { text: "Feels heavy or exhausted", value: "internal" },
          { text: "Gets restless - hard to sit still", value: "uncertainty" }
        ]
      },
      {
        q: "What thought is most common during stress?",
        options: [
          { text: "\"I have too much to do\"", value: "overwhelm" },
          { text: "\"They are upset with me or I did something wrong\"", value: "relational" },
          { text: "\"I am not doing this right or I am failing\"", value: "internal" },
          { text: "\"I do not know what is going to happen\"", value: "uncertainty" }
        ]
      },
      {
        q: "After a stressful day, you most need...",
        options: [
          { text: "To cross things off a list and feel in control", value: "overwhelm" },
          { text: "To reconnect with someone and feel okay", value: "relational" },
          { text: "Quiet time alone to restore yourself", value: "internal" },
          { text: "A clear plan for what is coming next", value: "uncertainty" }
        ]
      }
    ],
    results: {
      overwhelm: {
        type: "Capacity Overloader",
        desc: "Your stress peaks when demands exceed your perceived capacity. You are likely high-achieving and responsible, which means you take on a lot. The antidote is not doing less. It is building better systems for prioritization and giving yourself permission to rest.",
        tip: "Practice cognitive reframing around what \"enough\" looks like for you today."
      },
      relational: {
        type: "Relational Reactor",
        desc: "Social tension and disconnection are your main stress drivers. You care deeply about how others feel and about maintaining harmony. This is a gift, but it can lead to people-pleasing. Your work is separating others' emotions from your own worth.",
        tip: "Affirmations that reinforce your independent value, not conditional on approval, will be powerful."
      },
      internal: {
        type: "Inner Critic Driven",
        desc: "Your biggest stressor lives inside you - a demanding inner voice that measures and judges. You likely have high standards and a deep desire to do things well. The goal is not to silence the critic, but to turn it from enemy to wise coach.",
        tip: "Cognitive reframing and compassionate journaling are your most important tools."
      },
      uncertainty: {
        type: "Control Seeker",
        desc: "Ambiguity and unpredictability are your nervous system's kryptonite. You function best with structure and clarity. This is not weakness. It is simply how your brain wires safety. The practice is building tolerance for not knowing.",
        tip: "Body scan helps you ground in the present when your mind races toward unknown futures."
      }
    }
  },
  {
    id: "attachment",
    icon: "\u25B3",
    color: "#d4a373",
    glow: "rgba(212, 163, 115, 0.05)",
    title: "Attachment & Relationship Patterns",
    desc: "Understand how your early experiences shape how you connect - and protect yourself - in relationships.",
    duration: "4 min",
    questions: [
      {
        q: "When someone you care about does not respond quickly, you tend to...",
        options: [
          { text: "Feel slightly anxious and check again", value: "anxious" },
          { text: "Assume they are busy - it does not bother me much", value: "secure" },
          { text: "Pull back and act more distant when they do respond", value: "avoidant" },
          { text: "Feel confused - sometimes fine, sometimes spiraling", value: "disorganized" }
        ]
      },
      {
        q: "In close relationships, your deepest fear is...",
        options: [
          { text: "Being abandoned or left", value: "anxious" },
          { text: "Losing myself or my independence", value: "avoidant" },
          { text: "Not really having one - relationships feel mostly safe", value: "secure" },
          { text: "Both abandonment and losing myself - it is conflicting", value: "disorganized" }
        ]
      },
      {
        q: "After an argument with someone close, you usually...",
        options: [
          { text: "Need to resolve it right away - cannot rest until it is okay", value: "anxious" },
          { text: "Need space, then come back when I have processed", value: "avoidant" },
          { text: "Talk it through relatively calmly when ready", value: "secure" },
          { text: "Alternate between wanting to fix it and pulling away", value: "disorganized" }
        ]
      },
      {
        q: "Emotional intimacy makes you feel...",
        options: [
          { text: "Nourished - the closer, the better", value: "anxious" },
          { text: "Comfortable when it builds gradually", value: "secure" },
          { text: "Slightly uncomfortable - I value independence", value: "avoidant" },
          { text: "Both drawn in and scared at the same time", value: "disorganized" }
        ]
      }
    ],
    results: {
      anxious: {
        type: "Anxious Attachment",
        desc: "You love deeply and care intensely, but often worry that love will not last or be reciprocated equally. This stems from early experiences where love felt inconsistent. You are not too much. Your nervous system learned to stay alert to protect yourself. The work is self-soothing and building inner security.",
        tip: "Daily affirmations of self-worth, independent of relationship status, and cognitive reframing of worst-case relationship thoughts will help."
      },
      secure: {
        type: "Secure Attachment",
        desc: "You have a generally healthy relationship with closeness and independence. You can tolerate both intimacy and distance without panic. This is a genuine asset. Your growth edge is continuing to deepen self-awareness so you can be a secure base for others too.",
        tip: "Focus on techniques that deepen emotional intelligence - body scan and reflective journaling."
      },
      avoidant: {
        type: "Avoidant Attachment",
        desc: "You prize self-sufficiency and can feel smothered by too much closeness. This developed as a smart adaptation because needing others did not always feel safe. You are not cold, you are careful. The work is slowly expanding your window of tolerance for vulnerability.",
        tip: "Gratitude practices focused on relationships can gently rewire the association between closeness and threat."
      },
      disorganized: {
        type: "Disorganized / Fearful",
        desc: "You simultaneously long for and fear deep connection, which can feel exhausting and confusing. This pattern often comes from experiences where the source of comfort was also a source of fear. This is not permanent. With consistent self-care and possibly therapy, this pattern can shift meaningfully.",
        tip: "Body scan and grounding techniques help regulate the nervous system that underlies this push-pull pattern."
      }
    }
  },
  {
    id: "resilience",
    icon: "\u2726",
    color: "#8a9a86",
    glow: "rgba(138, 154, 134, 0.05)",
    title: "Resilience & Coping Style",
    desc: "Find out how you bounce back from adversity and where your resilience can grow stronger.",
    duration: "3 min",
    questions: [
      {
        q: "When life knocks you down, your first response is usually...",
        options: [
          { text: "Take action immediately - solve the problem", value: "active" },
          { text: "Withdraw and process internally first", value: "reflective" },
          { text: "Lean on others for support and perspective", value: "relational" },
          { text: "Try to find meaning in what happened", value: "meaning" }
        ]
      },
      {
        q: "How do you relate to past difficult experiences?",
        options: [
          { text: "They made me stronger - I have grown from them", value: "meaning" },
          { text: "I have moved past them but they still sting sometimes", value: "active" },
          { text: "I still process them - slowly but surely", value: "reflective" },
          { text: "My people helped me through them", value: "relational" }
        ]
      },
      {
        q: "Your recovery mode after a hard week looks like...",
        options: [
          { text: "Physical activity, projects, or getting things done", value: "active" },
          { text: "Quiet - reading, nature, solitude", value: "reflective" },
          { text: "Social time with people who fill me up", value: "relational" },
          { text: "Journaling, thinking, making sense of things", value: "meaning" }
        ]
      },
      {
        q: "What helps most when you feel hopeless?",
        options: [
          { text: "Remembering times I have overcome difficulty before", value: "meaning" },
          { text: "Breaking the situation into small manageable actions", value: "active" },
          { text: "Being heard and validated by someone who cares", value: "relational" },
          { text: "Giving myself permission to rest and not rush", value: "reflective" }
        ]
      }
    ],
    results: {
      active: {
        type: "Action-Oriented Resilient",
        desc: "You rebuild through doing. Movement, productivity, and problem-solving are how your nervous system regulates. This is genuine strength, but watch for bypassing emotional processing through busyness. True resilience includes feeling, not just fixing.",
        tip: "Add a brief reflective practice, like body scan or journaling, after solving a problem to complete the emotional cycle."
      },
      reflective: {
        type: "Reflective Resilient",
        desc: "You heal through understanding. Solitude, introspection, and making sense of events are how you restore. You are often wiser than you appear because you process deeply. Watch for over-rumination. Sometimes understanding is less important than simply moving forward.",
        tip: "Cognitive reframing can help you shift from circular rumination to productive reflection."
      },
      relational: {
        type: "Relationally Resilient",
        desc: "Your people are your power. Connection is your medicine, and this is a beautiful form of resilience that many people lack. Watch for co-dependence or needing external validation before you can feel okay. Strengthen your inner resilience alongside your relational one.",
        tip: "Daily affirmations help you internalize the support you currently get externally."
      },
      meaning: {
        type: "Meaning-Making Resilient",
        desc: "You transform pain into insight and experience into wisdom. You have a remarkable ability to find purpose even in difficulty. This is a powerful form of resilience. Your edge is that meaning-making can delay allowing yourself to simply grieve or be upset without a lesson attached.",
        tip: "Allow raw emotional practices, like gratitude for difficulty or body scan, without rushing to the lesson."
      }
    }
  }
];

function shuffleArray(items) {
  const shuffled = [...items];

  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

function buildQuizSession(quiz) {
  if (!quiz.questionBank?.length) {
    return quiz;
  }

  return {
    ...quiz,
    questions: shuffleArray(quiz.questionBank).slice(0, QUESTION_COUNT)
  };
}

function getTopResult(answers) {
  const counts = {};

  answers.forEach((answer) => {
    counts[answer] = (counts[answer] || 0) + 1;
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
        <span className="quiz-duration">&#9687; {quiz.duration}</span>
        <span className="quiz-cta" style={{ color: quiz.color }}>Start &rarr;</span>
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
  const progress = (current / quiz.questions.length) * 100;

  const choose = (value) => {
    if (animating) {
      return;
    }

    setSelected(value);
    setAnimating(true);

    setTimeout(() => {
      const newAnswers = [...answers, value];

      if (isLast) {
        onDone(getTopResult(newAnswers));
        return;
      }

      setAnswers(newAnswers);
      setCurrent((prev) => prev + 1);
      setSelected(null);
      setAnimating(false);
    }, 400);
  };

  return (
    <div className="qr-root" style={{ "--qr-color": quiz.color, "--qr-glow": quiz.glow }}>
      <button className="td-back" onClick={onBack}>&larr; All quizzes</button>

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
          {q.options.map((opt, index) => (
            <button
              key={`${q.q}-${opt.value}-${index}`}
              className={`qr-option ${selected === opt.value ? "qr-option--selected" : ""}`}
              style={{ "--qr-color": quiz.color }}
              onClick={() => choose(opt.value)}
              disabled={Boolean(selected)}
            >
              <span className="qr-option-bullet">{index + 1}</span>
              <span className="qr-option-text">{opt.text}</span>
              {selected === opt.value && <span className="qr-option-check">&#10003;</span>}
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
      <button className="td-back" onClick={onBack}>&larr; All quizzes</button>

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
        <div className="qres-tip-label" style={{ color: quiz.color }}>&#9672; Practice Recommendation</div>
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
  const [mode, setMode] = useState("list");
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [resultKey, setResultKey] = useState(null);

  const startQuiz = (quiz) => {
    setActiveQuiz(buildQuizSession(quiz));
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
    return (
      <QuizResult
        quiz={activeQuiz}
        resultKey={resultKey}
        onRetake={() => startQuiz(quizzes.find((quiz) => quiz.id === activeQuiz.id))}
        onBack={() => setMode("list")}
      />
    );
  }

  return (
    <div className="quizzes-root">
      <h2 className="er-section-title">Self-Discovery</h2>
      <p className="er-section-desc">
        These are not personality tests - they are mirrors. Each quiz offers a moment of honest self-reflection to help you understand how you tick.
      </p>
      <div className="quizzes-grid">
        {quizzes.map((quiz) => (
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
