import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import "./Base.css";
import { UserHeader, EventCard } from './Dashboard';
import { Row, Col, Form, Button, ListGroup, Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

const Search = () => {
  const userID = localStorage.getItem('userID') || 2;

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

  // State for profile info
  const [profileInfo, setProfileInfo] = useState({
    name: 'empty',
    interests: 'empty',
    history: 'empty',
    expertise: 'empty',
    affiliation: 'empty',
});

// Fetches info for the profile
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
        eventID: event.ID,
        topic: event.Topic,
        description: event.Description,
        date: event.Date,
        requesterID: event.RequesterID,
        instructorID: event.InstructorID,
        field: event.Field,
        course: event.Course,
        deliveryMethod: event.DeliveryMethod,
        status: event.EventStatus,
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
          eventID: event.ID,
          topic: event.Topic,
          description: event.Description,
          date: event.Date,
          requesterID: event.RequesterID,
          instructorID: event.InstructorID,
          field: event.Field,
          course: event.Course,
          deliveryMethod: event.DeliveryMethod,
          status: event.EventStatus,
        }));

        setSearchResults(mappedData);
        fetchProfileNames(mappedData, setRequesterNameMap, setInstructorNameMap);
      } catch (error) {
        console.error('Error fetching all events:', error);
        setSearchResults([]);
      }
    };


  const handleSearch = () => {
    if (searchTerm.trim() === '') {
      fetchAllEvents();
    } 
    else {
      handleTopicSearch();
    }
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
        const profile = Array.isArray(data) ? data[0] : data; // Handle both array and object
        if (!profile) return fallback;

        return (profile.FirstName && profile.LastName)
          ? `${profile.FirstName} ${profile.LastName}`
          : profile.name || fallback;
      } catch (err) {
        console.error(`Error fetching user ${userID}:`, err);
        return fallback;
      }
    };

    await Promise.all([...requesterIds].map(async id => {
      requesterNameMap[id] = await fetchName(id, "Unknown Requester");
    }));

    await Promise.all([...instructorIds].map(async id => {
      instructorNameMap[id] = await fetchName(id, "Instructor Needed");
    }));

    setRequesterNames(requesterNameMap);
    setInstructorNames(instructorNameMap);
  };
  
  const fetchCourses = async (field) => {
    try {
      const adjustedField = field.toLowerCase().replace(/ /g, '_');
      const response = await fetch(`http://localhost:3001/filteredCourses/${adjustedField}`);
      const data = await response.json();
      setCourses(data);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  }
  
  useEffect(() => {
    if (filters.field) {
      fetchCourses(filters.field);
    }
    else {
      filters.course = '';
      setCourses([]);
    }
  }, [filters.field]);
  
  const filteredResults = searchResults.filter(event => {
    return (
      (!filters.field || event.field === filters.field) &&
      (!filters.course || event.course === filters.course) &&
      (!filters.startDate || event.date >= filters.startDate) &&
      (!filters.endDate || event.date <= filters.endDate) &&
      (!filters.deliveryMethod || event.deliveryMethod === filters.deliveryMethod) &&
      (!filters.status || event.status === filters.status)
    );
  });

  useEffect(() => {
    fetchAllEvents();
  }, []);

  return (
    <div className="search-container">
      <UserHeader name={profileInfo?.FirstName || "Loading..."} />

      <Container>
      <div className="search-type-container">
        <input
          style={{ width: '100%' }}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search events"
        />
        <Button onClick={handleSearch} variant="dark">
          Search
        </Button>
      </div>

      <Row>
          <Col md={3} className="filter-container">
            <Form>
              <Form.Group>
                <Form.Label>Field:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setFilters({ ...filters, field: e.target.value })}
                >
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
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Course:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setFilters({ ...filters, course: e.target.value })}
                >
                  <option value="">All</option>
                  {Object.entries(courses).filter(([courseID]) => courseID !== 'userID').map(([courseID]) => (
                    <option value={courseID}>{courseID}</option>
                  ))}
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>From:</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>To:</Form.Label>
                <Form.Control
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Delivery Method:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setFilters({ ...filters, deliveryMethod: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </Form.Control>
              </Form.Group>

              <Form.Group>
                <Form.Label>Status:</Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                </Form.Control>
              </Form.Group>
            </Form>
          </Col>
        

        <Col>
          {filteredResults.length > 0 ? (
              <ListGroup variant='flush'>
                {filteredResults.map((event) => (
                  <ListGroup.Item key={event.eventID}>
                    <Link to={`/events/${event.eventID}`} className="text-decoration-none" style={{color: 'black'}}><strong>{event.topic}</strong></ Link><br />
                    <strong>Date:</strong> {new Date(event.date).toLocaleString()}<br />
                    <strong>Requester:</strong> {requesterNameMap[event.requesterID] || 'Unknown Requester'}<br />
                    <strong>Instructor:</strong> {instructorNameMap[event.instructorID] || 'Instructor Needed'}<br />
                    <strong style={{textDecoration: 'underline'}}>Event Description</strong><br />
                    {event.description}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <p style={{ textAlign: 'center', fontSize: '20px', fontWeight: 'bold', marginTop: '20px' }}>
                No results found
              </p>
            )}
        </Col>
      </Row>
      </Container>
    </div>
  );
};

export default Search;
