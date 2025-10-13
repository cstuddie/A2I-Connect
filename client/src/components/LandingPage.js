import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link } from "react-router-dom";
import { EventCard } from './Dashboard';
import { FaUserCircle } from 'react-icons/fa';
import "./Base.css"; 

const Card = ({ name, role, img }) => (
  <div className="card">
    <img src={img} alt={<FaUserCircle size={30}/>} />
    <div className="container">
      <h4><b>{name}</b></h4>
      <p style={{paddingRight: "0%", textAlign: "center"}}>{role}</p>
    </div>
  </div>
);


const LandingPage = () => {
  const [professionals, setProfessionals] = useState(null);
  const [events, setEvents] = useState(null);
  const [requesterNames, setRequesterNames] = useState([]);
  const [instructorNames, setInstructorNames] = useState([]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await fetch(`http://localhost:5000/profiles`);
        if (!response.ok) {
          throw new Error('Failed to fetch profiles');
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setProfessionals(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Use mock data if API call fails
        setProfessionals([
          { profileID: 1, name: 'John Doe', expertise: 'Computer Science' },
          { profileID: 2, name: 'Jane Smith', expertise: 'Mechanical Engineering' },
          { profileID: 3, name: 'Mike Brown', expertise: 'Fine Arts' },
          { profileID: 4, name: 'Emma Jones', expertise: 'Computer Science' },
          { profileID: 5, name: 'Samuel Green', expertise: 'Environmental Science' }
        ]);
      }
    };
    fetchProfessionals();
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`http://localhost:5000/events`);
        const data = await response.json();

        const eventArray = Array.isArray(data) ? data : data.events || [];

        setEvents(eventArray);

            // Fetch requester names for each event
            const rNames = {};
            for (const event of eventArray) {
                if (event.requesterID) {
                    const profileResponse = await fetch(`http://localhost:5000/profile/${event.requesterID}`);
                    const profileData = await profileResponse.json();
                    if (profileData && profileData[0] && profileData[0].name) {
                        rNames[event.requesterID] = profileData[0].name;
                    } else {
                        rNames[event.requesterID] = "Unknown Requester"; // Handle missing name
                    }
                }
            }
            setRequesterNames(rNames);

            // Fetch requester names for each event
            const iNames = {};
            for (const event of data) {
                if (event.instructorID) {
                    const profileResponse = await fetch(`http://localhost:5000/profile/${event.instructorID}`);
                    const profileData = await profileResponse.json();
                    if (profileData && profileData[0] && profileData[0].name) {
                        iNames[event.instructorID] = profileData[0].name;
                    } else {
                        iNames[event.instructorID] = "Unknown Requester"; // Handle missing name
                    }
                }
            }
            setInstructorNames(iNames);
      
      } catch(error) {
        console.error('Error fetching events:', error);
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
              <h1 >Find and connect with academic and industry professionals.</h1>
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
              <h1 style={{textAlign: 'left'}}>Attend Events.</h1>
            <div className="card-container">
              {events && events.slice(0,10).map((event) => (
                  <EventCard
                  key={event.eventID}
                  eventID={event.eventID}
                  topic={event.topic}
                  instructor={instructorNames[event.instructorID] || 'None'}
                  requester={requesterNames[event.requesterID] || 'None'}
                  course={event.course}
                  date={event.date}
                />
              ))}
            </div>
            </Col>
          </Row>
  
          <Row className="mb-5">
            <Col>
              <h1 style={{textAlign: 'left'}}>Find Professionals.</h1>
              <div className="card-container">
                {Array.isArray(professionals) && professionals.length > 0 ? (
                  professionals.slice(0, 10).map((professional) => (
                    <Card
                      key={professional.profileID}
                      name={professional.name}
                      role={professional.expertise}
                      img={professional.img || ''}
                    />
                  ))
                ) : (
                  <p>No professionals found</p>
                )}
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