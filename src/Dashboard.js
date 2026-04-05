import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Leaf, BookHeart, Activity, Library, PlayCircle, 
  Wind, Home, Search, Bell, User, ArrowRight, HeartPulse, MessageSquareMore, ShieldCheck
} from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  // Dynamic State (Mood Only)
  const [todayMood, setTodayMood] = useState(null);
  const [moodHistory, setMoodHistory] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [slogan, setSlogan] = useState("Welcome to your sanctuary.");
  const [totalCheckins, setTotalCheckins] = useState(0);
  const [streak, setStreak] = useState(0);
  const [recentEvents, setRecentEvents] = useState([]);
  
  // Top Nav State
  const [sanctuaryState, setSanctuaryState] = useState("Awaiting Check-in");
  const [lastEntryText, setLastEntryText] = useState("No entries yet");
  const [greeting, setGreeting] = useState("Welcome");

  const MOOD_OPTIONS = ['🌿', '☀️', '😔', '😴', '❤️'];
  const COLORS = ['#1dd1a1', '#feca57', '#ff6b6b', '#54a0ff', '#ff9ff3'];

  // --- 1. LOAD MOOD DATA ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return navigate('/login');
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    const email = parsedUser.email;

    // Time-based Greeting
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    // Load Only Moods
    const savedMoods = JSON.parse(localStorage.getItem(`mood_history_${email}`)) || [];
    setMoodHistory(savedMoods);
    setTotalCheckins(savedMoods.length);

    // Check Today's Mood
    const today = new Date().toLocaleDateString();
    const loggedToday = savedMoods.find(m => m.date === today);
    if (loggedToday) {
      setTodayMood(loggedToday.mood);
      updateSanctuaryState(loggedToday.mood);
    }

    calculateRealStreak(savedMoods);
    generateRecentJourney(savedMoods);
    processAnalytics(savedMoods);

  }, [navigate]);

  // --- 2. DYNAMIC SANCTUARY STATE ---
  const updateSanctuaryState = (mood) => {
    const stateMap = {
      '🌿': 'Peaceful',
      '☀️': 'Vibrant',
      '😔': 'Healing',
      '😴': 'Resting',
      '❤️': 'Grateful'
    };
    setSanctuaryState(stateMap[mood] || 'Active');
  };

  // --- 3. DYNAMIC STREAK CALCULATOR ---
  // --- 3. DYNAMIC STREAK CALCULATOR (Fixed for all regions) ---
  const calculateRealStreak = (moods) => {
    if (moods.length === 0) return setStreak(0);
    
    // Use the exact timestamp to find midnight, ignoring confusing text formats
    const uniqueDays = [...new Set(moods.map(m => {
      // If it's an old glitched entry, fallback to today. Otherwise use exact time.
      const d = m.timestamp ? new Date(m.timestamp) : new Date();
      d.setHours(0, 0, 0, 0); // Reset to midnight of that specific day
      return d.getTime();
    }))].sort((a, b) => b - a);
    
    let currentStreak = 0;
    let checkDate = new Date();
    checkDate.setHours(0, 0, 0, 0); // Today at midnight

    // If the most recent log wasn't today, check if they logged yesterday
    if (uniqueDays[0] < checkDate.getTime()) {
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Count backwards day by day
    for (let time of uniqueDays) {
      if (time === checkDate.getTime()) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1); // Step back 24 hours
      } else {
        break; // The chain was broken!
      }
    }
    setStreak(currentStreak);
  };

  // --- 4. LOG MOOD ---
  const logMood = async (selectedMood) => {
    if (!user) return;
    const today = new Date().toLocaleDateString();
    const timestamp = Date.now();

    const filteredHistory = moodHistory.filter(m => m.date !== today);
    const newHistory = [...filteredHistory, { date: today, mood: selectedMood, timestamp }];
    
    setMoodHistory(newHistory);
    setTodayMood(selectedMood);
    setTotalCheckins(newHistory.length);
    localStorage.setItem(`mood_history_${user.email}`, JSON.stringify(newHistory));
    
    processAnalytics(newHistory);
    updateSanctuaryState(selectedMood);
    calculateRealStreak(newHistory);
    generateRecentJourney(newHistory);

    try {
      await fetch('http://localhost:5000/api/mood', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user.email,
          mood: selectedMood,
          date: today,
          timestamp,
        }),
      });
    } catch (error) {
      console.warn('Mood sync skipped:', error.message);
    }
  };

  // --- 5. PROCESS CHART & SLOGAN ---
  const processAnalytics = (history) => {
    if (history.length === 0) return setSlogan("Log your first mood to uncover your emotional insights.");

    const counts = {};
    history.forEach(entry => { counts[entry.mood] = (counts[entry.mood] || 0) + 1; });
    const data = Object.keys(counts).map(key => ({ name: key, value: counts[key] }));
    setChartData(data);

    const dominantMood = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
    const slogans = {
      '🌿': "You are cultivating a deeply peaceful path. Keep nurturing your calm.",
      '☀️': "Your joy is radiating! Protect this bright, beautiful energy.",
      '😔': "It's okay to feel heavy. Be gentle with yourself during this season.",
      '😴': "Your mind is asking for rest. Honor your need to recharge.",
      '❤️': "You are leading with love and gratitude. What a beautiful space to be in."
    };
    setSlogan(slogans[dominantMood]);
  };

  // --- 6. GENERATE RECENT EVENTS (MOODS ONLY) ---
  const generateRecentJourney = (moods) => {
    const events = moods.map(m => ({
      id: `m_${m.timestamp || Date.now()}`,
      text: `Logged Mood: ${m.mood}`,
      dateStr: m.date,
      time: m.timestamp || new Date(m.date).getTime(),
      color: 'dot-green'
    }));

    const sorted = events.sort((a, b) => b.time - a.time);
    setRecentEvents(sorted.slice(0, 5));

    if (sorted.length > 0) {
      const diffMins = Math.floor((Date.now() - sorted[0].time) / 60000);
      if (diffMins < 60) setLastEntryText(`${diffMins || 1} mins ago`);
      else if (diffMins < 1440) setLastEntryText(`${Math.floor(diffMins / 60)} hours ago`);
      else setLastEntryText("Yesterday or older");
    } else {
      setLastEntryText("No entries yet");
    }
  };

  if (!user) return <div className="dash-loading">Loading...</div>;

  return (
    <div className="layout-container animate-fade-in">
      
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Leaf className="brand-icon" />
          <h2>The Serene Path</h2>
        </div>
        <div className="sidebar-menu">
          <p className="menu-label">Sanctuary</p>
          <button className="menu-item active"><Leaf size={18} /> Dashboard</button>
          <button className="menu-item" onClick={() => navigate('/journal')}><BookHeart size={18} /> Journaling</button>
          <button className="menu-item" onClick={() => navigate('/bibliotherapy')}><Library size={18} /> Bibliotherapy</button>
          <button className="menu-item" onClick={() => navigate('/Sanctuary')}><PlayCircle size={18} /> Multimedia</button>
          <button className="menu-item" onClick={() => navigate('/regulation')}><Wind size={18} /> Emotion Regulation</button>
        </div>
        <div className="sidebar-bottom">
          <div className="help-box">
            <HeartPulse size={20} className="help-icon" />
            <p>Need a moment?</p>
            <button onClick={() => navigate('/emotion-regulation')}>Breathe Now</button>
          </div>
          <button className="menu-item return-home" onClick={() => navigate('/')}>
            <Home size={18} /> Go to Homepage
          </button>
        </div>
      </aside>

      <main className="main-content">
        
        {/* TOP NAVBAR */}
        <header className="top-nav">
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input type="text" placeholder="Search your sanctuary..." />
          </div>
          <div className="top-nav-stats">
            <div className="nav-stat">
              <span className="stat-label">Sanctuary State:</span>
              <span className={`stat-value ${sanctuaryState === 'Healing' ? 'text-blue' : 'text-green'}`}>
                {sanctuaryState}
              </span>
            </div>
            <div className="nav-stat">
              <span className="stat-label">Last Entry:</span>
              <span className="stat-value">{lastEntryText}</span>
            </div>
          </div>
          <div className="top-nav-user">
            <button className="icon-btn"><Bell size={18} /></button>
            <div className="user-profile" onClick={() => { localStorage.removeItem('user'); navigate('/login'); }}>
              <div className="avatar"><User size={16} /></div>
              <span>{greeting}, {user.fullName || 'Traveler'}</span>
            </div>
          </div>
        </header>

        <div className="dashboard-body">
          <div className="center-column">
            
            {/* 1. STATS ROW */}
            <div className="stats-row">
              <div className="stat-card">
                <div className="stat-header">Total Check-ins</div>
                <div className="stat-main">{totalCheckins}</div>
                <div className="stat-sub text-green">Mood logs</div>
              </div>
              <div className="stat-card">
                <div className="stat-header">Current Streak</div>
                <div className="stat-main">{streak} Days</div>
                <div className="stat-sub text-green">Consistent check-ins</div>
              </div>
              
              {/* INTERACTIVE MOOD LOGGER */}
              <div className="stat-card interactive-mood-card">
                <div className="stat-header">Today's Mood</div>
                {todayMood ? (
                   <div className="logged-mood-display">
                     <span className="huge-emoji">{todayMood}</span>
                     <button className="change-mood-btn" onClick={() => setTodayMood(null)}>Change</button>
                   </div>
                ) : (
                  <div className="mini-mood-picker">
                    {MOOD_OPTIONS.map(m => (
                      <button key={m} onClick={() => logMood(m)} className="mini-mood-btn">{m}</button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 2. ANALYTICS BANNER */}
            <div className="analytics-banner">
              <div className="banner-text">
                <h3>Emotional Insights</h3>
                <p>{slogan}</p>
              </div>
              <div className="banner-chart">
                {chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height={100}>
                    <PieChart>
                      <Pie data={chartData} innerRadius={25} outerRadius={40} paddingAngle={5} dataKey="value">
                        {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="empty-chart-msg">Log moods to see your chart</div>
                )}
              </div>
            </div>

            {/* 3. ACTION CARDS GRID */}
            <div className="action-grid">
              <div className="action-card" onClick={() => navigate('/journal')}>
                <div className="card-icon-wrapper journal-theme"><BookHeart size={28} /></div>
                <div className="card-info"><h3>Encrypted Journal</h3><p>Write your private thoughts securely.</p></div>
                <div className="card-arrow"><ArrowRight size={20} /></div>
              </div>
              <div className="action-card" onClick={() => navigate('/bibliotherapy')}>
                <div className="card-icon-wrapper biblio-theme"><Library size={28} /></div>
                <div className="card-info"><h3>Bibliotherapy</h3><p>Curated reading for soul healing.</p></div>
                <div className="card-arrow"><ArrowRight size={20} /></div>
              </div>
              <div className="action-card" onClick={() => navigate('/emotion-regulation')}>
                <div className="card-icon-wrapper emotion-theme"><Wind size={28} /></div>
                <div className="card-info"><h3>Emotion Regulation</h3><p>Breathing exercises and positivity builders.</p></div>
                <div className="card-arrow"><ArrowRight size={20} /></div>
              </div>
              <div className="action-card" onClick={() => navigate('/sanctuary')}>
                <div className="card-icon-wrapper media-theme"><PlayCircle size={28} /></div>
                <div className="card-info"><h3>Multimedia Sanctuary</h3><p>Immerse yourself in calming visuals.</p></div>
                <div className="card-arrow"><ArrowRight size={20} /></div>
              </div>
              <div className="action-card" onClick={() => navigate('/feedback')}>
                <div className="card-icon-wrapper journal-theme"><MessageSquareMore size={28} /></div>
                <div className="card-info"><h3>Feedback</h3><p>Share ideas, issues, and product suggestions.</p></div>
                <div className="card-arrow"><ArrowRight size={20} /></div>
              </div>
              {user?.role === 'admin' && (
                <div className="action-card" onClick={() => navigate('/admin')}>
                  <div className="card-icon-wrapper emotion-theme"><ShieldCheck size={28} /></div>
                  <div className="card-info"><h3>Admin</h3><p>Review platform activity and submitted feedback.</p></div>
                  <div className="card-arrow"><ArrowRight size={20} /></div>
                </div>
              )}
            </div>
          </div>

          {/* 4. RIGHT COLUMN */}
          <div className="right-column">
            <div className="recent-events-panel">
              <div className="panel-header"><h3>Recent Journey</h3></div>
              <div className="event-list">
                {recentEvents.length === 0 ? (
                  <p className="no-events-text">Your journey begins here. Start by logging a mood above.</p>
                ) : (
                  recentEvents.map((event) => (
                    <div key={event.id} className="event-item">
                      <div className={`event-dot ${event.color}`}></div>
                      <div className="event-details">
                        <p>{event.text}</p>
                        <span>{event.dateStr}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
