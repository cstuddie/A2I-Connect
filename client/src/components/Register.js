import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import './Base.css'; // Importing styles

// check for strength of password on registration
/* 
  Saving server.js hashing lines
  const hashedPassword = await bcrypt.hash(password, 10);
  : hashedPassword
*/

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    affiliation: 'Independent Professional'
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

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/register', {
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
        alert(result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to register');
    }
  };

  //handle tabs
  const [activeTab, setActiveTab] = useState('first');

  const handleNext = () => {
    if (activeTab === 'first') {
      setActiveTab('second');
    }
    if (activeTab === 'second') {
      setActiveTab('third')
    }
  };

  const handlePrevious = () => {
    if (activeTab === 'second') {
      setActiveTab('first');
    }
    if (activeTab === 'third') {
      setActiveTab('second')
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
      <h1>AI Connect: Account Registration</h1>
      <p style={{ textAlign: 'center' }}>Join AI Connect to hear from industry professionals.</p>

      <div className="form-container">

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{display: 'none'}}>
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
                      <Form.Label style={{color: 'black'}}>First</Form.Label>
                      <Form.Control
                      type="text"
                      name="firstName"
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
                      placeholder="example@domain.com"
                      required
                      onChange={handleChange}
                      />
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label style={{color: 'black'}}>Password</Form.Label>
                      <Form.Control
                      type="passwrod"
                      name="password"
                      placeholder="Enter a password"
                      required
                      onChange={handleChange}
                      />
                  </Form.Group>

                  <Form.Group className="mb-3">
                      <Form.Label style={{color: 'black'}}>Password</Form.Label>
                      <Form.Control
                      type="passwrod"
                      name="confirmPassword"
                      placeholder="Re-enter your password"
                      required
                      onChange={handleChange}
                      />
                  </Form.Group>
                  </Col>
              </Row>
              <div className="d-flex justify-content-end mt-3">
                  <Button variant="dark" onClick={handleNext}>
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
                      Interests:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="interests"
                        placeholder="Blockchain, Sustainable Architecture, Virtual Reality, etc."
                        onChange={handleChange}
                        required
                      />
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
                        placeholder="Independent Professional, Mississippi Stae, Google, etc."
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      Expertise:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        type="text"
                        name="expertise"
                        placeholder="Fine Arts, Renewable Energy, Artificial Intelligence, etc."
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Form.Group>

                  <Form.Group as={Row} className="mb-3">
                    <Form.Label column sm="2">
                      History:
                    </Form.Label>
                    <Col sm="10">
                      <Form.Control
                        as="textarea"
                        name="history"
                        style={{ height: '100px', resize: 'none' }}
                        placeholder="Process enginner at Exxon, Art director at MoMa"
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

        {/* <form onSubmit={handleSubmit}>
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" placeholder=="James" required onChange={handleChange} />

          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" placeholder=="Smith" required onChange={handleChange} />

          <label htmlFor="email">Email Address</label>
          <input type="email" id="email" name="email" placeholder=="example@domain.com" required onChange={handleChange} />

          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder=="Enter a password" required onChange={handleChange} />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" placeholder=="Re-enter your password" required onChange={handleChange} />
          
          <br />
          <button type="submit" >Register Account</button>

          <NavLink to="/Login" style={{ paddingLeft: "10px"}}>
            Already have an account?
          </NavLink>
        </form> */}
      </div>
      </Container>
    </div>
  );
};

export default Register;