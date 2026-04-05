import { useState } from "react";
import Techniques from "./components/Techniques/Techniques";
import Quizzes from "./components/Quizzes/Quizzes";
import PositivityBuilder from "./components/PositivityBuilder/PositivityBuilder";
import "./EmotionRegulation.css";

const tabs = [
  { id: "techniques", label: "Techniques", icon: "✦", sub: "Coping Tools" },
  { id: "quizzes", label: "Self Discovery", icon: "◈", sub: "Know Yourself" },
  { id: "positivity", label: "Positivity", icon: "❋", sub: "Daily Builder" },
];

export default function EmotionRegulation() {
  const [activeTab, setActiveTab] = useState("techniques");

  return (
    <div className="er-root">
      <div className="er-bg-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <header className="er-header">
        <div className="er-header-inner">
          <div className="er-brand">
            <span className="er-brand-icon">◎</span>
            <div>
              <h1 className="er-title">Inner Space</h1>
              <p className="er-subtitle">Your emotional wellness toolkit</p>
            </div>
          </div>
        </div>

        <nav className="er-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`er-tab ${activeTab === tab.id ? "er-tab--active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="er-tab-icon">{tab.icon}</span>
              <span className="er-tab-label">{tab.label}</span>
              <span className="er-tab-sub">{tab.sub}</span>
              {activeTab === tab.id && <span className="er-tab-indicator" />}
            </button>
          ))}
        </nav>
      </header>

      <main className="er-main">
        <div className="er-content" key={activeTab}>
          {activeTab === "techniques" && <Techniques />}
          {activeTab === "quizzes" && <Quizzes />}
          {activeTab === "positivity" && <PositivityBuilder />}
        </div>
      </main>
    </div>
  );
}