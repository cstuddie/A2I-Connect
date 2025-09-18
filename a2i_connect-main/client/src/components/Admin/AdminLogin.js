import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import '../Base.css';

function AdminLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminID', data.admin.id);
        setTimeout(() => {
          setLoading(false);
          navigate('/admin/dashboard');
        }, 500);
      } else {
        setError(data.message || 'Login failed');
        setLoading(false);
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('Server error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <div>
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: 'white',
          position: 'sticky',
          top: '0',
          zIndex: '100',
          borderBottom: '1px solid #ccc',
        }}
      >
        <NavLink to="/" style={{textDecoration: 'none'}}><h1>A2I Connect</h1></NavLink>
        <h3 style={{ color: '#0B3444' }}>Admin Portal</h3>
      </header>
      <div className="form-container" style={{ maxWidth: '400px', margin: '50px auto' }}>
        <h1 style={{ textAlign: 'center' }}>Admin Login</h1>
        {error && <div style={{ color: 'red', marginBottom: '10px', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="cta-container">
            <button 
              type="submit" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;