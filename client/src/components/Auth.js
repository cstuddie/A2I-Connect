import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';

function Auth() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [users, setUsers] = useState([]);

  const [showPassword, setShowPassword] = useState(false);

  // TODO: Determine if we need this
  // useEffect(() => {
  //     const fetchUser = async () => {
  //         try {
  //             const response = await fetch(`http://localhost:5000/users`);
  //             const data = await response.json();
  //             setUsers(data);
  //         } catch (error) {
  //             console.error('Error fetching profile:', error);
  //         }
  //     };
  //     fetchUser();
  // });

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
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userID', data.user.id);
        setTimeout(() => {
          setLoading(false)
          navigate('/dashboard');
        }, 500);
      } else {
        setError(data.message || 'Invalid email or password');
        setLoading(false);
      }
    } catch (error) {
      setError('Failed to connect to server');
      setLoading(false);
    }
  };

  return (
    <div>
        <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
          <Navbar.Brand as={Link} to="/">
            <h1>A2I Connect</h1>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavLink to="/login" className="nav-link me-3">
                Login
              </NavLink>
              <Button as={NavLink} variant="dark" to="/Register">
                Sign Up
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

      <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
        <h1>Login</h1>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              required
            />
          </div>
          <div style={{ position: 'relative', marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position:'absolute',
                right:'10px',
                top:'35px',
                background: 'none',
                border:'none',
                cursor:'pointer'}}
                >
                  {showPassword ? '🙈' : '👁️'} 
            </button>
          </div>
          <Button 
            type="submit" 
            disabled={loading}
            variant='dark'
            style={{ 
              width: '100%', 
              padding: '10px', 
              color: 'white', 
              border: 'none',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </form>
      </div>
    </div>
  );
}

export default Auth;