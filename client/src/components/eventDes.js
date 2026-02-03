import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import "./Base.css";

const EventDescription = () => {
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();
  const { eventID } = useParams();

  const [profileInfo, setProfileInfo] = useState(null);
  const [event, setEvent] = useState(null);

  useEffect(() => {
    if (!userID) {
      navigate('/login');
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await res.json();
        setProfileInfo(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, [userID, navigate]);

  useEffect(() => {
    console.log('eventID from params:', eventID);
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3001/events/${eventID}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchEvent();
  }, [eventID]);

  return (
    <div>
      <UserHeader
        name={
          profileInfo
            ? `${profileInfo.FirstName} ${profileInfo.LastName}`
            : ''
        }
      />

      <Container className="my-4">
        <h1 className="text-center mb-4">Event Description</h1>

        <Card>
          <Card.Body>
            <Card.Title className="mb-3">
              <strong>{event?.Topic || 'N/A'}</strong>
            </Card.Title>

            <Row>
              <Col md={6} className="mb-3">
                <strong>Instructor:</strong>{' '}
                {event?.InstructorName || 'Unassigned'}
              </Col>

              <Col md={6} className="mb-3">
                <strong>Requester:</strong>{' '}
                {event?.RequesterName || 'N/A'}
              </Col>

              <Col md={6} className="mb-3">
                <strong>Date:</strong>{' '}
                {event?.Date
                  ? new Date(event.Date).toLocaleDateString()
                  : 'N/A'}
              </Col>

              <Col md={6} className="mb-3">
                <strong>Delivery Method:</strong>{' '}
                {event?.DeliveryMethod || 'N/A'}
              </Col>

              <Col md={6} className="mb-3">
                <strong>Status:</strong>{' '}
                {event?.EventStatus ?? 'N/A'}
              </Col>

              <Col md={12} className="mb-3">
                <strong>Description:</strong>
                <br />
                {event?.Description || 'N/A'}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EventDescription;
