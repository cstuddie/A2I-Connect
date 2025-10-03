import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { NavLink, Link } from "react-router-dom";
import { UserHeader } from './Dashboard';
import "./Base.css"; 

const EventDescription = () => {
    // Changes the current user (keeping main's comment but using auth logic)
    const userID = localStorage.getItem('userID') || null;
    const navigate = useNavigate();

    // State for profile info
    const [profileInfo, setProfileInfo] = useState({
        name: 'empty',
        interests: 'empty',
        history: 'empty',
        expertise: 'empty',
        affiliation: 'empty',
    });

    // Fetches info for the profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/${userID}`);
                const data = await response.json();
                setProfileInfo(data[0]);
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        if (userID) {
            fetchProfile();
        }
        else {
          navigate('/login');
        }
    }, [userID]);

    // get eventID from url
    const { eventID } = useParams();
    

    const [event, setEvent] = useState({
        topic: 'empty',
        description: 'empty',
        date: 'empty',
        field: 'empty',
        course: 'empty',
        deliveryMethod: 'empty',
        status: 'empty',
        requesterID: 'empty',
        instructorID: 'empty',
    });

    const [instructor, setInstructor] = useState({
        name: 'empty',
    });

    const [requester, setRequester] = useState({
        name: 'empty',
    });

    // fetch event
    useEffect(() => {
        
        const fetchEvent = async () => {
            try {
                const response = await fetch(`http://localhost:5000/event/${eventID}`);
                const data = await response.json();
                setEvent(data[0]);
            } catch (error) {
                console.error('Error fetching event:', error);
            }
        };

        fetchEvent();
    }, [eventID]);



    // fetch instructor
    useEffect(() => {
        const fetchInstructor = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/${event.instructorID}`);
                const data = await response.json();
                setInstructor(data[0]);
            } catch (error) {
                console.error('Error fetching instructor:', error);
            }
        };
        fetchInstructor();
    }, [event]);

    // fetch requester
    useEffect(() => {
        const fetchRequester = async () => {
            try {
                const response = await fetch(`http://localhost:5000/profile/${event.requesterID}`);
                const data = await response.json();
                setRequester(data[0]);
            } catch (error) {
                console.error('Error fetching requester:', error);
            }
        };
        fetchRequester();
    }, [event]);


    return (
        <div>
        <UserHeader name={profileInfo.name} />
  
        <Container className="my-4">
          <h1 className="text-center mb-4">Event Description</h1>
  
          <Card>
            <Card.Body>
              <Card.Title className="mb-3"><strong>{event?.topic || 'N/A'}</strong></Card.Title>
  
              <Row>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Instructor:</strong> {instructor?.name || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Requester:</strong> {requester?.name || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Date:</strong> {new Date(event?.date).toLocaleString() || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Delivery Method:</strong> {event?.deliveryMethod || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Field:</strong> {event?.field || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Course:</strong> {event?.course || 'N/A'}</p>
                </Col>
                <Col md={6} className="mb-3">
                  <p className="mb-1"><strong>Status:</strong> {event?.status || 'N/A'}</p>
                </Col>
                <Col md={12} className="mb-3">
                  <p className="mb-1"><strong>Description:</strong><br /> {event?.description || 'N/A'}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Container>
      </div>
    );
};

export default EventDescription;