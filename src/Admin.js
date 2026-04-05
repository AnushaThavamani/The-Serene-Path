import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Activity,
  ArrowLeft,
  BookOpenText,
  ChartNoAxesCombined,
  LogIn,
  MessageSquareHeart,
  RefreshCw,
  ShieldCheck,
  Users,
} from 'lucide-react';
import './Admin.css';

const tabs = ['Overview', 'User Activity', 'Feedback'];

const moodLabelMap = {
  '🌿': 'Calm',
  '☀️': 'Joy',
  '😔': 'Healing',
  '😴': 'Rest',
  '❤️': 'Gratitude',
};

const Admin = () => {
  const navigate = useNavigate();
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('user')) || null;
    } catch (error) {
      return null;
    }
  }, []);

  const [activeTab, setActiveTab] = useState('Overview');
  const [overview, setOverview] = useState(null);
  const [feedbackList, setFeedbackList] = useState([]);
  const [activityList, setActivityList] = useState([]);
  const [state, setState] = useState({ loading: true, error: '', refreshing: false });

  const fetchAdminData = useCallback(async (mode = 'initial') => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.role !== 'admin') {
      setState({ loading: false, error: 'Access denied. Admin role is required.', refreshing: false });
      return;
    }

    setState((current) => ({
      ...current,
      loading: mode === 'initial',
      refreshing: mode === 'refresh',
      error: '',
    }));

    try {
      const query = `email=${encodeURIComponent(user.email)}`;
      const [overviewRes, feedbackRes, activityRes] = await Promise.all([
        fetch(`http://localhost:5000/api/admin/overview?${query}`),
        fetch(`http://localhost:5000/api/admin/feedback?${query}`),
        fetch(`http://localhost:5000/api/admin/activity?${query}`),
      ]);

      const [overviewData, feedbackData, activityData] = await Promise.all([
        overviewRes.json(),
        feedbackRes.json(),
        activityRes.json(),
      ]);

      if (
        overviewData.status !== 'Success' ||
        feedbackData.status !== 'Success' ||
        activityData.status !== 'Success'
      ) {
        throw new Error(overviewData.msg || feedbackData.msg || activityData.msg || 'Unable to load administrative data.');
      }

      setOverview(overviewData.overview);
      setFeedbackList(feedbackData.feedback);
      setActivityList(activityData.activity);
      setState({ loading: false, error: '', refreshing: false });
    } catch (error) {
      setState({
        loading: false,
        error: error.message || 'Failed to load administrative data.',
        refreshing: false,
      });
    }
  }, [navigate, user]);

  useEffect(() => {
    fetchAdminData();
  }, [fetchAdminData]);

  const formatDate = (value) => {
    if (!value) return 'Not available';
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return 'Not available';
    return parsed.toLocaleString();
  };

  const getTopMood = (distribution = {}) => {
    const entries = Object.entries(distribution);
    if (!entries.length) return 'No mood logs';
    const [mood, count] = entries.sort((a, b) => b[1] - a[1])[0];
    return `${mood} ${moodLabelMap[mood] || 'Mood'} (${count})`.trim();
  };

  if (state.loading) {
    return <div className="admin-loading-screen">Loading The Serene Path admin console...</div>;
  }

  if (state.error) {
    return (
      <div className="admin-page">
        <div className="admin-empty-card">
          <h1>The Serene Path Admin Console</h1>
          <p>{state.error}</p>
          <button type="button" className="admin-primary-btn" onClick={() => navigate('/dashboard')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-backdrop-blur admin-backdrop-one" />
      <div className="admin-backdrop-blur admin-backdrop-two" />

      <div className="admin-shell">
        <section className="admin-hero">
          <div className="admin-hero-copy">
            <button type="button" className="admin-back" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={16} /> Back to Dashboard
            </button>
            <p className="admin-kicker">The Serene Path Admin</p>
            <h1>Monitor platform health with privacy preserved.</h1>
            <p className="admin-lead">
              Review member activity, journal counts, mood patterns, and feedback in one secure, read-only workspace.
            </p>
            <div className="admin-hero-actions">
              <button type="button" className="admin-primary-btn" onClick={() => fetchAdminData('refresh')}>
                <RefreshCw size={16} className={state.refreshing ? 'spin' : ''} /> Refresh Data
              </button>
              <div className="admin-admin-chip">
                <ShieldCheck size={16} />
                <span>{user?.fullName || user?.email}</span>
              </div>
            </div>
          </div>

          <div className="admin-hero-image">
            <div className="admin-hero-overlay" />
            <img
              src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop"
              alt="Serene mountain lake"
            />
            <div className="admin-hero-caption">
              Read-only oversight for The Serene Path.
            </div>
          </div>
        </section>

        <section className="admin-tab-bar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              className={`admin-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </section>

        {activeTab === 'Overview' && (
          <section className="admin-content-stack">
            <div className="admin-stat-grid">
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><Users size={20} /></div>
                <span>Users</span>
                <strong>{overview?.totalUsers ?? 0}</strong>
              </article>
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><BookOpenText size={20} /></div>
                <span>Journal Vaults</span>
                <strong>{overview?.totalJournals ?? 0}</strong>
              </article>
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><Activity size={20} /></div>
                <span>Mood Logs</span>
                <strong>{overview?.totalMoodLogs ?? 0}</strong>
              </article>
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><LogIn size={20} /></div>
                <span>Total Logins</span>
                <strong>{overview?.totalLogins ?? 0}</strong>
              </article>
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><MessageSquareHeart size={20} /></div>
                <span>Feedback</span>
                <strong>{overview?.totalFeedback ?? 0}</strong>
              </article>
              <article className="admin-stat-card">
                <div className="admin-stat-icon"><ChartNoAxesCombined size={20} /></div>
                <span>Avg Rating</span>
                <strong>{overview?.avgRating ?? 'N/A'}</strong>
              </article>
            </div>

            <div className="admin-two-column">
              <article className="admin-panel-card">
                <div className="admin-panel-head">
                  <h2>Mood Distribution</h2>
                  <span>Recorded mood activity</span>
                </div>
                <div className="admin-pill-wrap">
                  {(overview?.moodDistribution || []).length ? (
                    overview.moodDistribution.map((item) => (
                      <div key={item._id} className="admin-mood-pill">
                        <span className="admin-mood-emoji">{item._id}</span>
                        <div>
                          <strong>{item.count}</strong>
                          <span>{moodLabelMap[item._id] || 'Mood activity'}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="admin-empty-inline">No mood activity has been recorded yet.</div>
                  )}
                </div>
              </article>

              <article className="admin-panel-card admin-safety-card">
                <div className="admin-panel-head">
                  <h2>Safety Model</h2>
                  <span>Access boundaries</span>
                </div>
                <ul className="admin-safe-list">
                  <li>Includes logins, mood activity, journal entry counts, and feedback analytics.</li>
                  <li>Shows only profile details already provided during registration.</li>
                  <li>Encrypted journal titles and journal content are never shown here.</li>
                  <li>Follows the same controlled sign-in flow used across The Serene Path.</li>
                </ul>
              </article>
            </div>
          </section>
        )}

        {activeTab === 'User Activity' && (
          <section className="admin-content-stack">
            <article className="admin-panel-card">
              <div className="admin-panel-head">
                  <h2>User Activity</h2>
                <span>{activityList.length} member records</span>
              </div>

              <div className="admin-table-wrap">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Logins</th>
                      <th>Journal Entries</th>
                      <th>Mood Logs</th>
                      <th>Top Mood</th>
                      <th>Feedback</th>
                      <th>Last Login</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activityList.map((item) => (
                      <tr key={item.email}>
                        <td>
                          <div className="admin-user-cell">
                            <strong>{item.fullName}</strong>
                            <span>{item.profession || 'Community Member'}</span>
                          </div>
                        </td>
                        <td>{item.email}</td>
                        <td>{item.loginCount}</td>
                        <td>{item.journalEntryCount}</td>
                        <td>{item.totalMoodLogs}</td>
                        <td>{getTopMood(item.moodDistribution)}</td>
                        <td>
                          {item.feedbackCount}
                          {item.avgFeedbackRating ? ` (${item.avgFeedbackRating}/5)` : ''}
                        </td>
                        <td>{formatDate(item.lastLoginAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </article>

            <div className="admin-activity-grid">
              {activityList.map((item) => (
                <article key={`${item.email}-detail`} className="admin-activity-card">
                  <div className="admin-panel-head">
                    <h3>{item.fullName}</h3>
                    <span>{item.email}</span>
                  </div>
                  <div className="admin-activity-meta">
                    <span>Joined The Serene Path: {formatDate(item.joinedDate)}</span>
                    <span>Most recent journal sync: {formatDate(item.lastJournalAt)}</span>
                    <span>Most recent mood activity: {formatDate(item.lastMoodAt)}</span>
                    <span>Most recent feedback: {formatDate(item.lastFeedbackAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {activeTab === 'Feedback' && (
          <section className="admin-content-stack">
            <article className="admin-panel-card">
              <div className="admin-panel-head">
                <h2>Recent Feedback</h2>
                <span>{feedbackList.length} responses</span>
              </div>

              {feedbackList.length === 0 ? (
                <div className="admin-empty-inline">No feedback has been submitted to The Serene Path yet.</div>
              ) : (
                <div className="admin-feedback-grid">
                  {feedbackList.map((item) => (
                    <div key={item._id} className="admin-feedback-card">
                      <div className="admin-feedback-top">
                        <div>
                          <strong>{item.userName || item.userEmail || 'Anonymous'}</strong>
                          <span>{item.userEmail || 'Email not provided'}</span>
                        </div>
                        <div className="admin-feedback-rating">{item.rating}/5</div>
                      </div>
                      <div className="admin-feedback-badges">
                        <span className="admin-badge">{item.category}</span>
                        <span className="admin-badge muted">{item.subject || 'General Feedback'}</span>
                      </div>
                      <p>{item.message}</p>
                      <div className="admin-feedback-date">{formatDate(item.createdAt)}</div>
                    </div>
                  ))}
                </div>
              )}
            </article>
          </section>
        )}
      </div>
    </div>
  );
};

export default Admin;
