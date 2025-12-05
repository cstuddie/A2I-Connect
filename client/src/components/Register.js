import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import './Base.css'; // Importing styles

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 1, // Default to regular user (1 = user, 2 = instructor/expert)
    expertiseID: '', // will be a dropdown selection
    bio: '',
    affiliation: 'Independent Professional',
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the second tab fields
    if(!formData.affiliation.trim() || !formData.expertiseID.trim()) {
      setError('Please fill out all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to register. Please try again.');
    }
  };

  //handle tabs
  const [activeTab, setActiveTab] = useState('first');

  const handleNext = () => {
    if (activeTab === 'first') {

      // Whitespace validation
      if( !formData.firstName.trim() || !formData.lastName.trim() || 
          !formData.email.trim() || !formData.password.trim() || 
          !formData.confirmPassword.trim()) {
            setError('Please fill out all fields. Spaces-only entries are not allowed.');
            return;
          }

      // Password match validation 
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      setError('');
      setActiveTab('second');
    }
    else if (activeTab === 'second') {

      if(!formData.affiliation.trim() || !formData.expertiseID) {
        setError('Please fill out all required fields (Role, Expertise, and Affiliation)')
        return;
      }

      setError('')
      setActiveTab('third');
    }
  };

  const handlePrevious = () => {
    setError('');
    if (activeTab === 'second') {
      setActiveTab('first');
    }
    else if (activeTab === 'third') {
      setActiveTab('second');
    }
  };

  return (
    <div>
        <Navbar bg="white" variant="light" expand="lg" sticky="top" className='border-bottom'>
          <Navbar.Brand as={Link} to="/">
            <h1>A2I Connect</h1>
          </Navbar.Brand>
          <Nav className="ms-auto">
            <NavLink to="/Login" className="nav-link me-3">
              Already have an account?
            </NavLink>
          </Nav>
        </Navbar>

      <Container>
      <h1 style={{textAlign: 'center'}}>AI Connect: Account Registration</h1>
      <p style={{ textAlign: 'center' }}>Join AI Connect to hear from industry professionals.</p>
     
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

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{display: 'none'}}>
          <Tab eventKey="first" title="Part 1">
              <Form onSubmit={(e) => { e.preventDefault(); handleNext(); }} className="mt-4">
              <Row>
                  <Col md={4}>
                  <p className='text-muted'>1/2 Register</p>
                  <p><strong>Enter your basic information:</strong></p>
                  <p>Please provide your name, email, and password.</p>
                  </Col>
                  <Col md={8}>

                  <Form.Group className="mb-3">
                      <Form.Label style={{color: 'black'}}>First Name</Form.Label>
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
                      <Form.Label style={{color: 'black'}}>Last Name</Form.Label>
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
                      <Form.Label style={{color: 'black'}}>Email</Form.Label>
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
                      <Form.Label style={{color: 'black'}}>Password</Form.Label>
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
                      <Form.Label style={{color: 'black'}}>Confirm Password</Form.Label>
                      <Form.Control
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      placeholder="Confirm your password"
                      required
                      onChange={handleChange}
                      />
                  </Form.Group>
                  </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3">
                  <Button variant="dark" type="submit">
                  Next
                  </Button>
              </div>
              </Form>
          </Tab>

          <Tab eventKey="second" title="Part 2">
          <Form onSubmit={handleSubmit} className="mt-3">
            <Row>
                  <Col md={4}>
                  <p className='text-muted'>2/2 Register</p>
                  <p><strong>Enter your account information:</strong></p>
                  <p>Please provide your interests, your professional affiliation, expertise, and some history about yourself.</p>
                  </Col>
                  <Col md={8}>

  <Form.Group as={Row} className="mb-3">
    <Form.Label column sm="2">
      Role:
    </Form.Label>
    <Col sm="10">
      <Form.Select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value={1}>User (seeking expertise)</option>
        <option value={2}>Expert (offering expertise)</option>
      </Form.Select>
    </Col>
  </Form.Group>

  <Form.Group as={Row} className="mb-3">
    <Form.Label column sm="2">
      Expertise:
    </Form.Label>
    <Col sm="10">
      <Form.Select
        name="expertiseID"
        value={formData.expertiseID}
        onChange={handleChange}
        required
      >
        <option value="">Select your expertise...</option>
        <option value={1}>Web Development</option>
        <option value={2}>Data Science</option>
        <option value={3}>AI & Machine Learning</option>
        <option value={4}>Cybersecurity</option>
      </Form.Select>
    </Col>
  </Form.Group>

  <Form.Group as={Row} className="mb-3">
    <Form.Label column sm="2">
      Affiliation:
    </Form.Label>
    <Col sm="10">
      <Form.Control
        type="text"
        name="affiliation"
        value={formData.affiliation}
        placeholder="Independent Professional, Mississippi State, Google, etc."
        onChange={handleChange}
        required
      />
    </Col>
  </Form.Group>

  <Form.Group as={Row} className="mb-3">
    <Form.Label column sm="2">
      Bio:
    </Form.Label>
    <Col sm="10">
      <Form.Control
        as="textarea"
        name="bio"
        value={formData.bio}
        style={{ height: '100px', resize: 'none' }}
        placeholder="Tell us about yourself and your professional background..."
        onChange={handleChange}
      />
    </Col>
  </Form.Group>
</Col>
                  </Row>

                  <div className="d-flex justify-content-between mt-3">
                    <Button variant="secondary" onClick={handlePrevious}>
                    Previous
                    </Button>
                    <Button variant="success" type="submit">
                    Submit Request
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
