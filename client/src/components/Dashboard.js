import React, { useState, useEffect } from 'react';
import { NavLink, Link } from "react-router-dom";
import { Container, Row, Col, Button, Card, Badge, Navbar, Nav, NavDropdown } from 'react-bootstrap';
import  { FaUserCircle } from 'react-icons/fa';
import "./Base.css"; 

export function UserHeader ({name}) {
    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userID');
        window.location.href = '/login';
    }

    return (
        <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
          <Navbar.Brand as={Link} to="/Dashboard">
            <h1>A2I Connect</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/Dashboard">
                Home
              </Nav.Link>
              <Nav.Link as={Link} to="/Calendar">
                Calendar
              </Nav.Link>
              <Nav.Link as={Link} to="/RequestSpeaker">
                Request Speaker
              </Nav.Link>
              <Nav.Link as={Link} to="/Search">
                Browse Events
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
                <NavDropdown title={<FaUserCircle size={40} /> } id="basic-nav-dropdown">
                <NavDropdown.Item href="/EditProfile" className='custom-dropdown-link'>Account</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout} className='custom-dropdown-link'>Logout</NavDropdown.Item>
                </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      );
  };

export function EventCard ({ eventID, topic, instructor, requester, date, course }) {
  return (
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <Card.Title as={Link} to={`/Event/${eventID}`} className="text-decoration-none">
          <b>{topic}</b>
        </Card.Title>

        <Card.Text className="mb-2">
          <Badge bg="dark" className="me-2">Instructor</Badge>
          {instructor}
        </Card.Text>

        <Card.Text className="mb-2">
          <Badge bg="dark" className="me-2">Requester</Badge>
          {requester}
        </Card.Text>

        <Card.Text className="mb-2">
          <Badge bg="dark" className="me-2">Course</Badge>
          {course}
        </Card.Text>

        <Card.Text>
          <Badge bg="dark" className="me-2">Date</Badge>
          {new Date(date).toLocaleString()}
        </Card.Text>
      </Card.Body>
    </Card>
  );
};

const InterestCard = ({ title }) => {
    return (
      <Badge bg="light" text="dark" className="fs-6 px-3 py-2 shadow-sm">
        {title}
      </Badge>
    );
  };

