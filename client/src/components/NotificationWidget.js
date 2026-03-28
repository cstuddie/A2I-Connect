import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell, FaEnvelope, FaComment, FaCalendarAlt } from 'react-icons/fa';
import './Notifications.css';

const TYPE_ICONS = {
  message_request:  <FaEnvelope size={16} />,
  incoming_message: <FaComment size={16} />,
  event_update:     <FaCalendarAlt size={16} />,
  session_reminder: <FaBell size={16} />,
};

function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins < 1)   return 'just now';
  if (mins < 60)  return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

export default function NotificationWidget() {
  const userID = localStorage.getItem('userID');
  const token  = localStorage.getItem('token');

  const [unreadCount,   setUnreadCount]   = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [loading,       setLoading]       = useState(false);

  const dropdownRef = useRef(null);
  const navigate    = useNavigate();

  const authHeaders = { Authorization: `Bearer ${token}` };

  // ── Polling: unread count every 30 seconds ──────────────────────────────
  const pollCount = useCallback(() => {
    if (!userID || !token) return;
    fetch(`http://localhost:3001/notifications/${userID}/unread-count`, {
      headers: authHeaders,
    })
      .then((r) => r.json())
      .then((data) => setUnreadCount(data.count ?? 0))
      .catch(() => {});
  }, [userID, token]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    pollCount();
    const id = setInterval(pollCount, 30_000);
    return () => clearInterval(id);
  }, [pollCount]);

  // ── Fetch notification list when dropdown opens ─────────────────────────
  const fetchList = useCallback(() => {
    if (!userID || !token) return;
    setLoading(true);
    fetch(`http://localhost:3001/notifications/${userID}?limit=10`, {
      headers: authHeaders,
    })
      .then((r) => r.json())
      .then((data) => setNotifications(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [userID, token]); // eslint-disable-line react-hooks/exhaustive-deps

  const openDropdown = () => {
    setDropdownOpen(true);
    fetchList();
  };

  const closeDropdown = () => setDropdownOpen(false);

  // ── Mark single notification as read ────────────────────────────────────
  const handleItemClick = async (notification) => {
    if (!notification.IsRead) {
      try {
        await fetch(
          `http://localhost:3001/notifications/${notification.ID}/read`,
          { method: 'PATCH', headers: authHeaders }
        );
        setNotifications((prev) =>
          prev.map((n) => (n.ID === notification.ID ? { ...n, IsRead: true } : n))
        );
        setUnreadCount((c) => Math.max(0, c - 1));
      } catch (_) {}
    }

    if (notification.RelatedEventID) {
      navigate(`/events/${notification.RelatedEventID}`);
    } else {
      navigate('/Notifications');
    }
    setDropdownOpen(false);
  };

  // ── Mark all as read ─────────────────────────────────────────────────────
  const markAllRead = async (e) => {
    e.stopPropagation();
    try {
      await fetch(
        `http://localhost:3001/notifications/${userID}/read-all`,
        { method: 'PATCH', headers: authHeaders }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, IsRead: true })));
      setUnreadCount(0);
    } catch (_) {}
  };

  if (!userID) return null;

  return (
    <div
      className="notification-widget"
      onMouseEnter={openDropdown}
      onMouseLeave={closeDropdown}
      ref={dropdownRef}
    >
      <div className="notification-icon-wrapper">
        <FaBell size={22} color="#0B3444" />
        {unreadCount > 0 && (
          <Badge pill bg="danger" className="notification-badge">
            {unreadCount > 99 ? '99+' : unreadCount}
          </Badge>
        )}
      </div>

      {dropdownOpen && (
        <div className="notification-dropdown">
          <div className="notification-dropdown-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead}>Mark all read</button>
            )}
          </div>

          <div className="notification-dropdown-body">
            {loading && (
              <div className="notification-dropdown-empty">Loading…</div>
            )}
            {!loading && notifications.length === 0 && (
              <div className="notification-dropdown-empty">No notifications yet</div>
            )}
            {!loading &&
              notifications.map((n) => (
                <div
                  key={n.ID}
                  className={`notification-item${n.IsRead ? '' : ' unread'}`}
                  onClick={() => handleItemClick(n)}
                >
                  <span className="notification-item-icon">
                    {TYPE_ICONS[n.Type] || <FaBell size={16} />}
                  </span>
                  <div className="notification-item-content">
                    <div className="notification-item-title">{n.Title}</div>
                    <div className="notification-item-body">{n.Body}</div>
                  </div>
                  <div className="notification-item-time">
                    {relativeTime(n.CreatedAt)}
                  </div>
                  {!n.IsRead && <div className="unread-dot" />}
                </div>
              ))}
          </div>

          <div className="notification-dropdown-footer">
            <Link to="/Notifications" onClick={() => setDropdownOpen(false)}>
              See all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
