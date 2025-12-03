import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Navbar, Nav } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import './Base.css'; // Importing styles

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: 'Independent Professional',
    expertiseID: '',
    bio: '',
    interests: ''
  });

  const [expertiseList, setExpertiseList] = useState([]);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('first');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpertise = async () => {
      try {
        const res = await fetch('http://localhost:5000/users/expertise');
        const data = await res.json();
        setExpertiseList(data); // Expecting [{ID, Title, Field}]
      } catch (err) {
        console.error('Error fetching expertise:', err);
      }
    };
    fetchExpertise();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleNext = () => {
    if (activeTab === 'first') setActiveTab('second');
  };

  const handlePrevious = () => {
    if (activeTab === 'second') setActiveTab('first');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Prepare payload for new DB structure
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        affiliation: formData.affiliation,
        expertiseID: formData.expertiseID || null,
        bio: formData.bio
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        navigate('/login');
      } else {
        alert(result.error);
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to register');
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
        <h1 className="page-title">A2I Connect: Account Registration</h1>
        <p style={{ textAlign: 'center' }}>Join A2I Connect to hear from industry professionals.</p>

        <div className="form-container">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{ display: 'none' }}>
            {/* Part 1: Basic Info */}
            <Tab eventKey="first" title="Part 1">
              <Form className="mt-4">
                <Row>
                  <Col md={4}>
                    <p className='text-muted'>1/2 Register</p>
                    <p><strong>Enter your basic information:</strong></p>
                    <p>Please provide your name, email, and password.</p>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">First Name</Form.Label>
                      <Form.Control type="text" name="firstName" placeholder="John" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Last Name</Form.Label>
                      <Form.Control type="text" name="lastName" placeholder="Doe" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Email</Form.Label>
                      <Form.Control type="email" name="email" placeholder="example@domain.com" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Password</Form.Label>
                      <Form.Control type="password" name="password" placeholder="Enter a password" required onChange={handleChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Confirm Password</Form.Label>
                      <Form.Control type="password" name="confirmPassword" placeholder="Re-enter your password" required onChange={handleChange} />
                    </Form.Group>
                  </Col>
                </Row>
                <div className="d-flex justify-content-end mt-3">
                  <Button variant="dark" onClick={handleNext}>Next</Button>
                </div>
              </Form>
            </Tab>

            {/* Part 2: Account Info */}
            <Tab eventKey="second" title="Part 2">
              <Form onSubmit={handleSubmit} className="mt-3">
                <Row>
                  <Col md={4}>
                    <p className='text-muted'>2/2 Register</p>
                    <p><strong>Enter your account information:</strong></p>
                    <p>Provide affiliation, expertise, and some history about yourself.</p>
                  </Col>
                  <Col md={8}>
                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Affiliation</Form.Label>
                      <Form.Control type="text" name="affiliation" placeholder="Independent Professional, University, Company" required onChange={handleChange} />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Expertise</Form.Label>
                      <Form.Control as="select" name="expertiseID" required onChange={handleChange}>
                        <option value="">Select your expertise</option>
                        {expertiseList.map(exp => (
                          <option key={exp.ID} value={exp.ID}>{exp.Title}</option>
                        ))}
                      </Form.Control>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="form-label">Bio / History</Form.Label>
                      <Form.Control as="textarea" name="bio" style={{ height: '100px', resize: 'none' }} placeholder="Your experience, background, etc." onChange={handleChange} />
                    </Form.Group>

                  </Col>
                </Row>

                <div className="d-flex justify-content-between mt-3">
                  <Button variant="secondary" onClick={handlePrevious}>Previous</Button>
                  <Button variant="success" type="submit">Submit Request</Button>
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
