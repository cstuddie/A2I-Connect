import './Base.css';
import { NavLink, Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { UserHeader } from './Dashboard';
import { Form, Button, Container, Row, Col, Tab, Tabs, Nav, Table } from 'react-bootstrap';
import axios from 'axios';
import useTranslation from '../utils/useTranslation';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const EditProfile = () => {
  const t = useTranslation();
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

  const [errors, setErrors] = useState({});

  // Availability state
  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({ DayOfWeek: 'Monday', StartTime: '09:00', EndTime: '17:00' });
  const [availabilityError, setAvailabilityError] = useState('');

  // Account state
  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');

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

  // Fetch existing availability
  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/availability/${userID}`);
        const data = await response.json();
        setAvailability(data || []);
      } catch (error) {
        console.error('Error fetching availability:', error);
      }
    };
    fetchAvailability();
  }, [userID]);

  const handleProfileChange = async (e) => {
    const { name, value } = e.target;

    setProfileInfo(prev => ({
      ...prev,
      [name]: value,
    }));

    setErrors(prev => ({
      ...prev,
      [name]: '',
    }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();


    const newErrors = {};

    if (!profileInfo.FirstName.trim()) {
      newErrors.FirstName = 'First name is required';
    }
    if (!profileInfo.LastName.trim()) {
      newErrors.LastName = 'Last name is required';
    }
    if (!profileInfo.Affiliation.trim()) {
      newErrors.Affiliation = 'Affiliation is required';
    }
    if (!profileInfo.Bio.trim()) {
      newErrors.Bio = 'Bio is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

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

  const handleAddSlot = () => {
    setAvailabilityError('');

    if (newSlot.StartTime >= newSlot.EndTime) {
      setAvailabilityError('Start time must be before end time.');
      return;
    }

    setAvailability(prev => [...prev, { ...newSlot }]);
    setNewSlot({ DayOfWeek: 'Monday', StartTime: '09:00', EndTime: '17:00' });
  };

  const handleRemoveSlot = (index) => {
    setAvailability(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveAvailability = async () => {
    setAvailabilityError('');
    try {
      const response = await fetch(`http://localhost:3001/users/availability/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: availability }),
      });

      if (response.ok) {
        alert('Availability updated successfully!');
      } else {
        const data = await response.json();
        setAvailabilityError(data.error || 'Failed to update availability');
      }
    } catch (error) {
      console.error('Error updating availability:', error);
      setAvailabilityError('Error updating availability');
    }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');

    if (!emailForm.newEmail.trim() || !emailForm.password.trim()) {
      setAccountError('All fields are required.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail.trim())) {
      setAccountError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/email/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newEmail: emailForm.newEmail.trim(), password: emailForm.password }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccountSuccess('Email updated successfully!');
        setEmailForm({ newEmail: '', password: '' });
        setProfileInfo(prev => ({ ...prev, Email: emailForm.newEmail.trim() }));
      } else {
        setAccountError(data.error || 'Failed to update email.');
      }
    } catch (error) {
      console.error('Error updating email:', error);
      setAccountError('Error updating email.');
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setAccountError('');
    setAccountSuccess('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setAccountError('All fields are required.');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setAccountError('New password must be at least 6 characters.');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setAccountError('New passwords do not match.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/users/password/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        setAccountSuccess('Password updated successfully!');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        setAccountError(data.error || 'Failed to update password.');
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setAccountError('Error updating password.');
    }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
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
                  <Nav.Link eventKey="first">{t.profileTab}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="second">{t.availabilityTab}</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="third">{t.accountTab}</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col sm={9}>
              <Tab.Content>
                <Tab.Pane eventKey="first">
                  <h1 className="text-center mt-4">{t.manageProfileTitle}</h1>
                  <p className="text-center mb-4 text-muted">{t.manageProfileSubtitle}</p>
                  <div className='form-container'>
                    <Form onSubmit={handleSubmitProfile} className="mt-3">
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          {t.firstName}:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            name="FirstName"
                            value={profileInfo.FirstName || ''}
                            onChange={handleProfileChange}
                            isInvalid={!!errors.FirstName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.FirstName}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          {t.lastName}:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            name="LastName"
                            value={profileInfo.LastName || ''}
                            onChange={handleProfileChange}
                            isInvalid={!!errors.LastName}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.LastName}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          {t.affiliation}:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            type="text"
                            name="Affiliation"
                            value={profileInfo.Affiliation || ''}
                            onChange={handleProfileChange}
                            isInvalid={!!errors.Affiliation}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.Affiliation}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="2">
                          {t.bio}:
                        </Form.Label>
                        <Col sm="10">
                          <Form.Control
                            as="textarea"
                            name="Bio"
                            style={{ height: '100px', resize: 'none' }}
                            value={profileInfo.Bio || ''}
                            onChange={handleProfileChange}
                            placeholder="Tell us about yourself..."
                            isInvalid={!!errors.Bio}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.Bio}
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>

                      <div className="text-center">
                        <Button variant="dark" type="submit">
                          {t.saveChanges}
                        </Button>
                      </div>
                    </Form>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="second">
                  <h1 className="text-center mt-4">{t.manageAvailabilityTitle}</h1>
                  <p className="text-center mb-4 text-muted">{t.availabilitySubtitle}</p>

                  {availabilityError && (
                    <div className="alert alert-danger">{availabilityError}</div>
                  )}

                  {/* Add new slot */}
                  <div className="form-container">
                    <h5>{t.addTimeSlot}</h5>
                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{t.day}</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          as="select"
                          value={newSlot.DayOfWeek}
                          onChange={(e) => setNewSlot({ ...newSlot, DayOfWeek: e.target.value })}
                        >
                          {DAYS_OF_WEEK.map(day => (
                            <option key={day} value={day}>{day}</option>
                          ))}
                        </Form.Control>
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{t.startTime}</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="time"
                          value={newSlot.StartTime}
                          onChange={(e) => setNewSlot({ ...newSlot, StartTime: e.target.value })}
                        />
                      </Col>
                    </Form.Group>

                    <Form.Group as={Row} className="mb-3">
                      <Form.Label column sm="2">{t.endTime}</Form.Label>
                      <Col sm="10">
                        <Form.Control
                          type="time"
                          value={newSlot.EndTime}
                          onChange={(e) => setNewSlot({ ...newSlot, EndTime: e.target.value })}
                        />
                      </Col>
                    </Form.Group>

                    <div className="text-center mb-4">
                      <Button variant="outline-dark" onClick={handleAddSlot}>
                        {t.addSlot}
                      </Button>
                    </div>
                  </div>

                  {/* Current slots */}
                  {availability.length > 0 ? (
                    <Table striped bordered hover className="mt-3" style={{ verticalAlign: 'middle' }}>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {availability.map((slot, index) => (
                          <tr key={index} style={{ verticalAlign: 'middle' }}>
                            <td>{slot.DayOfWeek}</td>
                            <td>{formatTime(slot.StartTime)}</td>
                            <td>{formatTime(slot.EndTime)}</td>
                            <td>
                              <Button
                                variant="outline-danger"
                                style={{ width: 'auto' }}
                                onClick={() => handleRemoveSlot(index)}
                              >
                                Remove
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <p className="text-muted text-center mt-3">{t.noSlots}</p>
                  )}

                  <div className="text-center mt-3 mb-4">
                    <Button variant="dark" onClick={handleSaveAvailability}>
                      {t.saveAvailability}
                    </Button>
                  </div>
                </Tab.Pane>

                <Tab.Pane eventKey="third">
                  <h1 className="text-center mt-4">{t.accountSettingsTitle}</h1>
                  <p className="text-center mb-4 text-muted">{t.accountSubtitle}</p>

                  {accountError && (
                    <div className="alert alert-danger">{accountError}</div>
                  )}
                  {accountSuccess && (
                    <div className="alert alert-success">{accountSuccess}</div>
                  )}

                  <div className="form-container mb-4">
                    <h5>{t.changeEmail}</h5>
                    <p className="text-muted">{t.currentEmail} {profileInfo.Email}</p>
                    <Form onSubmit={handleUpdateEmail}>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">{t.newEmail}</Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="email"
                            value={emailForm.newEmail}
                            onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })}
                            placeholder="Enter new email"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">{t.confirmPasswordLbl}</Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="password"
                            value={emailForm.password}
                            onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })}
                            placeholder="Confirm your current password"
                          />
                        </Col>
                      </Form.Group>
                      <div className="text-center">
                        <Button variant="dark" type="submit">
                          {t.updateEmail}
                        </Button>
                      </div>
                    </Form>
                  </div>

                  <div className="form-container mb-4">
                    <h5>{t.changePassword}</h5>
                    <Form onSubmit={handleUpdatePassword}>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">{t.currentPassword}</Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">{t.newPassword}</Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                            placeholder="Enter new password (min 6 characters)"
                          />
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row} className="mb-3">
                        <Form.Label column sm="3">{t.confirmNewPassword}</Form.Label>
                        <Col sm="9">
                          <Form.Control
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                            placeholder="Confirm new password"
                          />
                        </Col>
                      </Form.Group>
                      <div className="text-center">
                        <Button variant="dark" type="submit">
                          {t.updatePassword}
                        </Button>
                      </div>
                    </Form>
                  </div>
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
