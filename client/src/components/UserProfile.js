import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserHeader } from './Dashboard';
import { FaUserCircle } from 'react-icons/fa';
import './LandingPage.css';
import './UserProfile.css';
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

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await fetch(`http://localhost:3001/users/${userId}`);
                if (!response.ok) throw new Error('Failed to fetch profile');
                const data = await response.json();
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [userId]);

    const handleSendMessage = async () => {
        try {
            setSendingMessage(true);
            const response = await fetch('http://localhost:3001/inbox/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    initiatorID: parseInt(currentUserId),
                    receiverID: parseInt(userId)
                })
            });
            if (!response.ok) throw new Error('Failed to create conversation');
            navigate('/inbox');
        } catch (err) {
            console.error('Error creating conversation:', err);
            alert('Failed to start conversation. Please try again.');
        } finally {
            setSendingMessage(false);
        }
    };

    const isOwnProfile = parseInt(currentUserId) === parseInt(userId);

    if (loading) return (
        <div className="dash-root">
            <UserHeader />
            <div className="up-status">Loading profile...</div>
        </div>
    );

    if (error) return (
        <div className="dash-root">
            <UserHeader />
            <div className="up-status error">Error loading profile: {error}</div>
        </div>
    );

    if (!profile) return (
        <div className="dash-root">
            <UserHeader />
            <div className="up-status">Profile not found.</div>
        </div>
    );

    return (
        <div className="dash-root">
            <UserHeader />

            <div className="up-body">
                <div className="up-card">

                    {/* Avatar + Name */}
                    <div className="up-hero">
                        <div className="up-avatar">
                            <FaUserCircle size={80} />
                        </div>
                        <h1 className="up-name">{profile.FirstName} {profile.LastName}</h1>
                        {profile.Affiliation && (
                            <p className="up-affiliation">{profile.Affiliation}</p>
                        )}
                        {isOwnProfile && (
                            <span className="up-own-badge">Your profile</span>
                        )}
                    </div>

                    {/* Bio */}
                    {profile.Bio && (
                        <div className="up-section">
                            <span className="up-section-label">About</span>
                            <p className="up-bio">{profile.Bio}</p>
                        </div>
                    )}

                    {/* Action */}
                    {!isOwnProfile && (
                        <div className="up-actions">
                            <button
                                className="up-message-btn"
                                onClick={handleSendMessage}
                                disabled={sendingMessage}
                            >
                                {sendingMessage ? 'Starting conversation...' : t.sendMessage || 'Send Message'}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;