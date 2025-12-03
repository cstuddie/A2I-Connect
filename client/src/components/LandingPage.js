import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from "react-router-dom";
import { EventCard } from './Dashboard';
import { FaUserCircle } from 'react-icons/fa';
import "./Base.css"; 

const Card = ({ name, role }) => (
  <div className="card">
    <div className="icon-container">
      <FaUserCircle size={60} />
    </div>
    <div>
      <h4><b>{name}</b></h4>
      <p>{role}</p>
    </div>
  </div>
);

const LandingPage = () => {
  const [professionals, setProfessionals] = useState([]);
  const [events, setEvents] = useState([]);
  const [usersMap, setUsersMap] = useState({});
  const [expertiseMap, setExpertiseMap] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('http://localhost:5000/users/');
        const data = await res.json();
        setProfessionals(data);

        const map = {};
        data.forEach(u => {
          map[u.ID] = `${u.FirstName} ${u.LastName}`;
        });
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
        const res = await fetch('http://localhost:5000/users/expertise');
        const data = await res.json();
        const map = {};
        data.forEach(e => {
          map[e.ID] = e.Title;
        });
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
        const res = await fetch('http://localhost:5000/events/');
        const data = await res.json();
        const eventArray = Array.isArray(data) ? data : data.events || [];
        setEvents(eventArray);
      } catch (err) {
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
  }, []);

  return (
    <div>
      <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
        <Navbar.Brand as={Link} to="/">
            <h1>A2I Connect</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavLink to="/login" className="nav-link me-3">
              Login
            </NavLink>
              <Button as={NavLink} variant="dark" to="/Register">
              Sign Up
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Container>
        <Row className="mb-5">
          <div className="d-flex flex-column align-items-center" style={{paddingTop: '40px'}}>
              <h1 style={{color: 'black'}}>Find and connect with academic and industry professionals.</h1>
            <p style={{textAlign: 'center'}}>
              Whether looking to academic professionals for instruction or for industry professionals to give seminars, A2I Connect will connect you with professionals tailored to your needs.
            </p>
              <Button as={NavLink} to="/Register" variant="dark" className="mt-3" style={{width: '400px'}}>
                Get Started
              </Button>
          </div>
        </Row>
        <Row className="mb-5">
          <Col>
              <h1 style={{textAlign: 'left', color: 'black'}}>Attend Events.</h1>
            <div className="card-container">
              {events.slice(0, 10).map(event => (
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
            </div>
          </Col>
        </Row>
  
        <Row className="mb-5">
          <Col>
              <h1 style={{textAlign: 'left', color: 'black'}}>Find Professionals.</h1>
            <div className="card-container">
              {professionals.slice(0, 10).map(pro => (
                <Card
                  key={pro.ID}
                  name={`${pro.FirstName} ${pro.LastName}`}
                  role={expertiseMap[pro.ExpertiseID] || 'N/A'}
                />
              ))}
            </div>
          </Col>
        </Row>
  
        <Row className="text-center mt-5">
          <Col>
              <h1 style={{textAlign: 'left'}}>Start connecting with professionals today.</h1>
              <div className="mt-4">
                <Button as={NavLink} to="/Register" variant="dark">
                Get Started
              </Button>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
