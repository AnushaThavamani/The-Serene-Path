import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import CryptoJS from 'crypto-js';
import axios from 'axios';
import './Journal.css';

const MOODS = [
  { emoji: '🌿', label: 'Calm' },
  { emoji: '😊', label: 'Happy' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😴', label: 'Tired' },
  { emoji: '❤️', label: 'Loved' },
  { emoji: '🔥', label: 'Motivated' },
  { emoji: '😰', label: 'Anxious' },
  { emoji: '🌧️', label: 'Melancholy' },
];

const FILTERS = ['All', 'Today', 'This Week', 'This Month'];

const Journal = () => {
  const navigate = useNavigate();
  const [journalState, setJournalState] = useState('loading');
  const [masterKey, setMasterKey] = useState(null);
  const [entries, setEntries] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [secQuestion, setSecQuestion] = useState('person');
  const [secAnswer, setSecAnswer] = useState('');
  const [error, setError] = useState('');

  const [view, setView] = useState('grid');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [newEntry, setNewEntry] = useState({ title: '', content: '', mood: '🌿' });
  const [appAlert, setAppAlert] = useState({ msg: '', type: 'success' });
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [activeMoodFilter, setActiveMoodFilter] = useState('All');
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12) setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else setGreeting('Good evening');
  }, []);

  const showAppAlert = (message, type = 'success') => {
    setAppAlert({ msg: message, type });
    setTimeout(() => setAppAlert({ msg: '', type: 'success' }), 3500);
  };

  useEffect(() => {
    const checkUserAndData = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) return navigate('/login');
      const email = JSON.parse(storedUser).email;
      setUserEmail(email);
      try {
        const res = await axios.get(`http://localhost:5000/api/journal/load/${email}`);
        if (res.data.status === 'Success' && res.data.journal) {
          localStorage.setItem(`journal_config_${email}`, res.data.journal.encryptedConfig);
          localStorage.setItem(`journal_data_${email}`, res.data.journal.encryptedData);
          setJournalState('locked');
        } else {
          setJournalState('setup');
        }
      } catch (err) { setJournalState('setup'); }
    };
    checkUserAndData();
  }, [navigate]);

  const generateMK = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

  const handleSetup = async (e) => {
    e.preventDefault();
    if (pin !== confirmPin) return setError('PINs do not match.');
    if (pin.length < 4) return setError('PIN must be at least 4 characters.');
    if (!secAnswer) return setError('Security answer is required.');
    const mk = generateMK();
    const config = {
      q: secQuestion,
      mk_pin: CryptoJS.AES.encrypt(mk, pin).toString(),
      mk_ans: CryptoJS.AES.encrypt(mk, secAnswer.toLowerCase()).toString(),
    };
    const configStr = JSON.stringify(config);
    const initialDataStr = CryptoJS.AES.encrypt(JSON.stringify([]), mk).toString();
    try {
      await axios.post('http://localhost:5000/api/journal/sync', {
        userEmail,
        encryptedConfig: configStr,
        encryptedData: initialDataStr,
        entryCount: 0,
        lastEntryAt: null,
      });
      localStorage.setItem(`journal_config_${userEmail}`, configStr);
      localStorage.setItem(`journal_data_${userEmail}`, initialDataStr);
      setMasterKey(mk);
      setEntries([]);
      setJournalState('unlocked');
      setError('');
    } catch (err) { setError('Server Error: Could not initialize.'); }
  };

  const handleUnlock = (e, type) => {
    e.preventDefault();
    const configStr = localStorage.getItem(`journal_config_${userEmail}`);
    const dataStr = localStorage.getItem(`journal_data_${userEmail}`);
    if (!configStr || !dataStr) return setError('Configuration missing. Please reset.');
    try {
      const config = JSON.parse(configStr);
      let mk = '';
      if (type === 'pin') mk = CryptoJS.AES.decrypt(config.mk_pin, pin).toString(CryptoJS.enc.Utf8);
      else mk = CryptoJS.AES.decrypt(config.mk_ans, secAnswer.toLowerCase()).toString(CryptoJS.enc.Utf8);
      if (!mk) throw new Error('Invalid Key');
      const decryptedString = CryptoJS.AES.decrypt(dataStr, mk).toString(CryptoJS.enc.Utf8);
      if (!decryptedString) throw new Error('Corrupted Data');
      setEntries(JSON.parse(decryptedString));
      setMasterKey(mk);
      setJournalState('unlocked');
      setError('');
    } catch (err) { setError('Incorrect PIN/Answer.'); }
  };

  // ── SAVE (unchanged logic) ──
  const syncToServer = async (updatedEntries) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const safeEmail = storedUser.email;
    const safeConfig = localStorage.getItem(`journal_config_${safeEmail}`);
    if (!masterKey || !safeConfig) throw new Error('Security Error: Journal locked.');
    const safeData = CryptoJS.AES.encrypt(JSON.stringify(updatedEntries), masterKey).toString();
    const latestEntryTime = updatedEntries.length
      ? Math.max(...updatedEntries.map((entry) => entry.timestamp || Date.now()))
      : null;
    const res = await axios.post('http://localhost:5000/api/journal/sync', {
      userEmail: safeEmail,
      encryptedConfig: safeConfig,
      encryptedData: safeData,
      entryCount: updatedEntries.length,
      lastEntryAt: latestEntryTime,
    });
    if (res.data.status !== 'Success') throw new Error('Database Error: ' + res.data.msg);
    localStorage.setItem(`journal_data_${safeEmail}`, safeData);
    return true;
  };

  const saveEntry = async () => {
    if (!newEntry.title || !newEntry.content) return showAppAlert('Please provide both a title and your thoughts.', 'error');
    try {
      let updatedEntries;
      if (editMode && selectedEntry) {
        updatedEntries = entries.map(e =>
          e.id === selectedEntry.id ? { ...e, title: newEntry.title, content: newEntry.content, mood: newEntry.mood, edited: true } : e
        );
      } else {
        updatedEntries = [{
          title: newEntry.title, content: newEntry.content, mood: newEntry.mood,
          id: Date.now(), date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          timestamp: Date.now(),
        }, ...entries];
      }
      await syncToServer(updatedEntries);
      setEntries(updatedEntries);
      setNewEntry({ title: '', content: '', mood: '🌿' });
      setEditMode(false);
      setSelectedEntry(null);
      setView('grid');
      showAppAlert(editMode ? '✏️ Entry updated.' : '🌿 Saved to your sanctuary.', 'success');
    } catch (err) { showAppAlert(err.message || 'Network Error.', 'error'); }
  };

  const deleteEntry = async (entryId) => {
    try {
      const updatedEntries = entries.filter(e => e.id !== entryId);
      await syncToServer(updatedEntries);
      setEntries(updatedEntries);
      setDeleteConfirm(null);
      setView('grid');
      showAppAlert('🗑️ Entry removed.', 'success');
    } catch (err) { showAppAlert('Could not delete entry.', 'error'); }
  };

  const openEntry = (entry) => { setSelectedEntry(entry); setView('read'); };
  const startEdit = (entry) => {
    setSelectedEntry(entry);
    setNewEntry({ title: entry.title, content: entry.content, mood: entry.mood });
    setEditMode(true);
    setView('write');
  };

  const lockJournal = () => {
    setMasterKey(null); setEntries([]); setPin(''); setSecAnswer('');
    setJournalState('locked'); setView('grid');
  };

  const resetEverything = () => {
    if (window.confirm('WARNING: Delete all data to start fresh?')) {
      localStorage.removeItem(`journal_config_${userEmail}`);
      localStorage.removeItem(`journal_data_${userEmail}`);
      setJournalState('setup'); setPin(''); setError('');
    }
  };

  // ── FILTERING ──
  const filteredEntries = useMemo(() => {
    let result = [...entries];
    const now = new Date();
    if (activeFilter === 'Today') {
      result = result.filter(e => {
        const d = new Date(e.timestamp || e.date);
        return d.toDateString() === now.toDateString();
      });
    } else if (activeFilter === 'This Week') {
      const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
      result = result.filter(e => new Date(e.timestamp || e.date) >= weekAgo);
    } else if (activeFilter === 'This Month') {
      result = result.filter(e => {
        const d = new Date(e.timestamp || e.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
    }
    if (activeMoodFilter !== 'All') result = result.filter(e => e.mood === activeMoodFilter);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(e => e.title.toLowerCase().includes(q) || e.content.toLowerCase().includes(q));
    }
    return result;
  }, [entries, activeFilter, activeMoodFilter, searchQuery]);

  // ── STATS ──
  const totalWords = entries.reduce((acc, e) => acc + (e.content.match(/\S+/g) || []).length, 0);
  const currentWordCount = (newEntry.content.match(/\S+/g) || []).length;
  const moodCounts = entries.reduce((acc, e) => { acc[e.mood] = (acc[e.mood] || 0) + 1; return acc; }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];
  const streak = (() => {
    if (!entries.length) return 0;
    const days = new Set(entries.map(e => new Date(e.timestamp || e.date).toDateString()));
    let count = 0; const now = new Date();
    while (days.has(new Date(now - count * 86400000).toDateString())) count++;
    return count;
  })();

  if (journalState === 'loading') return (
    <div className="j-wrapper">
      <div className="j-loader">
        <div className="j-loader-leaf">🌿</div>
        <p>Opening your sanctuary…</p>
      </div>
    </div>
  );

  if (journalState === 'setup' || journalState === 'locked') {
    const isSetup = journalState === 'setup';
    let displayQuestion = 'Security Question';
    if (!isSetup && userEmail) {
      const savedConfig = localStorage.getItem(`journal_config_${userEmail}`);
      if (savedConfig) {
        const q = JSON.parse(savedConfig).q;
        displayQuestion = q === 'person' ? 'Who is your favorite person?' : q === 'book' ? 'What is your favorite book?' : 'What was your most memorable day?';
      }
    }
    return (
      <div className="j-wrapper">
        <div className="j-auth-bg">
          {[...Array(6)].map((_, i) => <div key={i} className={`j-leaf j-leaf-${i + 1}`}>🍃</div>)}
        </div>
        <motion.div className="j-auth-card" initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.5, ease: 'easeOut' }}>
          <div className="j-auth-emblem">
            <span>🌿</span>
          </div>
          <h1 className="j-auth-brand">The Serene Path</h1>
          <p className="j-auth-tagline">{isSetup ? 'Create your private sanctuary' : 'Welcome back. Your thoughts await.'}</p>
          {error && <motion.div className="j-error" initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}>{error}</motion.div>}
          {isSetup ? (
            <form onSubmit={handleSetup} className="j-form">
              <div className="j-input-group">
                <label>Create PIN</label>
                <input type="password" placeholder="Min. 4 characters" className="j-input" value={pin} onChange={e => setPin(e.target.value)} />
              </div>
              <div className="j-input-group">
                <label>Confirm PIN</label>
                <input type="password" placeholder="Repeat your PIN" className="j-input" value={confirmPin} onChange={e => setConfirmPin(e.target.value)} />
              </div>
              <div className="j-input-group">
                <label>Recovery Question</label>
                <select className="j-input" value={secQuestion} onChange={e => setSecQuestion(e.target.value)}>
                  <option value="person">Who is your favorite person?</option>
                  <option value="book">What is your favorite book?</option>
                  <option value="day">What was your most memorable day?</option>
                </select>
              </div>
              <div className="j-input-group">
                <label>Your Answer</label>
                <input type="text" placeholder="Case insensitive" className="j-input" value={secAnswer} onChange={e => setSecAnswer(e.target.value)} />
              </div>
              <button type="submit" className="j-btn-primary">Initialize Sanctuary →</button>
            </form>
          ) : (
            <div className="j-form">
              <div className="j-input-group">
                <label>Enter PIN</label>
                <input type="password" placeholder="Your secret PIN" className="j-input" value={pin} onChange={e => setPin(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleUnlock(e, 'pin')} />
              </div>
              <button onClick={(e) => handleUnlock(e, 'pin')} className="j-btn-primary">Unlock Sanctuary →</button>
              <div className="j-divider"><span>or recover with</span></div>
              <div className="j-input-group">
                <label>{displayQuestion}</label>
                <input type="text" placeholder="Your answer" className="j-input" value={secAnswer} onChange={e => setSecAnswer(e.target.value)} />
              </div>
              <button onClick={(e) => handleUnlock(e, 'ans')} className="j-btn-secondary">Unlock with Answer</button>
              <button onClick={resetEverything} className="j-reset-btn">Data corrupted? Hard reset.</button>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className={`j-app-container ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>

      {/* SIDEBAR */}
      <aside className="j-sidebar">
        <div className="j-brand">
          <span className="j-logo-icon">🌿</span>
          <h2>The Serene Path</h2>
        </div>

        <div className="j-sidebar-stats">
          <div className="j-stat-pill">
            <span className="j-stat-num">{entries.length}</span>
            <span className="j-stat-label">Entries</span>
          </div>
          <div className="j-stat-pill">
            <span className="j-stat-num">{streak}</span>
            <span className="j-stat-label">Day Streak</span>
          </div>
          <div className="j-stat-pill">
            <span className="j-stat-num">{topMood ? topMood[0] : '🌿'}</span>
            <span className="j-stat-label">Top Mood</span>
          </div>
        </div>

        <nav className="j-nav">
          <p className="j-nav-label">Navigate</p>
          <button className={`j-nav-item ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>
            <span className="nav-icon">📚</span> Library
          </button>
          <button className={`j-nav-item ${view === 'write' && !editMode ? 'active' : ''}`} onClick={() => { setEditMode(false); setNewEntry({ title: '', content: '', mood: '🌿' }); setView('write'); }}>
            <span className="nav-icon">✍️</span> New Entry
          </button>
        </nav>

        <div className="j-nav-mood-filter">
          <p className="j-nav-label">Filter by Mood</p>
          <div className="j-mood-filter-row">
            <button className={`j-mood-filter-btn ${activeMoodFilter === 'All' ? 'active' : ''}`} onClick={() => setActiveMoodFilter('All')}>All</button>
            {MOODS.map(m => (
              <button key={m.emoji} className={`j-mood-filter-btn ${activeMoodFilter === m.emoji ? 'active' : ''}`} onClick={() => setActiveMoodFilter(m.emoji)} title={m.label}>{m.emoji}</button>
            ))}
          </div>
        </div>

        <div className="j-sidebar-footer">
          <button className="j-btn-primary j-full-width" onClick={() => { setEditMode(false); setNewEntry({ title: '', content: '', mood: '🌿' }); setView('write'); }}>
            + New Entry
          </button>
          <button className="j-lock-btn" onClick={lockJournal}>🔒 Lock Vault</button>
        </div>
      </aside>

      {/* MAIN */}
      <main className="j-main">

        {/* Alert Toast */}
        <AnimatePresence>
          {appAlert.msg && (
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className={`j-alert j-alert-${appAlert.type}`}>
              {appAlert.msg}
            </motion.div>
          )}
        </AnimatePresence>

        {/* DELETE CONFIRM MODAL */}
        <AnimatePresence>
          {deleteConfirm && (
            <motion.div className="j-modal-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteConfirm(null)}>
              <motion.div className="j-modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} onClick={e => e.stopPropagation()}>
                <div className="j-modal-icon">🗑️</div>
                <h3>Delete this entry?</h3>
                <p>This is permanent and cannot be undone.</p>
                <div className="j-modal-actions">
                  <button className="j-btn-secondary" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                  <button className="j-btn-danger" onClick={() => deleteEntry(deleteConfirm)}>Delete</button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── GRID VIEW ── */}
        {view === 'grid' && (
          <motion.div className="j-content-wrapper" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <header className="j-header">
              <div>
                <h1>{greeting}.</h1>
                <p className="j-subtitle">Your private sanctuary awaits.</p>
              </div>
              <button className="j-btn-primary j-header-cta" onClick={() => { setEditMode(false); setNewEntry({ title: '', content: '', mood: '🌿' }); setView('write'); }}>
                ✍️ Write Today
              </button>
            </header>

            {/* Insights */}
            <div className="j-insights-row">
              <div className="j-insight-card">
                <span className="j-insight-icon">📖</span>
                <div><strong>{entries.length}</strong><span>Entries</span></div>
              </div>
              <div className="j-insight-card">
                <span className="j-insight-icon">🔤</span>
                <div><strong>{totalWords.toLocaleString()}</strong><span>Words Written</span></div>
              </div>
              <div className="j-insight-card">
                <span className="j-insight-icon">🔥</span>
                <div><strong>{streak} day{streak !== 1 ? 's' : ''}</strong><span>Writing Streak</span></div>
              </div>
              <div className="j-insight-card">
                <span className="j-insight-icon">🎭</span>
                <div><strong>{topMood ? `${topMood[0]} ${topMood[1]}×` : '–'}</strong><span>Top Mood</span></div>
              </div>
            </div>

            {/* Search + Filters */}
            <div className="j-filter-bar">
              <div className="j-search-wrap">
                <span className="j-search-icon">🔍</span>
                <input className="j-search" placeholder="Search your thoughts…" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                {searchQuery && <button className="j-search-clear" onClick={() => setSearchQuery('')}>✕</button>}
              </div>
              <div className="j-period-filters">
                {FILTERS.map(f => (
                  <button key={f} className={`j-period-btn ${activeFilter === f ? 'active' : ''}`} onClick={() => setActiveFilter(f)}>{f}</button>
                ))}
              </div>
            </div>

            <div className="j-section-header">
              <h2 className="j-section-title">{activeFilter === 'All' ? 'All Entries' : activeFilter}</h2>
              <span className="j-entry-count">{filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}</span>
            </div>

            <div className="j-grid">
              {filteredEntries.length === 0 ? (
                <div className="j-empty-state">
                  <div className="j-empty-icon">🌱</div>
                  <p>{searchQuery ? 'No entries match your search.' : 'Your desk is clear. Begin writing.'}</p>
                </div>
              ) : filteredEntries.map((entry, i) => (
                <motion.div
                  key={entry.id}
                  className="j-card"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  onClick={() => openEntry(entry)}
                >
                  <div className="j-card-top">
                    <span className="j-mood-pill">{entry.mood}</span>
                    <div className="j-card-actions" onClick={e => e.stopPropagation()}>
                      <button className="j-card-action-btn" title="Edit" onClick={() => startEdit(entry)}>✏️</button>
                      <button className="j-card-action-btn danger" title="Delete" onClick={() => setDeleteConfirm(entry.id)}>🗑️</button>
                    </div>
                  </div>
                  <h3 className="j-card-title">{entry.title}</h3>
                  <p className="j-card-preview">{entry.content.substring(0, 110)}{entry.content.length > 110 ? '…' : ''}</p>
                  <div className="j-card-footer">
                    <span className="j-card-date">{entry.date}</span>
                    {entry.edited && <span className="j-edited-badge">edited</span>}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── WRITE / EDIT VIEW ── */}
        {view === 'write' && (
          <motion.div className="j-document-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="j-document-toolbar">
              <button className="j-btn-text" onClick={() => { setView('grid'); setEditMode(false); setNewEntry({ title: '', content: '', mood: '🌿' }); }}>← Back to Library</button>
              <div className="j-toolbar-right">
                <div className="j-word-count">{currentWordCount} words</div>
              </div>
            </div>

            <div className="j-editor-card">
              <div className="j-editor-date">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
              {editMode && <div className="j-editing-badge">✏️ Editing entry</div>}

              <input type="text" placeholder="Give this moment a title…" className="j-edit-title"
                value={newEntry.title} onChange={e => setNewEntry({ ...newEntry, title: e.target.value })} />

              <div className="j-mood-picker">
                <span className="j-mood-label">How are you feeling?</span>
                <div className="j-mood-options">
                  {MOODS.map(m => (
                    <button key={m.emoji} title={m.label} className={`j-mood-btn ${newEntry.mood === m.emoji ? 'selected' : ''}`}
                      onClick={() => setNewEntry({ ...newEntry, mood: m.emoji })}>{m.emoji}</button>
                  ))}
                </div>
              </div>

              <textarea
                placeholder="Your words are encrypted. This is your space to be completely honest…"
                className="j-edit-content"
                value={newEntry.content}
                onChange={e => setNewEntry({ ...newEntry, content: e.target.value })}
              />

              <div className="j-edit-actions">
                <button className="j-btn-secondary" onClick={() => { setView('grid'); setEditMode(false); }}>Cancel</button>
                <button className="j-btn-primary" onClick={saveEntry}>{editMode ? '💾 Save Changes' : '🌿 Secure & Save'}</button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── READ VIEW ── */}
        {view === 'read' && selectedEntry && (
          <motion.div className="j-document-wrapper" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="j-document-toolbar">
              <button className="j-btn-text" onClick={() => setView('grid')}>← Back to Library</button>
              <div className="j-toolbar-right">
                <button className="j-toolbar-btn" onClick={() => startEdit(selectedEntry)}>✏️ Edit</button>
                <button className="j-toolbar-btn danger" onClick={() => setDeleteConfirm(selectedEntry.id)}>🗑️ Delete</button>
              </div>
            </div>

            <div className="j-editor-card j-read-card">
              <div className="j-read-meta">
                <span className="j-read-mood">{selectedEntry.mood}</span>
                <span className="j-read-date">{selectedEntry.date}</span>
                {selectedEntry.edited && <span className="j-edited-badge">edited</span>}
              </div>
              <h1 className="j-read-title">{selectedEntry.title}</h1>
              <div className="j-read-divider" />
              <div className="j-read-content">{selectedEntry.content}</div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Journal;
