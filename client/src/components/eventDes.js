import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import { formatLocalDate } from '../utils/dateUtils';
import JitsiMeeting from './JitsiMeeting';
import "./Base.css";

const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

const AvailabilitySection = ({ label, userID }) => {
  const [availability, setAvailability] = useState([]);

  useEffect(() => {
    if (!userID) return;
    const fetchAvailability = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/availability/${userID}`);
        const data = await res.json();
        setAvailability(data || []);
      } catch (err) {
        console.error(`Error fetching availability for ${label}:`, err);
      }
    };
    fetchAvailability();
  }, [userID, label]);

  if (!userID) return null;

  return (
    <div className="mt-3">
      <h6><Badge bg="dark">{label} Availability</Badge></h6>
      {availability.length > 0 ? (
        <Table size="sm" bordered hover>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start</th>
              <th>End</th>
            </tr>
          </thead>
          <tbody>
            {availability.map((slot, i) => (
              <tr key={i}>
                <td>{slot.DayOfWeek}</td>
                <td>{formatTime(slot.StartTime)}</td>
                <td>{formatTime(slot.EndTime)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p className="text-muted fst-italic">No availability set.</p>
      )}
    </div>
  );
};

const EventDescription = () => {
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();
  const { eventID } = useParams();

  const [profileInfo, setProfileInfo] = useState(null);
  const [event, setEvent] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [conversationID, setConversationID] = useState(null);
  const [callError, setCallError] = useState(null);

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

  const handleAccept = async () => {
    setAccepting(true);
    setAcceptError(null);
    try {
      const res = await fetch(`http://localhost:3001/events/${eventID}/accept`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ speakerID: parseInt(userID) })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to accept');
      navigate('/inbox');
    } catch (err) {
      setAcceptError(err.message);
    } finally {
      setAccepting(false);
    }
  };

  const handleJoinCall = async () => {
    setCallError(null);
    try {
      const res = await fetch(`http://localhost:3001/inbox/conversation-by-event/${eventID}`);
      if (!res.ok) throw new Error('No conversation found for this event');
      const data = await res.json();
      setConversationID(data.conversationID);
      setCallActive(true);
    } catch (err) {
      setCallError(err.message);
    }
  };

  const isParticipant = event && (
    parseInt(userID) === event.RequesterID ||
    parseInt(userID) === event.InstructorID
  );

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
                {formatLocalDate(event?.Date)}
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

            <hr />

            <Row>
              <Col md={6}>
                <AvailabilitySection
                  label="Requester"
                  userID={event?.RequesterID}
                />
              </Col>
              <Col md={6}>
                <AvailabilitySection
                  label="Instructor"
                  userID={event?.InstructorID}
                />
              </Col>
            </Row>

            {event && !event.InstructorID && event.EventStatus === 1 && parseInt(userID) !== event.RequesterID && (
              <div className="mt-4 text-center">
                {acceptError && <div className="alert alert-danger mb-3">{acceptError}</div>}
                <Button variant="success" size="lg" onClick={handleAccept} disabled={accepting}>
                  {accepting ? 'Accepting...' : 'Accept Speaking Request'}
                </Button>
              </div>
            )}

            {event && event.EventStatus === 2 && isParticipant && !callActive && (
              <div className="mt-4 text-center">
                {callError && <div className="alert alert-danger mb-3">{callError}</div>}
                <Button variant="primary" size="lg" onClick={handleJoinCall}>
                  📹 Join Video Call
                </Button>
              </div>
            )}

            {callActive && conversationID && (
              <JitsiMeeting
                roomName={`a2iconnect-conv-${conversationID}`}
                displayName="User"
                onClose={() => setCallActive(false)}
              />
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default EventDescription;
