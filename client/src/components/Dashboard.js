import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Badge, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import "./Base.css"; 

export function UserHeader({ name }) {
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userID');
    window.location.href = '/login';
  };

  return (
    <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
      <Navbar.Brand as={Link} to="/Dashboard"><h1>A2I Connect</h1></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link as={Link} to="/Dashboard">Home</Nav.Link>
          <Nav.Link as={Link} to="/Calendar">Calendar</Nav.Link>
          <Nav.Link as={Link} to="/RequestSpeaker">Request Speaker</Nav.Link>
          <Nav.Link as={Link} to="/Search">Browse Events</Nav.Link>
        </Nav>
        <Nav className="ms-auto">
          <NavDropdown title={<FaUserCircle size={40} />} id="basic-nav-dropdown">
            <NavDropdown.Item href="/EditProfile" className='custom-dropdown-link'>Account</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item onClick={handleLogout} className='custom-dropdown-link'>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export function EventCard({ eventID, topic, requester, date }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title as={Link} to={`/Event/${eventID}`} className="text-decoration-none"><b>{topic}</b></Card.Title>
        <Card.Text className="mb-2"><Badge bg="dark" className="me-2">Requester</Badge>{requester}</Card.Text>
        <Card.Text><Badge bg="dark" className="me-2">Date</Badge>{new Date(date).toLocaleString()}</Card.Text>
      </Card.Body>
    </Card>
  );
};

const InterestCard = ({ title }) => (
  <Badge bg="light" text="dark" className="fs-6 px-3 py-2 shadow-sm">{title}</Badge>
);

const Dashboard = () => {
  const userID = localStorage.getItem('userID');

  const [profileInfo, setProfileInfo] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [requesterNameMap, setRequesterNameMap] = useState({});
  const [trueInterests, setTrueInterests] = useState([]);

  useEffect(() => {
    if (!userID) {
      window.location.href = '/login';
    }
  }, [userID]);

  useEffect(() => {
    if (!userID) return;
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:5000/users/${userID}`);
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) setProfileInfo(data[0]);
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };
    fetchProfile();
  }, [userID]);

  // Fetch upcoming events (all events, filtered by requester if needed)
  useEffect(() => {
    if (!userID) return;
    const fetchUpcoming = async () => {
      try {
        const res = await fetch(`http://localhost:5000/events`);
        const data = await res.json();
        if (Array.isArray(data)) {
          // Optional: filter events relevant to this user
          const userEvents = data.filter(e => e.RequesterID === parseInt(userID));
          setUpcomingEvents(userEvents);

          // Fetch requester names
          const requesterIds = [...new Set(userEvents.map(e => e.RequesterID))];
          const map = {};
          await Promise.all(requesterIds.map(async id => {
            try {
              const r = await fetch(`http://localhost:5000/users/${id}`);
              const u = await r.json();
              map[id] = u?.[0]?.FirstName + ' ' + u?.[0]?.LastName || "Unknown";
            } catch {
              map[id] = "Unknown";
            }
          }));
          setRequesterNameMap(map);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchUpcoming();
  }, [userID]);

  // Fetch true interests
  useEffect(() => {
    if (!userID) return;
    const fetchInterests = async () => {
      try {
        const res = await fetch(`http://localhost:5000/profile/trueInterests/${userID}`);
        const data = await res.json();
        if (Array.isArray(data)) setTrueInterests(data.map(e => e.Title)); 
      } catch (err) {
        console.error('Error fetching interests:', err);
      }
    };
    fetchInterests();
  }, [userID]);

  return (
    <div>
      <UserHeader name={`${profileInfo.FirstName || ''} ${profileInfo.LastName || ''}`} />
      <Container className="py-4">

        {/* Upcoming Events */}
        <section className="mb-5">
          <h2 className="mb-4" style={{ textAlign: 'left', color: 'black' }}>Your Upcoming Events</h2>
          <Row className="g-4">
            <div className='card-container'>
              {upcomingEvents.map(event => (
                <Col sm={6} lg={4} key={event.ID}>
                  <EventCard
                    eventID={event.ID}
                    topic={event.Topic}
                    requester={requesterNameMap[event.RequesterID] || "Unknown"}
                    date={event.Date}
                  />
                </Col>
              ))}
            </div>
          </Row>
        </section>

        {/* Interests */}
        <section>
          <h2 className="mb-4" style={{ textAlign: 'left', color: 'black' }}>Your Topics</h2>
          <p className="text-muted">Topics you are interested in.</p>
          <div className="d-flex flex-wrap gap-3">
            {trueInterests.map((interest, idx) => <InterestCard key={idx} title={interest} />)}
          </div>
        </section>

      </Container>
    </div>
  );
};

export default Dashboard;
