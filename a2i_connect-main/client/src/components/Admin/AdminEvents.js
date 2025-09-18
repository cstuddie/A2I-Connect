import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    field: '',
    deliveryMethod: '',
    status: '',
    instructorID: ''
  });
  const [filters, setFilters] = useState({
    field: '',
    status: '',
    deliveryMethod: ''
  });
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState({});
  
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
        const eventsResponse = await fetch('http://localhost:5000/events');
        const eventsData = await eventsResponse.json();
        
        // Fetch all users for dropdown selection
        const usersResponse = await fetch('http://localhost:5000/users');
        const usersData = await usersResponse.json();
        setUsers(usersData);
        
        // Fetch all profiles to map user IDs to names
        const profilesResponse = await fetch('http://localhost:5000/profiles');
        const profilesData = await profilesResponse.json();
        
        // Create a map of userID to profile information
        const profileMap = {};
        profilesData.forEach(profile => {
          profileMap[profile.userID] = profile;
        });
        setProfiles(profileMap);
        
        // Enhance events with requester and instructor names
        const enhancedEvents = eventsData.map(event => {
          const requesterProfile = profileMap[event.requesterID];
          const instructorProfile = event.instructorID ? profileMap[event.instructorID] : null;
          
          return {
            ...event,
            requesterName: requesterProfile ? requesterProfile.name : 'Unknown',
            instructorName: instructorProfile ? instructorProfile.name : 'Not Assigned'
          };
        });
        
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
    setEventFormData({
      topic: event.topic,
      description: event.description,
      date: event.date.split('T')[0], // Format date for input
      field: event.field,
      deliveryMethod: event.deliveryMethod,
      status: event.status,
      instructorID: event.instructorID || ''
    });
  };

  const handleUpdateEvent = async (e) => {
    e.preventDefault();
    
    try {
      // In a real application, you would make an API call to update the event
      // For now, we'll just update the UI
      
      // Update local state
      setEvents(events.map(event => {
        if (event.eventID === editingEvent.eventID) {
          const instructorProfile = eventFormData.instructorID ? profiles[eventFormData.instructorID] : null;
          
          return {
            ...event,
            topic: eventFormData.topic,
            description: eventFormData.description,
            date: eventFormData.date,
            field: eventFormData.field,
            deliveryMethod: eventFormData.deliveryMethod,
            status: eventFormData.status,
            instructorID: eventFormData.instructorID === '' ? null : eventFormData.instructorID,
            instructorName: instructorProfile ? instructorProfile.name : 'Not Assigned'
          };
        }
        return event;
      }));
      
      setEditingEvent(null);
      alert('Event updated successfully');
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Error updating event');
    }
  };

  const handleDeleteEvent = async (eventID) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      try {
        // In a real application, you would make an API call to delete the event
        // For now, we'll just update the UI
        setEvents(events.filter(event => event.eventID !== eventID));
        alert('Event deleted successfully');
      } catch (error) {
        console.error('Error deleting event:', error);
        alert('Error deleting event');
      }
    }
  };

  // Filter events based on search term and filters
  const filteredEvents = events.filter(event => {
    const searchTermLower = searchTerm.toLowerCase();
    const matchesSearch = 
      event.topic.toLowerCase().includes(searchTermLower) ||
      event.description.toLowerCase().includes(searchTermLower) ||
      event.requesterName.toLowerCase().includes(searchTermLower) ||
      event.instructorName.toLowerCase().includes(searchTermLower);
    
    const matchesField = !filters.field || event.field === filters.field;
    const matchesStatus = !filters.status || event.status === filters.status;
    const matchesDeliveryMethod = !filters.deliveryMethod || event.deliveryMethod === filters.deliveryMethod;
    
    return matchesSearch && matchesField && matchesStatus && matchesDeliveryMethod;
  });

  // Get unique fields, statuses, and delivery methods for filter dropdowns
  const uniqueFields = [...new Set(events.map(event => event.field))];
  const uniqueStatuses = [...new Set(events.map(event => event.status))];
  const uniqueDeliveryMethods = [...new Set(events.map(event => event.deliveryMethod))];

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
                  required
                  style={{ minHeight: '100px' }}
                />
                
                <label htmlFor="field">Field</label>
                <select
                  id="field"
                  name="field"
                  value={eventFormData.field}
                  onChange={(e) => setEventFormData({...eventFormData, field: e.target.value})}
                  required
                >
                  <option value="">Select a field</option>
                  {uniqueFields.map(field => (
                    <option key={field} value={field}>{field}</option>
                  ))}
                </select>
                
                <label htmlFor="date">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={eventFormData.date}
                  onChange={(e) => setEventFormData({...eventFormData, date: e.target.value})}
                  required
                />
                
                <label htmlFor="deliveryMethod">Delivery Method</label>
                <select
                  id="deliveryMethod"
                  name="deliveryMethod"
                  value={eventFormData.deliveryMethod}
                  onChange={(e) => setEventFormData({...eventFormData, deliveryMethod: e.target.value})}
                  required
                >
                  <option value="">Select delivery method</option>
                  <option value="Online">Online</option>
                  <option value="In-Person">In-Person</option>
                </select>
                
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  name="status"
                  value={eventFormData.status}
                  onChange={(e) => setEventFormData({...eventFormData, status: e.target.value})}
                  required
                >
                  <option value="">Select status</option>
                  <option value="Pending">Pending</option>
                  <option value="Scheduled">Scheduled</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                
                <label htmlFor="instructorID">Instructor</label>
                <select
                  id="instructorID"
                  name="instructorID"
                  value={eventFormData.instructorID}
                  onChange={(e) => setEventFormData({...eventFormData, instructorID: e.target.value})}
                >
                  <option value="">Not Assigned</option>
                  {users.map(user => (
                    <option key={user.userID} value={user.userID}>
                      {profiles[user.userID]?.name || user.email}
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
                setFilters({ field: '', status: '', deliveryMethod: '' });
              }}
              style={{ padding: '10px', backgroundColor: '#f0f0f0', color: '#333' }}
            >
              Clear Filters
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '10px' }}>
            <select
              value={filters.field}
              onChange={(e) => setFilters({...filters, field: e.target.value})}
              style={{ flex: 1, padding: '8px' }}
            >
              <option value="">All Fields</option>
              {uniqueFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
            
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
              <th style={{ padding: '12px', textAlign: 'left' }}>Field</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Delivery</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <tr key={event.eventID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{event.eventID}</td>
                  <td style={{ padding: '12px' }}>{event.topic}</td>
                  <td style={{ padding: '12px' }}>{event.requesterName}</td>
                  <td style={{ padding: '12px' }}>{event.instructorName}</td>
                  <td style={{ padding: '12px' }}>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>{event.field}</td>
                  <td style={{ padding: '12px' }}>{event.deliveryMethod}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 8px', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      backgroundColor: event.status === 'Pending' ? '#ffcb5b' : 
                                        event.status === 'Scheduled' ? '#5bc0de' : 
                                        event.status === 'Completed' ? '#5cb85c' : '#d9534f',
                      color: event.status === 'Pending' ? '#000' : '#fff'
                    }}>
                      {event.status}
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
                      onClick={() => handleDeleteEvent(event.eventID)}
                      style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#d9534f' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" style={{ padding: '20px', textAlign: 'center' }}>
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