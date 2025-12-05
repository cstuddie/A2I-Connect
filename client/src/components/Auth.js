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


  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
     setError(''); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if(!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill out all fields. Spaces-only entries are not allowed.')
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(formData.email.trim())) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }
  
    try {
      const response = await fetch('http://localhost:3001/api/auth/login', {
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
        const errorMessage = data.message || 'Invalid email or password';
        setError(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error('Login error', error);
      setError('Unable to connect to server. Please check your internet connection and try again.');
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
        {error && (
          <div style={{
            color: 'red',
            backgroundColor:'#ffe6e6',
            padding:'10px',
            marginBottom:'15px',
            borderRadius:'5px',
            textAlign:'center',
            border:'1px solid #ffcccc'
          }}>
            {error}
          </div>
        )}
        
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
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{ width: '100%', padding: '8px' }}
              required
            />
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
        <div style={{textAlign:'center', marginTop:'15px', color:'#666'}}>
            Don't have an account?{' '}
            <Link to="/Register" style={{color:'#0B3444', textDecoration:'none'}}>
              Sign up here
            </Link>
        </div>
      </div>
    </div>
  );
}

export default Auth;