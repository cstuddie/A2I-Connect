import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import { relativeTime, getTypeIcon } from '../utils/notificationHelpers';
import './Notifications.css';

export default function NotificationWidget() {
  const userID = localStorage.getItem('userID');
  const token  = localStorage.getItem('token');

  const [unreadCount,   setUnreadCount]   = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen,  setDropdownOpen]  = useState(false);
  const [loading,       setLoading]       = useState(false);

  const navigate   = useNavigate();
  const widgetRef  = useRef(null);

  const authHeaders = { Authorization: `Bearer ${token}` };

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

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (widgetRef.current && !widgetRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  const toggleDropdown = () => {
    if (!dropdownOpen) fetchList();
    setDropdownOpen((prev) => !prev);
  };

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
      ref={widgetRef}
    >
      <div className="notification-icon-wrapper" onClick={toggleDropdown} style={{ cursor: 'pointer' }}>
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
                    {getTypeIcon(n.Type, 16)}
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
