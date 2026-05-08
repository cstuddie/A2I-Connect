import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import { formatLocalDate } from '../utils/dateUtils';
import JitsiMeeting from './JitsiMeeting';
import './LandingPage.css';
import './EventDes.css';
import useTranslation from '../utils/useTranslation';

const statusLabels = { 1: 'Pending', 2: 'Confirmed', 3: 'Completed' };

const formatTime = (time) => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours, 10);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:${minutes} ${ampm}`;
};

const AvailabilitySection = ({ label, availabilityLabel, noAvailabilityText, userID }) => {
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
    <div className="avail-section">
      <h4 className="avail-title">{availabilityLabel || `${label} Availability`}</h4>
      {availability.length > 0 ? (
        <div className="avail-table-wrapper">
          <table className="avail-table">
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
          </table>
        </div>
      ) : (
        <p className="dash-empty">{noAvailabilityText || 'No availability set.'}</p>
      )}
    </div>
  );
};

const EventDescription = () => {
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();
  const t = useTranslation();
  const { eventID } = useParams();

  const [profileInfo, setProfileInfo] = useState(null);
  const [event, setEvent] = useState(null);
  const [accepting, setAccepting] = useState(false);
  const [acceptError, setAcceptError] = useState(null);
  const [callActive, setCallActive] = useState(false);
  const [conversationID, setConversationID] = useState(null);
  const [callError, setCallError] = useState(null);

  useEffect(() => {
    if (!userID) { navigate('/login'); return; }
    const fetchProfile = async () => {
      try {
        const res = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await res.json();
        setProfileInfo(data);
      } catch (err) { console.error(err); }
    };
    fetchProfile();
  }, [userID, navigate]);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`http://localhost:3001/events/${eventID}`);
        const data = await res.json();
        setEvent(data);
      } catch (err) { console.error(err); }
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
    <div className="dash-root">
      <UserHeader name={profileInfo ? `${profileInfo.FirstName} ${profileInfo.LastName}` : ''} />

      <div className="dash-banner">
        <div className="dash-banner-inner">
          <h1 className="dash-banner-title">{event?.Topic || t.eventDetail}</h1>
          <p className="dash-banner-sub">{t.eventDetail || 'Event Details'}</p>
        </div>
      </div>

      <div className="ed-body">

        {/* Main Info Card */}
        <div className="ed-main">
          <div className="ed-card">

            {/* Details Grid */}
            <div className="ed-details-grid">
              <div className="ed-detail-item">
                <span className="ed-detail-label">{t.instructor}</span>
                <span className="ed-detail-value">{event?.InstructorName || 'Unassigned'}</span>
              </div>
              <div className="ed-detail-item">
                <span className="ed-detail-label">{t.requester}</span>
                <span className="ed-detail-value">{event?.RequesterName || 'N/A'}</span>
              </div>
              <div className="ed-detail-item">
                <span className="ed-detail-label">{t.date}</span>
                <span className="ed-detail-value">{formatLocalDate(event?.Date)}</span>
              </div>
              <div className="ed-detail-item">
                <span className="ed-detail-label">{t.deliveryMethod}</span>
                <span className="ed-detail-value">{event?.DeliveryMethod || 'N/A'}</span>
              </div>
              <div className="ed-detail-item">
                <span className="ed-detail-label">{t.status}</span>
                <span className={`ed-status-badge status-${event?.EventStatus}`}>
                  {statusLabels[event?.EventStatus] || 'N/A'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="ed-description">
              <span className="ed-detail-label">{t.description}</span>
              <p className="ed-description-text">{event?.Description || 'N/A'}</p>
            </div>

            {/* Actions */}
            {event && !event.InstructorID && event.EventStatus === 1 && parseInt(userID) !== event.RequesterID && (
              <div className="ed-actions">
                {acceptError && <div className="auth-error">{acceptError}</div>}
                <button className="ed-accept-btn" onClick={handleAccept} disabled={accepting}>
                  {accepting ? 'Accepting...' : 'Accept Speaking Request'}
                </button>
              </div>
            )}

            {event && event.EventStatus === 2 && isParticipant && !callActive && (
              <div className="ed-actions">
                {callError && <div className="auth-error">{callError}</div>}
                <button className="ed-call-btn" onClick={handleJoinCall}>
                  📹 Join Video Call
                </button>
              </div>
            )}

            {callActive && conversationID && (
              <JitsiMeeting
                roomName={`a2iconnect-conv-${conversationID}`}
                displayName="User"
                onClose={() => setCallActive(false)}
              />
            )}
          </div>

          {/* Availability */}
          <div className="ed-card">
            <h3 className="ed-avail-heading">Availability</h3>
            <div className="ed-avail-grid">
              <AvailabilitySection
                label={t.requester}
                availabilityLabel={t.requesterAvailability}
                noAvailabilityText={t.noAvailability}
                userID={event?.RequesterID}
              />
              <AvailabilitySection
                label={t.instructor}
                availabilityLabel={t.instructorAvailability}
                noAvailabilityText={t.noAvailability}
                userID={event?.InstructorID}
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EventDescription;