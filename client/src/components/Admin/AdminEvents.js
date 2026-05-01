import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatLocalDate } from '../../utils/dateUtils';
import '../Base.css';

// Reusing AdminHeader component
function AdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminID');
    navigate('/admin/login');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#0B3444',
        color: 'white',
        position: 'sticky',
        top: '0',
        zIndex: '100',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>A2I Connect Admin</h1>
        </a>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <a href="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Dashboard</h4>
        </a>
        <a href="/admin/users" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Users</h4>
        </a>
        <a href="/admin/events" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Events</h4>
        </a>
        <button
          onClick={handleLogout}
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            textDecoration: 'underline',
            cursor: 'pointer',
            fontSize: '16px',
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

const STATUS_MAP = {
  1: 'Pending',
  2: 'Scheduled',
  3: 'Completed',
  4: 'Cancelled'
};

const AdminEvents = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const [eventFormData, setEventFormData] = useState({
    topic: '',
    description: '',
    date: '',
    deliveryMethod: '',
    eventStatus: '',
    instructorID: ''
  });
  const [filters, setFilters] = useState({
    status: '',
    deliveryMethod: ''
  });
  const [users, setUsers] = useState([]);
  const [userMap, setUserMap] = useState({});

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all events
        const eventsResponse = await fetch('http://localhost:3001/events');
        const eventsData = await eventsResponse.json();

        // Fetch all users for name lookup and dropdown
        const usersResponse = await fetch('http://localhost:3001/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);

        // Build user ID -> name map
        const map = {};
        usersData.forEach(u => {
          map[u.ID] = `${u.FirstName} ${u.LastName}`;
        });
        setUserMap(map);

        // Enhance events with requester and instructor names
        const enhancedEvents = eventsData.map(event => ({
          ...event,
          requesterName: map[event.RequesterID] || 'Unknown',
          instructorName: event.InstructorID ? (map[event.InstructorID] || 'Unknown') : 'Not Assigned'
        }));

        setEvents(enhancedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    const dateStr = event.Date ? event.Date.split('T')[0] : '';
    setEventFormData({
      topic: event.Topic,
      description: event.Description || '',
      date: dateStr,
      deliveryMethod: event.DeliveryMethod || '',
      eventStatus: event.EventStatus || '',
      instructorID: event.InstructorID || ''
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();

    // Update local state (no API endpoint for event update yet)
    setEvents(events.map(event => {
      if (event.ID === editingEvent.ID) {
        return {
          ...event,
          Topic: eventFormData.topic,
          Description: eventFormData.description,
          Date: eventFormData.date,
          DeliveryMethod: eventFormData.deliveryMethod,
          EventStatus: Number(eventFormData.eventStatus),
          InstructorID: eventFormData.instructorID === '' ? null : Number(eventFormData.instructorID),
          instructorName: eventFormData.instructorID ? (userMap[eventFormData.instructorID] || 'Unknown') : 'Not Assigned'
        };
      }
      return event;
    }));

    setEditingEvent(null);
    alert('Event updated successfully');
  };

  const handleDeleteEvent = async (eventID) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      // Update local state (no API endpoint for event delete yet)
      setEvents(events.filter(event => event.ID !== eventID));
      alert('Event deleted successfully');
    }
  };

  // Filter events based on search term and filters
  const filteredEvents = events.filter(event => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch =
      (event.Topic || '').toLowerCase().includes(searchTermLower) ||
      (event.Description || '').toLowerCase().includes(searchTermLower) ||
      (event.requesterName || '').toLowerCase().includes(searchTermLower) ||
      (event.instructorName || '').toLowerCase().includes(searchTermLower);

    const statusLabel = STATUS_MAP[event.EventStatus] || '';
    const matchesStatus = !filters.status || statusLabel === filters.status;
    const matchesDeliveryMethod = !filters.deliveryMethod || event.DeliveryMethod === filters.deliveryMethod;

    return matchesSearch && matchesStatus && matchesDeliveryMethod;
  });

  // Get unique values for filter dropdowns
  const uniqueStatuses = [...new Set(events.map(event => STATUS_MAP[event.EventStatus]).filter(Boolean))];
  const uniqueDeliveryMethods = [...new Set(events.map(event => event.DeliveryMethod).filter(Boolean))];

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Loading events...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />

      <div style={{ padding: '20px' }}>
        <h1>Event Management</h1>

        {/* Edit Event Modal */}
        {editingEvent && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000
          }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '600px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
              <h2>Edit Event</h2>
              <form onSubmit={handleUpdateEvent}>
                <label htmlFor="topic">Topic</label>
                <input
                  type="text"
                  id="topic"
                  name="topic"
                  value={eventFormData.topic}
                  onChange={(e) => setEventFormData({...eventFormData, topic: e.target.value})}
                  required
                />

                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={eventFormData.description}
                  onChange={(e) => setEventFormData({...eventFormData, description: e.target.value})}
                  style={{ minHeight: '100px' }}
                />

                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                />

                <label htmlFor="deliveryMethod">Delivery Method</label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={eventFormData.deliveryMethod}
                  onChange={(e) => setEventFormData({...eventFormData, deliveryMethod: e.target.value})}
                >
                  <option value="">Select delivery method</option>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </select>

                <label htmlFor="eventStatus">Status</label>
                <select
                  id="eventStatus"
                  name="eventStatus"
                  value={eventFormData.eventStatus}
                  onChange={(e) => setEventFormData({...eventFormData, eventStatus: e.target.value})}
                >
                  <option value="">Select status</option>
                  <option value="1">Pending</option>
                  <option value="2">Scheduled</option>
                  <option value="3">Completed</option>
                  <option value="4">Cancelled</option>
                </select>

                <label htmlFor="instructorID">Instructor</label>
                <select
                  id="instructorID"
                  name="instructorID"
                  value={eventFormData.instructorID}
                  onChange={(e) => setEventFormData({...eventFormData, instructorID: e.target.value})}
                >
                  <option value="">Not Assigned</option>
                  {users.filter(u => u.Role === 2).map(user => (
                    <option key={user.ID} value={user.ID}>
                      {user.FirstName} {user.LastName}
                    </option>
                  ))}
                </select>

                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={() => setEditingEvent(null)}
                    style={{ marginRight: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
                  >
                    Cancel
                  </button>
                  <button type="submit">Update Event</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search events by topic, description, requester, instructor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, padding: '10px', fontSize: '16px' }}
            />
            <button
              onClick={() => {
                setSearchTerm('');
                setFilters({ status: '', deliveryMethod: '' });
              }}
              style={{ padding: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
            >
              Clear Filters
            </button>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={filters.status}
              onChange={(e) => setFilters({...filters, status: e.target.value})}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">All Statuses</option>
              {uniqueStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>

            <select
              value={filters.deliveryMethod}
              onChange={(e) => setFilters({...filters, deliveryMethod: e.target.value})}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">All Delivery Methods</option>
              {uniqueDeliveryMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Events Table */}
        <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
          <thead>
            <tr style={{ backgroundColor: '#0B3444', color: 'white' }}>
              <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Topic</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Requester</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Instructor</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Delivery</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.ID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{event.ID}</td>
                  <td style={{ padding: '12px' }}>{event.Topic}</td>
                  <td style={{ padding: '12px' }}>{event.requesterName}</td>
                  <td style={{ padding: '12px' }}>{event.instructorName}</td>
                  <td style={{ padding: '12px' }}>{formatLocalDate(event.Date)}</td>
                  <td style={{ padding: '12px' }}>{event.DeliveryMethod || 'N/A'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '5px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: event.EventStatus === 1 ? '#ffcb5b' :
                                        event.EventStatus === 2 ? '#5bc0de' :
                                        event.EventStatus === 3 ? '#5cb85c' : '#d9534f',
                      color: event.EventStatus === 1 ? '#000' : '#fff'
                    }}>
                      {STATUS_MAP[event.EventStatus] || 'Unknown'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      className="cta-button"
                      onClick={() => handleEditEvent(event)}
                      style={{ padding: '5px 10px', fontSize: '14px', marginRight: '5px' }}
                    >
                      Edit
                    </button>
                    <button
                      className="cta-button"
                      onClick={() => handleDeleteEvent(event.ID)}
                      style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#d9534f' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ padding: '20px', textAlign: 'center' }}>
                  No events found matching your search criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminEvents;