const Dashboard = () => {
    // Changes the current user (keeping main's comment but using auth logic)
    const userID = localStorage.getItem('userID') || 2;

    const [profileInfo, setProfileInfo] = useState({
        name: 'Profile',
        interests: '',
        history: '',
        expertise: '',
        affiliation: '',
    });

    const [upcomingEvents, setUpcomingEvents] = useState([]);
    const [requesterNameMap, setRequesterNameMap] = useState({});
    const [instructorNameMap, setInstructorNameMap] = useState({});
    const [recommendedEvents, setRecommendedEvents] = useState([]);
    const [recommendedRequesterNameMap, setRecommendedRequesterNameMap] = useState({});
    const [recommendedInstructorNameMap, setRecommendedInstructorNameMap] = useState({});
    const [trueInterests, setTrueInterests] = useState([])

    // Fetches info for the profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/${userID}`);
                const data = await response.json();
                if (data && data.length > 0) {
                    setProfileInfo(data[0]);
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userID]);

    const fetchProfileNames = async (events, setRequesterNames, setInstructorNames) => {
        const requesterIds = new Set(events.map(event => event.requesterID).filter(id => id));
        const instructorIds = new Set(events.map(event => event.instructorID).filter(id => id));

        const requesterNameMap = {};
        const instructorNameMap = {};

        for (const requesterId of requesterIds) {
            try {
                const profileResponse = await fetch(`http://localhost:5000/profile/${requesterId}`);
                const profileData = await profileResponse.json();
                requesterNameMap[requesterId] = profileData && profileData[0] && profileData[0].name ? profileData[0].name : "Unknown Requester";
            } catch (error) {
                console.error(`Error fetching requester profile for ${requesterId}:`, error);
                requesterNameMap[requesterId] = "Unknown Requester";
            }
        }

        for (const instructorId of instructorIds) {
            try {
                const profileResponse = await fetch(`http://localhost:5000/profile/${instructorId}`);
                const profileData = await profileResponse.json();
                instructorNameMap[instructorId] = profileData && profileData[0] && profileData[0].name ? profileData[0].name : "Unknown Instructor";
            } catch (error) {
                console.error(`Error fetching instructor profile for ${instructorId}:`, error);
                instructorNameMap[instructorId] = "Unknown Instructor";
            }
        }

        setRequesterNames(requesterNameMap);
        setInstructorNames(instructorNameMap);
    };

    // Get upcoming events for user
    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const response = await fetch(`http://localhost:5000/events/${userID}`);
                const data = await response.json();
                setUpcomingEvents(data);
                fetchProfileNames(data, setRequesterNameMap, setInstructorNameMap);
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            }
        };
        fetchUpcoming();
    }, [userID]);

    // Get recommended events for user
    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const response = await fetch(`http://localhost:5000/recommendedEvents/${userID}`);
                const data = await response.json();
                setRecommendedEvents(data);
                fetchProfileNames(data, setRecommendedRequesterNameMap, setRecommendedInstructorNameMap);
            } catch (error) {
                console.error('Error fetching recommended events:', error);
            }
        };
        fetchRecommended();
    }, [userID]);

    // Get interests
    useEffect(() => {
        const fetchInterests = async () => {
            try {
                const response = await fetch(`http://localhost:5000/trueInterests/${userID}`);
                const data = await response.json();
                setTrueInterests(data);
            } catch (error) {
                console.error('Error fetching interests:', error)
            }
        };
        fetchInterests();
    });


    // Get upcoming events for user
    useEffect(() => {
        const fetchUpcoming = async () => {
            try {
                const response = await fetch(`http://localhost:5000/events/${userID}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setUpcomingEvents(data);
                    fetchProfileNames(data, setRequesterNameMap, setInstructorNameMap);
                }
            } catch (error) {
                console.error('Error fetching upcoming events:', error);
            }
        };
        fetchUpcoming();
    }, [userID]);

    // Get recommended events for user
    useEffect(() => {
        const fetchRecommended = async () => {
            try {
                const response = await fetch(`http://localhost:5000/recommendedEvents/${userID}`);
                const data = await response.json();
                if (Array.isArray(data)) {
                    setRecommendedEvents(data);
                    fetchProfileNames(data, setRecommendedRequesterNameMap, setRecommendedInstructorNameMap);
                }
            } catch (error) {
                console.error('Error fetching recommended events:', error);
            }
        };
        fetchRecommended();
    }, [userID]);

    return (
        <div>
        <UserHeader name={profileInfo.name} />
        <Container className="py-4">
      
          {/* Recommended Events */}
          <section className="mb-5">
            <h2 className="mb-4" style={{textAlign: 'left'}}>Opportunities for You!</h2>
            <p className="text-muted">Find events based on topics and courses you're interested in.</p>
            {recommendedEvents.length > 0 ? (
              <Row className="g-4">
                <div className='card-container'>
                  {recommendedEvents.map((event) => (
                    <Col sm={6} lg={4} key={event.eventID}>
                      <EventCard
                        eventID={event.eventID}
                        topic={event.topic}
                        requester={recommendedRequesterNameMap[event.requesterID] || "None"}
                        instructor={recommendedInstructorNameMap[event.instructorID] || "None"}
                        course = {event.course}
                        date={event.date}
                      />
                    </Col>
                  ))}
                </div>
              </Row>
            ) : (
              <p className="text-muted fst-italic">No recommended events.</p>
            )}
          </section>
      
          {/* Upcoming Events */}
          <section className="mb-5">
            <h2 className="mb-4" style={{textAlign: 'left'}}>Your Upcoming Events.</h2>
            <p className="text-muted">Events that you are participating in.</p>
              <Row className="g-4">
                <div className='card-container'>
                  {upcomingEvents.map((event) => (
                    <Col sm={6} lg={4} key={event.eventID}>
                      <EventCard
                        eventID={event.eventID}
                        topic={event.topic}
                        requester={requesterNameMap[event.requesterID] || "None"}
                        instructor={instructorNameMap[event.instructorID] || "None"}
                        course={event.course}
                        date={event.date}
                      />
                    </Col>
                  ))}
                </div>
              </Row>
          </section>
      
          {/* Interests */}
          <section>
            <h2 className="mb-4" style={{textAlign: 'left'}}>Your Topics.</h2>
            <p className="text-muted">Topics that you are interested in.</p>
            <div className="d-flex flex-wrap gap-3">
              {trueInterests.map((interest, key) => (
                <InterestCard key={key} title={interest} />
              ))}
            </div>
          </section>
        </Container>
        </div>
      );
};

export default Dashboard;