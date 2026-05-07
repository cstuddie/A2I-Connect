import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import t from '../utils/registerTranslations';
import './LandingPage.css'
import './Register.css'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 1,
    expertiseID: '',
    bio: '',
    affiliation: 'Independent Professional',
    preferredLanguage: 'en',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('first');

  const lang = t[formData.preferredLanguage] || t.en;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const payload = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: Number(formData.role),
      expertiseID: formData.expertiseID ? Number(formData.expertiseID) : null,
      bio: formData.bio || null,
      affiliation: formData.affiliation || null,
      preferredLanguage: formData.preferredLanguage || 'en',
    };

    try {
      const res = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful");
        navigate("/login");
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Server error during registration");
      console.error(err);
    }
  };

  const handleNext = () => {
    if (activeTab === 'first') {
      if (!formData.firstName.trim() || !formData.lastName.trim() ||
        !formData.email.trim() || !formData.password.trim() ||
        !formData.confirmPassword.trim()) {
        setError('Please fill out all fields. Spaces-only entries are not allowed.');
        return;
      }

      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(formData.firstName.trim())) {
        setError('First name cannot contain numbers or special characters');
        return;
      }
      if (!nameRegex.test(formData.lastName.trim())) {
        setError('Last name cannot contain numbers or special characters');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        setError('Please enter a valid email address');
        return;
      }

      setError('');
      setActiveTab('second');
    } else if (activeTab === 'second') {
      if (!formData.affiliation.trim() || !formData.expertiseID) {
        setError('Please fill out all required fields (Role, Expertise, and Affiliation)');
        return;
      }
      setError('');
      setActiveTab('third');
    }
  };

  const handlePrevious = () => {
    setError('');
    if (activeTab === 'second') setActiveTab('first');
    else if (activeTab === 'third') setActiveTab('second');
  };

  const steps = ['first', 'second'];
  const currentStep = steps.indexOf(activeTab) + 1;

  return (
    <div className='auth-root'>

      {/* Navbar */}

      <nav className='landing-nav'>
        <Link to="/" className='nav-logo'>A2I Connect</Link>
        <div className='nav-links'>
          <NavLink to="/login" className="nav-link-text">{lang.alreadyHaveAccount}</NavLink>
        </div>
      </nav>

      <div className='auth-wrapper reg-wrapper'>
        <div className='auth-card reg-card'>

          {/* Header */}
          <div className='auth-header'>
            <h1 className='auth-title'>{lang.pageTitle}</h1>
            <p className='auth-sub'>{lang.pageSubtitle}</p>
          </div>

          {/* Step Indicator */}
          <div className="reg-steps">
            <div className={`reg-step ${activeTab === 'first' ? 'active' : currentStep > 1 ? 'done' : ''}`}>
              <div className="reg-step-dot">{currentStep > 1 ? '✓' : '1'}</div>
              <span>Account</span>
            </div>
            <div className="reg-step-line" />
            <div className={`reg-step ${activeTab === 'second' ? 'active' : ''}`}>
              <div className="reg-step-dot">2</div>
              <span>Profile</span>
            </div>
          </div>

          {/* Error */}
          {error && <div className='auth-error'>{error}</div>}

          {/* Step 1 */}
          {activeTab === 'first' && (
            <form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="auth-form">
 
              <div className="reg-row">
                <div className="auth-field">
                  <label className="auth-label">{lang.firstName}</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="John"
                    required
                  />
                </div>
                <div className="auth-field">
                  <label className="auth-label">{lang.lastName}</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="auth-input"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.email}</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="example@domain.com"
                  required
                />
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.password}</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Min. 8 characters"
                  minLength={8}
                  required
                />
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.confirmPassword}</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder="Confirm your password"
                  required
                />
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.preferredLanguage}</label>
                <select
                  name="preferredLanguage"
                  value={formData.preferredLanguage}
                  onChange={handleChange}
                  className="auth-input auth-select"
                >
                  <option value="en">English</option>
                  <option value="es">Español (Spanish)</option>
                  <option value="fr">Français (French)</option>
                  <option value="de">Deutsch (German)</option>
                  <option value="it">Italiano (Italian)</option>
                  <option value="nl">Nederlands (Dutch)</option>
                  <option value="pl">Polski (Polish)</option>
                  <option value="ro">Română (Romanian)</option>
                  <option value="sv">Svenska (Swedish)</option>
                  <option value="uk">Українська (Ukrainian)</option>
                  <option value="ru">Русский (Russian)</option>
                  <option value="ar">العربية (Arabic)</option>
                  <option value="fa">فارسی (Persian)</option>
                  <option value="ur">اردو (Urdu)</option>
                  <option value="hi">हिन्दी (Hindi)</option>
                  <option value="bn">বাংলা (Bengali)</option>
                  <option value="zh">中文简体 (Chinese Simplified)</option>
                  <option value="zh-TW">中文繁體 (Chinese Traditional)</option>
                  <option value="ja">日本語 (Japanese)</option>
                  <option value="ko">한국어 (Korean)</option>
                  <option value="th">ภาษาไทย (Thai)</option>
                  <option value="vi">Tiếng Việt (Vietnamese)</option>
                  <option value="id">Bahasa Indonesia (Indonesian)</option>
                  <option value="ms">Bahasa Melayu (Malay)</option>
                  <option value="tl">Filipino (Tagalog)</option>
                  <option value="sw">Kiswahili (Swahili)</option>
                  <option value="pt">Português (Portuguese)</option>
                  <option value="tr">Türkçe (Turkish)</option>
                </select>
              </div>
 
              <button type="submit" className="auth-submit-btn">{lang.next}</button>
            </form>
          )}

          {/* Step 2 */}
          {activeTab === 'second' && (
            <form onSubmit={handleSubmit} className="auth-form">
 
              <div className="auth-field">
                <label className="auth-label">{lang.role}</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="auth-input auth-select"
                  required
                >
                  <option value={1}>{lang.roleUser}</option>
                  <option value={2}>{lang.roleExpert}</option>
                </select>
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.expertise}</label>
                <select
                  name="expertiseID"
                  value={formData.expertiseID}
                  onChange={handleChange}
                  className="auth-input auth-select"
                  required
                >
                  <option value="">{lang.selectExpertise}</option>
                  <option value={1}>Web Development</option>
                  <option value={2}>Data Science</option>
                  <option value={3}>AI & Machine Learning</option>
                  <option value={4}>Cybersecurity</option>
                </select>
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.affiliation}</label>
                <input
                  type="text"
                  name="affiliation"
                  value={formData.affiliation}
                  onChange={handleChange}
                  className="auth-input"
                  placeholder={lang.affiliationPlaceholder}
                  required
                />
              </div>
 
              <div className="auth-field">
                <label className="auth-label">{lang.bio}</label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="auth-input auth-textarea"
                  placeholder={lang.bioPlaceholder}
                  required
                />
              </div>
 
              <div className="reg-btn-row">
                <button type="button" className="auth-back-btn" onClick={handlePrevious}>
                  ← {lang.previous}
                </button>
                <button type="submit" className="auth-submit-btn reg-submit">
                  {lang.submit}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};

export default Register;
