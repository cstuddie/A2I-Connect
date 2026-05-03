import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Spinner } from 'react-bootstrap';
import { UserHeader } from './Dashboard';
import './Base.css';
import useTranslation from '../utils/useTranslation';

const UserProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const currentUserId = localStorage.getItem('userID');
    const t = useTranslation();
    
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [sendingMessage, setSendingMessage] = useState(false);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/users/${userId}`);
                
                if (!response.ok) {
                    throw new Error('Failed to fetch profile');
                }
                
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
                console.error('Error fetching profile:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userId]);

    // Handle send message - create conversation and navigate to inbox
    const handleSendMessage = async () => {
        try {
            setSendingMessage(true);
            
            // Create or get conversation
            const response = await fetch('http://localhost:3001/inbox/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    initiatorID: parseInt(currentUserId),
                    receiverID: parseInt(userId)
                })
            });

            if (!response.ok) {
                throw new Error('Failed to create conversation');
            }

            const conversation = await response.json();
            
            // Navigate to inbox
            navigate('/inbox');
        } catch (err) {
            console.error('Error creating conversation:', err);
            alert('Failed to start conversation. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    if (loading) {
        return (
            <div>
                <UserHeader />
                <Container className="py-5 text-center">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </Spinner>
                </Container>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <UserHeader />
                <Container className="py-5">
                    <div className="alert alert-danger">
                        Error loading profile: {error}
                    </div>
                </Container>
            </div>
        );
    }

    if (!profile) {
        return (
            <div>
                <UserHeader />
                <Container className="py-5">
                    <div className="alert alert-warning">
                        Profile not found
                    </div>
                </Container>
            </div>
        );
    }

    return (
        <div>
            <UserHeader />
            <Container className="py-5">
                <Card className="profile-card shadow-sm">
                    <Card.Body className="p-5">
                        <div className="text-center mb-4">
                            <div className="profile-avatar">
                                {profile.FirstName?.[0]}{profile.LastName?.[0]}
                            </div>
                            <h2 className="mt-3 mb-1">
                                {profile.FirstName} {profile.LastName}
                            </h2>
                            {profile.Affiliation && (
                                <p className="text-muted mb-0">{profile.Affiliation}</p>
                            )}
                        </div>

                        {profile.Bio && (
                            <div className="profile-section">
                                <h5 className="section-title">About</h5>
                                <p className="bio-text">{profile.Bio}</p>
                            </div>
                        )}

                        <div className="text-center mt-4">
                            <Button 
                                variant="primary" 
                                size="lg"
                                onClick={handleSendMessage}
                                disabled={sendingMessage || parseInt(currentUserId) === parseInt(userId)}
                                className="send-message-btn"
                            >
                                {sendingMessage ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                            className="me-2"
                                        />
                                        {t.sendMessage}...
                                    </>
                                ) : (
                                    t.sendMessage
                                )}
                            </Button>
                            {parseInt(currentUserId) === parseInt(userId) && (
                                <p className="text-muted mt-2 mb-0">This is your profile</p>
                            )}
                        </div>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};

export default UserProfile;