import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Tabs, Tab } from 'react-bootstrap';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { UserHeader } from './Dashboard';
import './Base.css';
import useTranslation from '../utils/useTranslation';

const RequestSpeaker = () => {
    // Changes the current user (keeping main's comment but using auth logic)
    const userID = localStorage.getItem('userID') || 2;
    const t = useTranslation();

    // State for profile info
    const [profileInfo, setProfileInfo] = useState({
        FirstName: '',
        LastName: ''
    });

    // const [availableCourses, setAvailableCourses] = useState([]);

    // Fetches info for the profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${userID}`);
                const data = await response.json();
                setProfileInfo({
                    FirstName: data.FirstName || '',
                    LastName: data.LastName || ''
                });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userID]);


    // State for form inputs
    const [formData, setFormData] = useState({
        RequesterID: userID,
        Topic: '',
        Description: '',
        Date: '',
        EventStatus: 1, // 1 = Pending
        ExpertiseID: '',
        DeliveryMethod: '',
    });

    const navigate = useNavigate();

    // const fetchCourses = async (field) => {
    //     try {
    //         const response = await fetch(`http://localhost:5000/event-call-courses/${encodeURIComponent(field)}`);
    //         if (!response.ok) throw new Error('Failed to fetch courses');
    //         const data = await response.json();
    //         setAvailableCourses(data);
    //     } catch (error) {
    //         console.error('Error:', error);
    //         setAvailableCourses([]);
    //     }
    // };

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:3001/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();
            if (response.ok) {
                alert(t.successRequest);
                navigate('/dashboard');
            } else {
                alert(result.error || 'Failed to submit request');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred while submitting your request.');
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
            <UserHeader name={`${profileInfo.FirstName} ${profileInfo.LastName}`} />
            <Container>
                <div className="mt-4">
                    <h1 className="text-center">{t.requestTitle}</h1>
                    <p className="text-center text-muted">{t.requestSubtitle}</p>

                    <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} style={{ display: 'none' }}>
                        <Tab eventKey="first" title="Part 1">
                            <Form className="mt-4">
                                <Row>
                                    <Col md={6}>
                                        <p className='text-muted'>{t.step1of3}</p>
                                        <p><strong>{t.step1desc}</strong></p>
                                        <p>{t.step1subdesc}</p>
                                    </Col>
                                    <Col md={6}>

                                        {/* <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>Affiliation</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="affiliation"
                                                placeholder="Event's Affiliation"
                                                required
                                                onChange={handleChange}
                                            />
                                        </Form.Group> */}

                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>{t.topic}</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name="Topic"
                                                placeholder={t.topicPlaceholder}
                                                required
                                                onChange={handleChange}
                                            />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>{t.description}</Form.Label>
                                            <Form.Control
                                                as="textarea"
                                                name="Description"
                                                placeholder={t.descriptionPlaceholder}
                                                required
                                                onChange={handleChange}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-end mt-3">
                                    <Button variant="dark" onClick={handleNext}>
                                        {t.next}
                                    </Button>
                                </div>
                            </Form>
                        </Tab>

                        <Tab eventKey="second" title="Part 2">
                            <Form className="mt-4">
                                <Row>
                                    <Col md={6}>
                                        <p className='text-muted'>{t.step2of3}</p>
                                        <p><strong>{t.step2desc}</strong></p>
                                        <p>{t.step2subdesc}</p>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>{t.areaOfExpertise}</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name="ExpertiseID"
                                                required
                                                onChange={handleChange}
                                                value={formData.ExpertiseID}
                                            >
                                                <option value="">{t.selectExpertise}</option>
                                                <option value={1}>Web Development</option>
                                                <option value={2}>Data Science</option>
                                                <option value={3}>AI & Machine Learning</option>
                                                <option value={4}>Cybersecurity</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button variant="secondary" onClick={handlePrevious}>
                                        {t.previous}
                                    </Button>
                                    <Button variant="dark" onClick={handleNext}>
                                        {t.next}
                                    </Button>
                                </div>
                            </Form>
                        </Tab>

                        <Tab eventKey="third" title="Part 3">
                            <Form onSubmit={handleSubmit} className="mt-4">
                                <Row>
                                    <Col md={6}>
                                        <p className='text-muted'>{t.step3of3}</p>
                                        <p><strong>{t.step3desc}</strong></p>
                                        <p>{t.step3subdesc}</p>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>{t.preferredDate}</Form.Label>
                                            <Form.Control type="date" name="Date" required onChange={handleChange} />
                                        </Form.Group>

                                        <Form.Group className="mb-3">
                                            <Form.Label style={{ color: 'black' }}>{t.deliveryMethod}</Form.Label>
                                            <Form.Control as="select" name="DeliveryMethod" required onChange={handleChange}>
                                                <option value="">-</option>
                                                <option value="Online">{t.online}</option>
                                                <option value="Hybrid">{t.hybrid}</option>
                                            </Form.Control>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-between mt-3">
                                    <Button variant="secondary" onClick={handlePrevious}>
                                        {t.previous}
                                    </Button>
                                    <Button variant="success" type="submit">
                                        {t.submit}
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

export default RequestSpeaker;