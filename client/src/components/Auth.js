import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { NavLink, Link } from 'react-router-dom';
import useTranslation from '../utils/useTranslation';
import "./LandingPage.css"
import "./Auth.css"


function Auth() {
  const navigate = useNavigate();
  const t = useTranslation();
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

    if (!formData.email.trim() || !formData.password.trim()) {
      setError('Please fill out all fields. Spaces-only entries are not allowed.')
      setLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
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
        localStorage.setItem('preferredLanguage', data.user.preferredLanguage || 'en');
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
    <div className="auth-root">
      {/* Navbar */}
      <nav className="landing-nav">
        <Link to="/" className="nav-logo">A2I Connect</Link>
        <div className="nav-links">
          <NavLink to="/login" className="nav-link-text">Log in</NavLink>
          <NavLink to="/Register" className="nav-btn-outline">Sign up</NavLink>
        </div>
      </nav>

      {/* Auth Card */}

      <div className='auth-wrapper'>
        <div className='auth-card'>
          <div className='auth-header'>
            <h1 className='auth-title'>Log in</h1>
          </div>
          {error && (
            <div className='auth-error'>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className='auth-form'>
            <div className='auth-field'>
              <label className="auth-label">{t.email}:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className='auth-input'
                placeholder='user@example.com'
                required
              ></input>
            </div>

            <div className="auth-field">
              <label className="auth-label">{t.password}</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="auth-input"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? 'Logging in...' : 'Log in'}
            </button>
          </form>
          <p className="auth-sub">
              Don't have an account?{' '}
              <Link to="/Register" className="auth-switch-link">Sign up</Link>
            </p>
        </div>
      </div>
    </div>
  );
}

export default Auth;