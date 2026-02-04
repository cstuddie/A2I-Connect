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
        // Fetch users count
        const usersResponse = await fetch('http://localhost:3001/users');
        const usersData = await usersResponse.json();
        
        // Fetch events data
        const eventsResponse = await fetch('http://localhost:3001/events');
        const eventsData = await eventsResponse.json();
        
        // Process data for stats
        const pendingEvents = eventsData.filter(event => event.status === 'Pending').length;
        const scheduledEvents = eventsData.filter(event => event.status === 'Scheduled').length;
        
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
        
        // Get user profiles for the recent users
        const userProfiles = await Promise.all(
          sortedUsers.map(async (user) => {
            const profileResponse = await fetch(`http://localhost:3001/profile/${user.userID}`);
            const profileData = await profileResponse.json();
            return { ...user, profile: profileData[0] || {} };
          })
        );
        
        setRecentUsers(userProfiles);
        
        // Get 5 most recent events
        const sortedEvents = [...eventsData].sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        ).slice(0, 5);
        
        // Enhance events with requester and instructor names
        const enhancedEvents = await Promise.all(
          sortedEvents.map(async (event) => {
            let requesterName = "Unknown";
            let instructorName = "Not Assigned";
            
            if (event.requesterID) {
              const requesterResponse = await fetch(`http://localhost:3001/profile/${event.requesterID}`);
              const requesterData = await requesterResponse.json();
              if (requesterData && requesterData[0]) {
                requesterName = requesterData[0].name;
              }
            }
            
            if (event.instructorID) {
              const instructorResponse = await fetch(`http://localhost:3001/profile/${event.instructorID}`);
              const instructorData = await instructorResponse.json();
              if (instructorData && instructorData[0]) {
                instructorName = instructorData[0].name;
              }
            }
            
            return { ...event, requesterName, instructorName };
          })
        );
        
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
                <tr key={user.userID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{user.userID}</td>
                  <td style={{ padding: '12px' }}>{user.profile?.name || 'No Name'}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.profile?.expertise || 'Not specified'}</td>
                  <td style={{ padding: '12px' }}>{user.profile?.affiliation || 'Not specified'}</td>
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
                <tr key={event.eventID} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '12px' }}>{event.eventID}</td>
                  <td style={{ padding: '12px' }}>{event.topic}</td>
                  <td style={{ padding: '12px' }}>{event.requesterName}</td>
                  <td style={{ padding: '12px' }}>{event.instructorName}</td>
                  <td style={{ padding: '12px' }}>{new Date(event.date).toLocaleDateString()}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{ 
                      padding: '5px 8px', 
                      borderRadius: '4px', 
                      fontSize: '14px',
                      backgroundColor: event.status === 'Pending' ? '#ffcb5b' : 
                                        event.status === 'Scheduled' ? '#5bc0de' : '#5cb85c',
                      color: event.status === 'Pending' ? '#000' : '#fff'
                    }}>
                      {event.status}
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