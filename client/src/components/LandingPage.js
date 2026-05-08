import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from "react-router-dom";
import { EventCard } from './Dashboard';
import { FaUserCircle } from 'react-icons/fa';
import "./LandingPage.css";
import useTranslation from '../utils/useTranslation';

const ProfessionalCard = ({ name, role }) => (
  <div className="pro-card">
    <div className="pro-avatar">
      <FaUserCircle size={48} />
    </div>
    <div className="pro-info">
      <h4>{name}</h4>
      <p>{role || 'N/A'}</p>
    </div>
    <div className="pro-badge">Available</div>
  </div>
);

const CategoryPill = ({ label, icon }) => (
  <div className="category-pill">
    <span className="pill-icon">{icon}</span>
    <span>{label}</span>
  </div>
);

const LandingPage = () => {
  const t = useTranslation();
  const [professionals, setProfessionals] = useState([]);
  const [events, setEvents] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [expertiseMap, setExpertiseMap] = useState({});
 
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/');
        const data = await res.json();
        setProfessionals(data);
        const map = {};
        data.forEach(u => { map[u.ID] = `${u.FirstName} ${u.LastName}`; });
        setUsersMap(map);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);
 
  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await fetch('http://localhost:3001/users/expertise');
        const data = await res.json();
        const map = {};
        data.forEach(e => { map[e.ID] = e.Title; });
        setExpertiseMap(map);
      } catch (err) {
        console.error('Error fetching expertise:', err);
      }
    };
    fetchExpertise();
  }, []);
 
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:3001/events/');
        const data = await res.json();
        const eventArray = Array.isArray(data) ? data : data.events || [];
        setEvents(eventArray);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);
 
  const categories = [
    { label: 'Development & IT', icon: '💻' },
    { label: 'Design & Creative', icon: '🎨' },
    { label: 'Research', icon: '🔬' },
    { label: 'Engineering', icon: '⚙️' },
    { label: 'Mathematics', icon: '📐' },
    { label: 'Writing', icon: '✍️' },
  ];
 
  return (
    <div className="landing-root">
 
      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo">A2I Connect</Link>
        <div className="nav-links">
          <NavLink to="/login" className="nav-link-text">Log in</NavLink>
          <NavLink to="/Register" className="nav-btn-outline">Sign up</NavLink>
        </div>
      </nav>
 
      {/* Hero */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-headline">
            Learning<br />
            <span className="hero-accent">made accessible.</span>
          </h1>
          <p className="hero-sub">
            Connect with top academic professionals and attend events that accelerate your learning.
          </p>
        </div>
        <div className="hero-stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Professionals</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">200+</span>
            <span className="stat-label">Events hosted</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <span className="stat-number">50+</span>
            <span className="stat-label">Fields of study</span>
          </div>
        </div>
      </section>
 
      {/* Trust bar */}
      <section className="trust-bar">
        <p className="trust-label">Trusted by students and professionals across</p>
        <div className="trust-items">
          <span>Mississippi State University</span>
          <span>University of Mississippi</span>
          <span>Jackson State University</span>
          <span>University of Southern Mississippi</span>
        </div>
      </section>
 
      {/* Upcoming Events */}
      <section className="section events-section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Upcoming events</h2>
              <p className="section-sub">Join live sessions hosted by professionals</p>
            </div>
            <NavLink to="/Register" className="section-cta">Browse all →</NavLink>
          </div>
          <div className="events-grid">
            {events.slice(0, 6).map(event => (
              <EventCard
                key={event.ID}
                eventID={event.ID}
                topic={event.Topic}
                requester={usersMap[event.RequesterID] || 'Unknown'}
                instructor={usersMap[event.InstructorID] || 'Unknown'}
                course={event.Course}
                date={event.Date}
              />
            ))}
            {events.length === 0 && (
              <p className="empty-state">No upcoming events yet. Check back soon!</p>
            )}
          </div>
        </div>
      </section>
 
      {/* Professionals */}
      <section className="section professionals-section">
        <div className="section-inner">
          <div className="section-header">
            <div>
              <h2 className="section-title">Top professionals</h2>
              <p className="section-sub">Experts ready to connect with you</p>
            </div>
            <NavLink to="/Register" className="section-cta">View all →</NavLink>
          </div>
          <div className="pros-grid">
            {professionals.slice(0, 8).map(pro => (
              <ProfessionalCard
                key={pro.ID}
                name={`${pro.FirstName} ${pro.LastName}`}
                role={expertiseMap[pro.ExpertiseID]}
              />
            ))}
            {professionals.length === 0 && (
              <p className="empty-state">No professionals listed yet.</p>
            )}
          </div>
        </div>
      </section>
 
      {/* CTA Banner */}
      <section className="cta-banner">
        <div className="cta-inner">
          <h2>Ready to get started?</h2>
          <p>Join A2I Connect and start learning from the best.</p>
          <NavLink to="/Register" className="cta-btn">Create a free account</NavLink>
        </div>
      </section>
 
      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <span className="footer-logo">A2I Connect</span>
          <div className="footer-links">
            <NavLink to="/login">Log in</NavLink>
            <NavLink to="/Register">Sign up</NavLink>
          </div>
          <p className="footer-copy">© {new Date().getFullYear()} A2I Connect. All rights reserved.</p>
        </div>
      </footer>
 
    </div>
  );
};
 
export default LandingPage;
