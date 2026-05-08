import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { UserHeader, EventCard } from './Dashboard';
import { useParams } from 'react-router-dom';
import { formatLocalDate } from '../utils/dateUtils';
import useTranslation from '../utils/useTranslation';
import './LandingPage.css';
import './Search.css';

const statusLabels = { 1: 'Pending', 2: 'Confirmed', 3: 'Completed' };

const Search = () => {
  const userID = localStorage.getItem('userID') || 2;
  const t = useTranslation();

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [requesterNameMap, setRequesterNameMap] = useState({});
  const [instructorNameMap, setInstructorNameMap] = useState({});
  const [searchType, setSearchType] = useState('topic');
  const [filters, setFilters] = useState({
    field: '',
    course: '',
    startDate: '',
    endDate: '',
    deliveryMethod: '',
    status: ''
  });
  const [courses, setCourses] = useState([]);
  const [profileInfo, setProfileInfo] = useState({ name: 'empty', interests: 'empty', history: 'empty', expertise: 'empty', affiliation: 'empty' });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await response.json();
        setProfileInfo(data[0]);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [userID]);

  const handleTopicSearch = async () => {
    try {
      const response = await fetch(`http://localhost:3001/events/topic/${searchTerm}`);
      const data = await response.json();
      const eventsArray = Array.isArray(data) ? data : [];
      const mappedData = eventsArray.map(event => ({
        eventID: event.ID, topic: event.Topic, description: event.Description,
        date: event.Date, requesterID: event.RequesterID, instructorID: event.InstructorID,
        field: event.Field, course: event.Course, deliveryMethod: event.DeliveryMethod, status: event.EventStatus,
      }));
      setSearchResults(mappedData);
      fetchProfileNames(mappedData, setRequesterNameMap, setInstructorNameMap);
    } catch (error) {
      console.error('Error searching for events:', error);
      setSearchResults([]);
    }
  };

  const fetchAllEvents = async () => {
    try {
      const response = await fetch(`http://localhost:3001/events/`);
      const data = await response.json();
      const eventsArray = Array.isArray(data) ? data : [];
      const mappedData = eventsArray.map(event => ({
        eventID: event.ID, topic: event.Topic, description: event.Description,
        date: event.Date, requesterID: event.RequesterID, instructorID: event.InstructorID,
        field: event.Field, course: event.Course, deliveryMethod: event.DeliveryMethod, status: event.EventStatus,
      }));
      setSearchResults(mappedData);
      fetchProfileNames(mappedData, setRequesterNameMap, setInstructorNameMap);
    } catch (error) {
      console.error('Error fetching all events:', error);
      setSearchResults([]);
    }
  };

  const handleSearch = () => {
    if (searchTerm.trim() === '') fetchAllEvents();
    else handleTopicSearch();
  };

  const fetchProfileNames = async (events, setRequesterNames, setInstructorNames) => {
    const requesterIds = new Set(events.map(event => event.requesterID).filter(id => id));
    const instructorIds = new Set(events.map(event => event.instructorID).filter(id => id));
    const requesterNameMap = {};
    const instructorNameMap = {};
    const fetchName = async (userID, fallback = "Unknown User") => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await res.json();
        const profile = Array.isArray(data) ? data[0] : data;
        if (!profile) return fallback;
        return (profile.FirstName && profile.LastName) ? `${profile.FirstName} ${profile.LastName}` : profile.name || fallback;
      } catch (err) { return fallback; }
    };
    await Promise.all([...requesterIds].map(async id => { requesterNameMap[id] = await fetchName(id, "Unknown Requester"); }));
    await Promise.all([...instructorIds].map(async id => { instructorNameMap[id] = await fetchName(id, "Instructor Needed"); }));
    setRequesterNames(requesterNameMap);
    setInstructorNames(instructorNameMap);
  };

  const fetchCourses = async (field) => {
    try {
      const adjustedField = field.toLowerCase().replace(/ /g, '_');
      const response = await fetch(`http://localhost:3001/filteredCourses/${adjustedField}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) { console.error('Error fetching courses:', error); }
  };

  useEffect(() => {
    if (filters.field) fetchCourses(filters.field);
    else { filters.course = ''; setCourses([]); }
  }, [filters.field]);

  const filteredResults = searchResults.filter(event => {
    return (
      (!filters.field || event.field === filters.field) &&
      (!filters.course || event.course === filters.course) &&
      (!filters.startDate || event.date >= filters.startDate) &&
      (!filters.endDate || event.date <= filters.endDate) &&
      (!filters.deliveryMethod || event.deliveryMethod === filters.deliveryMethod) &&
      (!filters.status || event.status === Number(filters.status))
    );
  });

  useEffect(() => { fetchAllEvents(); }, []);

  return (
    <div className="dash-root">
      <UserHeader name={profileInfo?.FirstName || "Loading..."} />

      {/* Page Header */}
      <div className="dash-banner">
        <div className="dash-banner-inner">
          <h1 className="dash-banner-title">{t.browseEvents || 'Browse Events'}</h1>
          <p className="dash-banner-sub">Find and join sessions hosted by professionals</p>
        </div>
      </div>

      <div className="search-body">

        {/* Search Bar */}
        <div className="search-bar-row">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-bar-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t.searchPlaceholder || 'Search by topic...'}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button className="search-bar-btn" onClick={handleSearch}>
              {t.search || 'Search'}
            </button>
          </div>
        </div>

        <div className="search-layout">

          {/* Filters Sidebar */}
          <aside className="search-filters">
            <h3 className="filters-title">Filters</h3>

            <div className="filter-group">
              <label className="filter-label">{t.field || 'Field'}</label>
              <select className="auth-input auth-select filter-select" onChange={(e) => setFilters({ ...filters, field: e.target.value })}>
                <option value="">All</option>
                <option value="Computer Science">Computer Science</option>
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="Biology">Biology</option>
                <option value="Psychology">Psychology</option>
                <option value="Architecture">Architecture</option>
                <option value="Art">Art</option>
                <option value="Aerospace Engineering">Aerospace Engineering</option>
                <option value="Biomedical Engineering">Biomedical Engineering</option>
                <option value="Data Science">Data Science</option>
                <option value="Environmental Engineering">Environmental Engineering</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">{t.courseLbl || 'Course'}</label>
              <select className="auth-input auth-select filter-select" onChange={(e) => setFilters({ ...filters, course: e.target.value })}>
                <option value="">All</option>
                {Object.entries(courses).filter(([courseID]) => courseID !== 'userID').map(([courseID]) => (
                  <option key={courseID} value={courseID}>{courseID}</option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">{t.from || 'From'}</label>
              <input type="date" className="auth-input filter-select" value={filters.startDate} onChange={(e) => setFilters({ ...filters, startDate: e.target.value })} />
            </div>

            <div className="filter-group">
              <label className="filter-label">{t.to || 'To'}</label>
              <input type="date" className="auth-input filter-select" value={filters.endDate} onChange={(e) => setFilters({ ...filters, endDate: e.target.value })} />
            </div>

            <div className="filter-group">
              <label className="filter-label">{t.deliveryMethodLbl || 'Delivery Method'}</label>
              <select className="auth-input auth-select filter-select" onChange={(e) => setFilters({ ...filters, deliveryMethod: e.target.value })}>
                <option value="">{t.all || 'All'}</option>
                <option value="Online">{t.online || 'Online'}</option>
                <option value="In-Person">{t.inPerson || 'In-Person'}</option>
              </select>
            </div>

            <div className="filter-group">
              <label className="filter-label">{t.statusLbl || 'Status'}</label>
              <select className="auth-input auth-select filter-select" onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
                <option value="">{t.all || 'All'}</option>
                <option value="1">Pending</option>
                <option value="2">Confirmed</option>
                <option value="3">Completed</option>
              </select>
            </div>
          </aside>

          {/* Results */}
          <div className="search-results-area">
            <p className="search-results-count">
              {filteredResults.length} {filteredResults.length === 1 ? 'event' : 'events'} found
            </p>

            {filteredResults.length > 0 ? (
              <div className="search-results-list">
                {filteredResults.map((event) => (
                  <Link to={`/events/${event.eventID}`} key={event.eventID} className="search-result-card">
                    <div className="src-left">
                      <div className="src-topic">{event.topic}</div>
                      <div className="src-desc">{event.description}</div>
                      <div className="src-meta-row">
                        {event.deliveryMethod && (
                          <span className="src-badge">{event.deliveryMethod}</span>
                        )}
                        {event.status && (
                          <span className={`src-badge status-${event.status}`}>{statusLabels[event.status] || 'Unknown'}</span>
                        )}
                      </div>
                    </div>
                    <div className="src-right">
                      <div className="src-detail">
                        <span className="src-detail-label">{t.dateLabel || 'Date'}</span>
                        <span className="src-detail-value">{formatLocalDate(event.date)}</span>
                      </div>
                      <div className="src-detail">
                        <span className="src-detail-label">{t.requesterLabel || 'Requester'}</span>
                        <span className="src-detail-value">{requesterNameMap[event.requesterID] || 'Unknown'}</span>
                      </div>
                      <div className="src-detail">
                        <span className="src-detail-label">{t.instructorLabel || 'Instructor'}</span>
                        <span className="src-detail-value">{instructorNameMap[event.instructorID] || 'Needed'}</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="search-empty">
                <p>{t.noResults || 'No events found.'}</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Search;