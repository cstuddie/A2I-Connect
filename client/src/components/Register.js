import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import t from '../utils/registerTranslations';
import './Base.css';

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

  return (
    <div>
      <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
        <Navbar.Brand as={Link} to="/">
          <h1>A2I Connect</h1>
        </Navbar.Brand>
        <Nav className="ms-auto">
          <NavLink to="/Login" className="nav-link me-3">
            {lang.alreadyHaveAccount}
          </NavLink>
        </Nav>
      </Navbar>

      <Container>
        <h1 style={{ textAlign: 'center' }}>{lang.pageTitle}</h1>
        <p style={{ textAlign: 'center' }}>{lang.pageSubtitle}</p>

        {error && (
          <div style={{
            color: 'red',
            backgroundColor: '#ffe6e6',
            padding: '10px',
            marginBottom: '15px',
            borderRadius: '5px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}

        <div className="form-container">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{ display: 'none' }}>
            <Tab eventKey="first" title="Part 1">
              <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="mt-4">
                <Row>
                  <Col md={4}>
                    <p className='text-muted'>{lang.step1of2}</p>
                    <p><strong>{lang.step1desc}</strong></p>
                    <p>{lang.step1subdesc}</p>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.firstName}</Form.Label>
                      <Form.Control
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        placeholder="John"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.lastName}</Form.Label>
                      <Form.Control
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        placeholder="Doe"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.email}</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        placeholder="example@domain.com"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.password}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        placeholder="Enter a password"
                        required
                        minLength={8}
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.confirmPassword}</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        placeholder="Confirm your password"
                        required
                        onChange={handleChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label style={{ color: 'black' }}>{lang.preferredLanguage}</Form.Label>
                      <Form.Select
                        name="preferredLanguage"
                        value={formData.preferredLanguage}
                        onChange={handleChange}
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
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="dark" type="submit">
                    {lang.next}
                  </Button>
                </div>
              </Form>
            </Tab>

            <Tab eventKey="second" title="Part 2">
              <Form onSubmit={handleSubmit} className="mt-3">
                <Row>
                  <Col md={4}>
                    <p className='text-muted'>{lang.step2of2}</p>
                    <p><strong>{lang.step2desc}</strong></p>
                    <p>{lang.step2subdesc}</p>
                  </Col>
                  <Col md={8}>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{lang.role}</Form.Label>
                      <Col sm="10">
                        <Form.Select
                          name="role"
                          value={formData.role}
                          onChange={handleChange}
                          required
                        >
                          <option value={1}>{lang.roleUser}</option>
                          <option value={2}>{lang.roleExpert}</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{lang.expertise}</Form.Label>
                      <Col sm="10">
                        <Form.Select
                          name="expertiseID"
                          value={formData.expertiseID}
                          onChange={handleChange}
                          required
                        >
                          <option value="">{lang.selectExpertise}</option>
                          <option value={1}>Web Development</option>
                          <option value={2}>Data Science</option>
                          <option value={3}>AI & Machine Learning</option>
                          <option value={4}>Cybersecurity</option>
                        </Form.Select>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{lang.affiliation}</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="text"
                          name="affiliation"
                          value={formData.affiliation}
                          placeholder={lang.affiliationPlaceholder}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{lang.bio}</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="textarea"
                          name="bio"
                          value={formData.bio}
                          style={{ height: '100px', resize: 'none' }}
                          placeholder={lang.bioPlaceholder}
                          onChange={handleChange}
                          required
                        />
                      </Col>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={handlePrevious}>
                    {lang.previous}
                  </Button>
                  <Button variant="success" type="submit">
                    {lang.submit}
                  </Button>
                </div>
              </Form>
            </Tab>
          </Tabs>
        </div>
      </Container>
    </div>
  );
};

export default Register;
