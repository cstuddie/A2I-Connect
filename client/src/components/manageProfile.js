import './Base.css';
import { NavLink, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { UserHeader } from './Dashboard';
import { Form, Button, Container, Row, Col, Tab, Tabs, Nav } from 'react-bootstrap';
import axios from 'axios';

const EditProfile = () => {

  // Changes the current user (keeping main's comment but using auth logic)
  const userID = localStorage.getItem('userID') || 2;

  const [profileInfo, setProfileInfo] = useState({
    FirstName: '',
    LastName: '',
    Email: '',
    Bio: '',
    Affiliation: '',
    ExpertiseID: '',
    Role: 1
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await response.json();
        setProfileInfo({
          FirstName: data.FirstName || '',
          LastName: data.LastName || '',
          Email: data.Email || '',
          Bio: data.Bio || '',
          Affiliation: data.Affiliation || '',
          ExpertiseID: data.ExpertiseID || '',
          Role: data.Role || 1,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [userID]);

  const handleProfileChange = async (e) => {
    setProfileInfo({ ...profileInfo, [e.target.name]: e.target.value });
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`http://localhost:3001/users/${userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: profileInfo.FirstName,
          LastName: profileInfo.LastName,
          Bio: profileInfo.Bio,
          Affiliation: profileInfo.Affiliation,
          ExpertiseID: profileInfo.ExpertiseID,
          Role: profileInfo.Role,
        }),
      });

      if (response.ok) {
        alert('Profile updated successfully!');
      } else {
        alert('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  return (
    <div>
      <UserHeader name={`${profileInfo.FirstName} ${profileInfo.LastName}`} />

      <Container>
        <Tab.Container id="left-tabs" defaultActiveKey="first">
          <Row>
            <Col sm={3}>
              <h1>Settings</h1>
              <Nav variant="pills" className="flex-column custom-pills">
                <Nav.Item>
                  <Nav.Link eventKey="first">Profile</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <h1 className="text-center mt-4">Edit Profile Information</h1>
                  <p className="text-center mb-4 text-muted">View and make changes to your profile.</p>
                  <div className='form-container'>
                    <Form onSubmit={handleSubmitProfile} className="mt-3">
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          First Name:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            name="FirstName"
                            value={profileInfo.FirstName || ''}
                            onChange={handleProfileChange}
                            required
                          />
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          Last Name:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            name="LastName"
                            value={profileInfo.LastName || ''}
                            onChange={handleProfileChange}
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
                            name="Affiliation"
                            value={profileInfo.Affiliation || ''}
                            onChange={handleProfileChange}
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
                            name="Bio"
                            style={{ height: '100px', resize: 'none' }}
                            value={profileInfo.Bio || ''}
                            onChange={handleProfileChange}
                            placeholder="Tell us about yourself..."
                          />
                        </Col>
                      </Form.Group>

                      <div className="text-center">
                        <Button variant="dark" type="submit">
                          Update Profile Information
                        </Button>
                      </div>
                    </Form>
                  </ div>
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </Container>
    </div>

  );
};

export default EditProfile;
