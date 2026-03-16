import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import '../Base.css';

// Admin Header Component
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
        <NavLink to="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h1>A2I Connect Admin</h1>
        </NavLink>
      </div>
      <div style={{ display: 'flex', gap: '20px' }}>
        <NavLink to="/admin/dashboard" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Dashboard</h4>
        </NavLink>
        <NavLink to="/admin/users" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Users</h4>
        </NavLink>
        <NavLink to="/admin/events" style={{ textDecoration: 'none', color: 'white' }}>
          <h4>Events</h4>
        </NavLink>
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

// Main Dashboard Component
const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEvents: 0,
    pendingEvents: 0,
    scheduledEvents: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEvents, setRecentEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if admin is logged in
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        // Fetch users
        const usersResponse = await fetch('http://localhost:3001/users');
        const usersData = await usersResponse.json();

        // Fetch events
        const eventsResponse = await fetch('http://localhost:3001/events');
        const eventsData = await eventsResponse.json();

        // Build a lookup map for user names by ID
        const userMap = {};
        usersData.forEach(u => {
          userMap[u.ID] = `${u.FirstName} ${u.LastName}`;
        });

        // Process data for stats
        const pendingEvents = eventsData.filter(event => event.EventStatus === 1).length;
        const scheduledEvents = eventsData.filter(event => event.EventStatus === 2).length;

        setStats({
          totalUsers: usersData.length,
          totalEvents: eventsData.length,
          pendingEvents,
          scheduledEvents
        });

        // Get 5 most recent users
        const sortedUsers = [...usersData].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);

        setRecentUsers(sortedUsers);

        // Get 5 most recent events with names
        const sortedEvents = [...eventsData].sort((a, b) =>
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);

        const enhancedEvents = sortedEvents.map(event => ({
          ...event,
          requesterName: userMap[event.RequesterID] || 'Unknown',
          instructorName: event.InstructorID ? (userMap[event.InstructorID] || 'Unknown') : 'Not Assigned'
        }));

        setRecentEvents(enhancedEvents);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  if (loading) {
    return (
      <div>
        <AdminHeader />
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Loading dashboard data...</h2>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminHeader />
      
      <div style={{ padding: '20px' }}>
        <h1>Admin Dashboard</h1>
        
        {/* Stats Cards */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '30px' 
        }}>
          <div className="card" style={{ background: '#f4f7f6', padding: '20px', borderRadius: '8px' }}>
            <h3>Total Users</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalUsers}</p>
          </div>
          
          <div className="card" style={{ background: '#f4f7f6', padding: '20px', borderRadius: '8px' }}>
            <h3>Total Events</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.totalEvents}</p>
          </div>
          
          <div className="card" style={{ background: '#f4f7f6', padding: '20px', borderRadius: '8px' }}>
            <h3>Pending Events</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.pendingEvents}</p>
          </div>
          
          <div className="card" style={{ background: '#f4f7f6', padding: '20px', borderRadius: '8px' }}>
            <h3>Scheduled Events</h3>
            <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{stats.scheduledEvents}</p>
          </div>
        </div>
        
        {/* Recent Users */}
        <div style={{ marginBottom: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Recent Users</h2>
            <NavLink to="/admin/users" className="cta-button" style={{ padding: '8px 15px' }}>
              View All Users
            </NavLink>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#0B3444', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Expertise</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Affiliation</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user) => (
                <tr key={user.ID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{user.ID}</td>
                  <td style={{ padding: '12px' }}>{user.FirstName} {user.LastName}</td>
                  <td style={{ padding: '12px' }}>{user.Email}</td>
                  <td style={{ padding: '12px' }}>{user.ExpertiseID || 'Not specified'}</td>
                  <td style={{ padding: '12px' }}>{user.Affiliation || 'Not specified'}</td>
                  <td style={{ padding: '12px' }}>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Recent Events */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h2>Recent Events</h2>
            <NavLink to="/admin/events" className="cta-button" style={{ padding: '8px 15px' }}>
              View All Events
            </NavLink>
          </div>
          
          <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: 'white' }}>
            <thead>
              <tr style={{ backgroundColor: '#0B3444', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>ID</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Topic</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Requester</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Instructor</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentEvents.map((event) => (
                <tr key={event.ID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{event.ID}</td>
                  <td style={{ padding: '12px' }}>{event.Topic}</td>
                  <td style={{ padding: '12px' }}>{event.requesterName}</td>
                  <td style={{ padding: '12px' }}>{event.instructorName}</td>
                  <td style={{ padding: '12px' }}>{event.Date ? new Date(event.Date).toLocaleDateString() : 'No Date'}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '5px 8px',
                      borderRadius: '4px',
                      fontSize: '14px',
                      backgroundColor: event.EventStatus === 1 ? '#ffcb5b' :
                                        event.EventStatus === 2 ? '#5bc0de' : '#5cb85c',
                      color: event.EventStatus === 1 ? '#000' : '#fff'
                    }}>
                      {event.EventStatus === 1 ? 'Pending' : event.EventStatus === 2 ? 'Scheduled' : 'Completed'}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button className="cta-button" style={{ padding: '5px 10px', fontSize: '14px', marginRight: '5px' }}>Edit</button>
                    <button className="cta-button" style={{ padding: '5px 10px', fontSize: '14px', backgroundColor: '#d9534f' }}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;