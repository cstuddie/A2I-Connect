import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaUserCircle, FaSearch, FaEnvelope, FaChevronDown, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { formatLocalDate } from '../utils/dateUtils';
import useTranslation from '../utils/useTranslation';
import NotificationWidget from './NotificationWidget';
import "./LandingPage.css";
import "./Dashboard.css";

export function UserHeader() {
  const t = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searching, setSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    localStorage.removeItem('preferredLanguage');
    window.location.href = '/login';
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    try {
      setSearching(true);
      const response = await fetch(`http://localhost:3001/users/search?q=${query}`);
      const data = await response.json();
      setSearchResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setSearching(false);
    }
  };

  const handleResultClick = (userId) => {
    setShowResults(false);
    setSearchQuery('');
    navigate(`/profile/${userId}`);
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="dash-nav">
      {/* Left: Logo + Nav Links */}
      <div className="dash-nav-left">
        <Link to="/Dashboard" className="nav-logo">A2I Connect</Link>
        <div className="dash-nav-links">
          <Link to="/Dashboard" className="dash-nav-link">{t.home}</Link>
          <Link to="/Calendar" className="dash-nav-link">{t.calendar}</Link>
          <Link to="/RequestSpeaker" className="dash-nav-link">{t.requestSpeaker}</Link>
          <Link to="/Search" className="dash-nav-link">{t.browseEvents}</Link>
        </div>
      </div>

      {/* Center: Search */}
      <div className="dash-search-wrapper">
        <FaSearch className="dash-search-icon" />
        <input
          type="search"
          placeholder={t.searchUsers}
          className="dash-search-input"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {showResults && (
          <div className="dash-search-results">
            {searching && <div className="dash-search-item muted">Searching...</div>}
            {!searching && searchResults.length === 0 && (
              <div className="dash-search-item muted">No users found</div>
            )}
            {!searching && searchResults.map(user => (
              <div key={user.ID} className="dash-search-item" onClick={() => handleResultClick(user.ID)}>
                <div className="dash-search-name">{user.FirstName} {user.LastName}</div>
                {user.Affiliation && (
                  <div className="dash-search-sub">{user.Affiliation}{user.Email ? ` • ${user.Email}` : ''}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Icons + Avatar */}
      <div className="dash-nav-right">
        <Link to="/Inbox" className="dash-icon-btn" title="Inbox">
          <FaEnvelope size={18} />
        </Link>
        <NotificationWidget />
        <div className="dash-avatar-wrapper" ref={dropdownRef}>
          <button className="dash-avatar-btn" onClick={() => setDropdownOpen(o => !o)}>
            <FaUserCircle size={30} />
            <FaChevronDown size={11} />
          </button>
          {dropdownOpen && (
            <div className="dash-dropdown">
              <Link to="/EditProfile" className="dash-dropdown-item" onClick={() => setDropdownOpen(false)}>
                <FaUserEdit size={14} />
                {t.account}
              </Link>
              <div className="dash-dropdown-divider" />
              <button className="dash-dropdown-item danger" onClick={handleLogout}>
                <FaSignOutAlt size={14} />
                {t.logout}
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export function EventCard({ eventID, topic, instructor, requester, date, course }) {
  const t = useTranslation();
  return (
    <Link to={`/events/${eventID}`} className="event-card">
      <div className="event-card-topic">{topic}</div>
      <div className="event-card-meta">
        <span className="event-meta-label">{t.instructor}</span>
        <span className="event-meta-value">{instructor}</span>
      </div>
      <div className="event-card-meta">
        <span className="event-meta-label">{t.requester}</span>
        <span className="event-meta-value">{requester}</span>
      </div>
      <div className="event-card-meta">
        <span className="event-meta-label">{t.course}</span>
        <span className="event-meta-value">{course}</span>
      </div>
      <div className="event-card-footer">
        <span className="event-date">{formatLocalDate(date)}</span>
      </div>
    </Link>
  );
}

const InterestTag = ({ title }) => (
  <span className="interest-tag">{title}</span>
);

const Dashboard = () => {
  const t = useTranslation();
  const userID = localStorage.getItem('userID') || 2;

  const [profileInfo, setProfileInfo] = useState({ name: 'Profile', interests: '', history: '', expertise: '', affiliation: '' });
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [requesterNameMap, setRequesterNameMap] = useState({});
  const [instructorNameMap, setInstructorNameMap] = useState({});
  const [recommendedEvents, setRecommendedEvents] = useState([]);
  const [recommendedRequesterNameMap, setRecommendedRequesterNameMap] = useState({});
  const [recommendedInstructorNameMap, setRecommendedInstructorNameMap] = useState({});
  const [trueInterests, setTrueInterests] = useState([]);
  const [expertiseMap, setExpertiseMap] = useState({});

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/expertise/');
        const data = await res.json();
        const map = {};
        data.forEach(item => { map[item.ID] = item.Title; });
        setExpertiseMap(map);
      } catch (e) { console.error('Error fetching expertise:', e); }
    };
    fetchExpertise();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await response.json();
        if (data && data.length > 0) setProfileInfo(data[0]);
      } catch (error) { console.error('Error fetching profile:', error); }
    };
    fetchProfile();
  }, [userID]);

  const fetchProfileNames = async (events, setRequesterNames, setInstructorNames) => {
    const requesterIds = new Set(events.map(e => e.RequesterID).filter(Boolean));
    const instructorIds = new Set(events.map(e => e.InstructorID).filter(Boolean));
    const rMap = {}, iMap = {};
    for (const id of requesterIds) {
      try {
        const res = await fetch(`http://localhost:3001/users/${id}`);
        const d = await res.json();
        rMap[id] = d?.FirstName ? `${d.FirstName} ${d.LastName}` : 'Unknown';
      } catch { rMap[id] = 'Unknown'; }
    }
    for (const id of instructorIds) {
      try {
        const res = await fetch(`http://localhost:3001/users/${id}`);
        const d = await res.json();
        iMap[id] = d?.FirstName ? `${d.FirstName} ${d.LastName}` : 'Unknown';
      } catch { iMap[id] = 'Unknown'; }
    }
    setRequesterNames(rMap);
    setInstructorNames(iMap);
  };

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const response = await fetch(`http://localhost:3001/events/user/${userID}`);
        const data = await response.json();
        setUpcomingEvents(data);
        fetchProfileNames(data, setRequesterNameMap, setInstructorNameMap);
      } catch (error) { console.error('Error fetching upcoming events:', error); }
    };
    fetchUpcoming();
  }, [userID]);

  const firstName = profileInfo.FirstName || 'there';

  return (
    <div className="dash-root">
      <UserHeader />

      {/* Welcome Banner */}
      <div className="dash-banner">
        <div className="dash-banner-inner">
          <h1 className="dash-banner-title">Welcome back, {firstName}</h1>
          <p className="dash-banner-sub">Here's what's happening in your network.</p>
        </div>
      </div>

      <div className="dash-body">

        {/* Recommended Events */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">{t.opportunitiesTitle}</h2>
              <p className="dash-section-sub">{t.opportunitiesSubtitle}</p>
            </div>
            <Link to="/Search" className="dash-section-cta">Browse all →</Link>
          </div>
          {recommendedEvents.length > 0 ? (
            <div className="dash-cards-grid">
              {recommendedEvents.map(event => (
                <EventCard
                  key={event.ID}
                  eventID={event.ID}
                  topic={event.Topic}
                  requester={recommendedRequesterNameMap[event.RequesterID] || 'TBD'}
                  instructor={recommendedInstructorNameMap[event.InstructorID] || 'TBD'}
                  course={expertiseMap[event.ExpertiseID] || 'TBD'}
                  date={event.Date}
                />
              ))}
            </div>
          ) : (
            <p className="dash-empty">{t.noRecommended}</p>
          )}
        </section>

        {/* Upcoming Events */}
        <section className="dash-section">
          <div className="dash-section-header">
            <div>
              <h2 className="dash-section-title">{t.upcomingTitle}</h2>
              <p className="dash-section-sub">{t.upcomingSubtitle}</p>
            </div>
            
          </div>
          {upcomingEvents.length > 0 ? (
            <div className="dash-cards-grid">
              {upcomingEvents.map(event => (
                <EventCard
                  key={event.ID}
                  eventID={event.ID}
                  topic={event.Topic}
                  requester={requesterNameMap[event.RequesterID] || 'TBD'}
                  instructor={instructorNameMap[event.InstructorID] || 'TBD'}
                  course={expertiseMap[event.ExpertiseID] || 'TBD'}
                  date={event.Date}
                />
              ))}
            </div>
          ) : (
            <p className="dash-empty">No upcoming events yet.</p>
          )}
        </section>

        {/* Interests */}
        {trueInterests.length > 0 && (
          <section className="dash-section">
            <div className="dash-section-header">
              <div>
                <h2 className="dash-section-title">{t.topicsTitle}</h2>
                <p className="dash-section-sub">{t.topicsSubtitle}</p>
              </div>
            </div>
            <div className="dash-interests">
              {trueInterests.map((interest, i) => (
                <InterestTag key={i} title={interest} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
};

export default Dashboard;