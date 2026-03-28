import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaComment, FaCalendarAlt } from 'react-icons/fa';
import { UserHeader } from './Dashboard';
import './Notifications.css';

const TYPE_ICONS = {
  message_request:  <FaEnvelope size={18} />,
  incoming_message: <FaComment size={18} />,
  event_update:     <FaCalendarAlt size={18} />,
  session_reminder: <FaBell size={18} />,
};

const LEAD_HOUR_OPTIONS = [
  { value: 1,  label: '1 hour before' },
  { value: 3,  label: '3 hours before' },
  { value: 6,  label: '6 hours before' },
  { value: 12, label: '12 hours before' },
  { value: 24, label: '24 hours before (default)' },
  { value: 48, label: '48 hours before' },
];

function relativeTime(dateStr) {
  const diff  = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationsPage() {
  const userID   = localStorage.getItem('userID');
  const token    = localStorage.getItem('token');
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [activeTab,     setActiveTab]     = useState('all');
  const [loading,       setLoading]       = useState(false);

  // Preferences state
  const [prefs,        setPrefs]        = useState(null);
  const [prefSaving,   setPrefSaving]   = useState(false);
  const [prefSavedMsg, setPrefSavedMsg] = useState('');

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (!userID || !token) {
      navigate('/login');
      return;
    }
    fetchNotifications();
    fetchPreferences();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchNotifications = useCallback(() => {
    setLoading(true);
    fetch(`http://localhost:3001/notifications/${userID}?limit=50`, {
      headers: authHeaders,
    })
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userID, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchPreferences = useCallback(() => {
    fetch(`http://localhost:3001/notifications/${userID}/preferences`, {
      headers: authHeaders,
    })
      .then((r) => r.json())
      .then((data) => setPrefs(data))
      .catch(() => {});
  }, [userID, token]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Mark single read ─────────────────────────────────────────────────────
  const markRead = async (notificationID) => {
    try {
      await fetch(`http://localhost:3001/notifications/${notificationID}/read`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      setNotifications((prev) =>
        prev.map((n) => (n.ID === notificationID ? { ...n, IsRead: true } : n))
      );
    } catch (_) {}
  };

  // ── Mark all read ─────────────────────────────────────────────────────────
  const markAllRead = async () => {
    try {
      await fetch(`http://localhost:3001/notifications/${userID}/read-all`, {
        method: 'PATCH',
        headers: authHeaders,
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
    } catch (_) {}
  };

  // ── Save preferences ─────────────────────────────────────────────────────
  const savePreferences = async (e) => {
    e.preventDefault();
    setPrefSaving(true);
    setPrefSavedMsg('');
    try {
      const res = await fetch(`http://localhost:3001/notifications/${userID}/preferences`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          ...prefs,
          ReminderLeadHours: parseInt(prefs.ReminderLeadHours, 10),
        }),
      });
      if (res.ok) {
        setPrefSavedMsg('Preferences saved.');
        setTimeout(() => setPrefSavedMsg(''), 3000);
      }
    } catch (_) {}
    finally {
      setPrefSaving(false);
    }
  };

  const handlePrefChange = (field, value) => {
    setPrefs((prev) => ({ ...prev, [field]: value }));
  };

  // ── Filter notifications by tab ──────────────────────────────────────────
  const displayed = activeTab === 'unread'
    ? notifications.filter((n) => !n.IsRead)
    : notifications;

  const unreadCount = notifications.filter((n) => !n.IsRead).length;

  return (
    <div className="notifications-page">
      <UserHeader name="" />

      <Container className="notifications-page-body">
        <Row>
          {/* ── Preferences sidebar ────────────────────────────────────── */}
          <Col sm={12} md={3} className="mb-4 mb-md-0">
            <div className="notifications-sidebar">
              <h5>Notification Settings</h5>

              {prefs ? (
                <Form onSubmit={savePreferences}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                      Notify me about
                    </Form.Label>
                    {[
                      { key: 'NotifyMessageRequest',  label: 'Message requests' },
                      { key: 'NotifyIncomingMessage',  label: 'New messages' },
                      { key: 'NotifyEventUpdate',      label: 'Session updates' },
                      { key: 'NotifySessionReminder',  label: 'Session reminders' },
                    ].map(({ key, label }) => (
                      <Form.Check
                        key={key}
                        type="checkbox"
                        id={`pref-${key}`}
                        label={label}
                        checked={!!prefs[key]}
                        onChange={(e) => handlePrefChange(key, e.target.checked)}
                        className="mb-1"
                        style={{ fontSize: '0.85rem' }}
                      />
                    ))}
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold" style={{ fontSize: '0.85rem' }}>
                      Session reminder timing
                    </Form.Label>
                    <Form.Select
                      size="sm"
                      value={prefs.ReminderLeadHours}
                      onChange={(e) =>
                        handlePrefChange('ReminderLeadHours', parseInt(e.target.value, 10))
                      }
                      disabled={!prefs.NotifySessionReminder}
                    >
                      {LEAD_HOUR_OPTIONS.map(({ value, label }) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Button
                    type="submit"
                    size="sm"
                    style={{ backgroundColor: '#0B3444', borderColor: '#0B3444' }}
                    disabled={prefSaving}
                  >
                    {prefSaving ? 'Saving…' : 'Save'}
                  </Button>

                  {prefSavedMsg && (
                    <div className="pref-save-msg">{prefSavedMsg}</div>
                  )}
                </Form>
              ) : (
                <p style={{ fontSize: '0.85rem', color: '#888' }}>Loading settings…</p>
              )}
            </div>
          </Col>

          {/* ── Notifications list ─────────────────────────────────────── */}
          <Col sm={12} md={9}>
            <div className="notifications-list-panel">
              <div className="notifications-list-header">
                <h5>
                  Notifications
                  {unreadCount > 0 && (
                    <span
                      style={{
                        marginLeft: 8,
                        fontSize: '0.8rem',
                        background: '#0B3444',
                        color: '#fff',
                        borderRadius: 12,
                        padding: '2px 8px',
                      }}
                    >
                      {unreadCount} unread
                    </span>
                  )}
                </h5>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div className="notifications-tabs">
                    <button
                      className={activeTab === 'all' ? 'active' : ''}
                      onClick={() => setActiveTab('all')}
                    >
                      All
                    </button>
                    <button
                      className={activeTab === 'unread' ? 'active' : ''}
                      onClick={() => setActiveTab('unread')}
                    >
                      Unread
                    </button>
                  </div>

                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      style={{
                        background: 'none',
                        border: 'none',
                        fontSize: '0.8rem',
                        color: '#0B3444',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        padding: 0,
                      }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
              </div>

              {loading && (
                <div className="notifications-empty">Loading notifications…</div>
              )}

              {!loading && displayed.length === 0 && (
                <div className="notifications-empty">
                  {activeTab === 'unread' ? 'No unread notifications.' : 'No notifications yet.'}
                </div>
              )}

              {!loading &&
                displayed.map((n) => (
                  <div
                    key={n.ID}
                    className={`notification-row${n.IsRead ? '' : ' unread'}`}
                  >
                    <span className="notification-row-icon">
                      {TYPE_ICONS[n.Type] || <FaBell size={18} />}
                    </span>

                    <div className="notification-row-content">
                      <div className="notification-row-title">{n.Title}</div>
                      <div className="notification-row-body">{n.Body}</div>
                      <div className="notification-row-time">{relativeTime(n.CreatedAt)}</div>
                    </div>

                    <div className="notification-row-actions">
                      {n.RelatedEventID && (
                        <Button
                          size="sm"
                          variant="outline-secondary"
                          style={{ fontSize: '0.75rem' }}
                          onClick={() => navigate(`/events/${n.RelatedEventID}`)}
                        >
                          View
                        </Button>
                      )}
                      {!n.IsRead && (
                        <Button
                          size="sm"
                          variant="outline-primary"
                          style={{
                            fontSize: '0.75rem',
                            borderColor: '#0B3444',
                            color: '#0B3444',
                          }}
                          onClick={() => markRead(n.ID)}
                        >
                          Mark read
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
