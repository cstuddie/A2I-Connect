import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from "react-router-dom";
import { UserHeader } from './Dashboard';
import './LandingPage.css';
import './Register.css';
import './RequestSpeaker.css';
import useTranslation from '../utils/useTranslation';

const RequestSpeaker = () => {
    const userID = localStorage.getItem('userID') || 2;
    const t = useTranslation();

    const [profileInfo, setProfileInfo] = useState({ FirstName: '', LastName: '' });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch(`http://localhost:3001/users/${userID}`);
                const data = await response.json();
                setProfileInfo({ FirstName: data.FirstName || '', LastName: data.LastName || '' });
            } catch (error) {
                console.error('Error fetching profile:', error);
            }
        };
        fetchProfile();
    }, [userID]);

    const [formData, setFormData] = useState({
        RequesterID: userID,
        Topic: '',
        Description: '',
        Date: '',
        EventStatus: 1,
        ExpertiseID: '',
        DeliveryMethod: '',
    });

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
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

    const [activeTab, setActiveTab] = useState('first');

    const handleNext = () => {
        if (activeTab === 'first') setActiveTab('second');
        if (activeTab === 'second') setActiveTab('third');
    };

    const handlePrevious = () => {
        if (activeTab === 'second') setActiveTab('first');
        if (activeTab === 'third') setActiveTab('second');
    };

    const steps = ['first', 'second', 'third'];
    const currentStep = steps.indexOf(activeTab) + 1;

    return (
        <div className="auth-root">
            <UserHeader name={`${profileInfo.FirstName} ${profileInfo.LastName}`} />

            <div className="auth-wrapper reg-wrapper">
                <div className="auth-card reg-card rs-card">

                    {/* Header */}
                    <div className="auth-header">
                        <h1 className="auth-title">{t.requestTitle}</h1>
                        <p className="auth-sub">{t.requestSubtitle}</p>
                    </div>

                    {/* Step Indicator */}
                    <div className="reg-steps">
                        <div className={`reg-step ${activeTab === 'first' ? 'active' : currentStep > 1 ? 'done' : ''}`}>
                            <div className="reg-step-dot">{currentStep > 1 ? '✓' : '1'}</div>
                            <span>{t.step1desc || 'Details'}</span>
                        </div>
                        <div className="reg-step-line" />
                        <div className={`reg-step ${activeTab === 'second' ? 'active' : currentStep > 2 ? 'done' : ''}`}>
                            <div className="reg-step-dot">{currentStep > 2 ? '✓' : '2'}</div>
                            <span>{t.step2desc || 'Expertise'}</span>
                        </div>
                        <div className="reg-step-line" />
                        <div className={`reg-step ${activeTab === 'third' ? 'active' : ''}`}>
                            <div className="reg-step-dot">3</div>
                            <span>{t.step3desc || 'Schedule'}</span>
                        </div>
                    </div>

                    {/* Step 1 */}
                    {activeTab === 'first' && (
                        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <p className="rs-step-hint">{t.step1of3} — {t.step1subdesc}</p>

                            <div className="auth-field">
                                <label className="auth-label">{t.topic}</label>
                                <input
                                    type="text"
                                    name="Topic"
                                    className="auth-input"
                                    placeholder={t.topicPlaceholder}
                                    value={formData.Topic}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">{t.description}</label>
                                <textarea
                                    name="Description"
                                    className="auth-input auth-textarea"
                                    placeholder={t.descriptionPlaceholder}
                                    value={formData.Description}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="reg-btn-row">
                                <div />
                                <button type="submit" className="auth-submit-btn reg-submit">{t.next}</button>
                            </div>
                        </form>
                    )}

                    {/* Step 2 */}
                    {activeTab === 'second' && (
                        <form className="auth-form" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
                            <p className="rs-step-hint">{t.step2of3} — {t.step2subdesc}</p>

                            <div className="auth-field">
                                <label className="auth-label">{t.areaOfExpertise}</label>
                                <select
                                    name="ExpertiseID"
                                    className="auth-input auth-select"
                                    value={formData.ExpertiseID}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">{t.selectExpertise}</option>
                                    <option value={1}>Web Development</option>
                                    <option value={2}>Data Science</option>
                                    <option value={3}>AI & Machine Learning</option>
                                    <option value={4}>Cybersecurity</option>
                                </select>
                            </div>

                            <div className="reg-btn-row">
                                <button type="button" className="auth-back-btn" onClick={handlePrevious}>← {t.previous}</button>
                                <button type="submit" className="auth-submit-btn reg-submit">{t.next}</button>
                            </div>
                        </form>
                    )}

                    {/* Step 3 */}
                    {activeTab === 'third' && (
                        <form className="auth-form" onSubmit={handleSubmit}>
                            <p className="rs-step-hint">{t.step3of3} — {t.step3subdesc}</p>

                            <div className="auth-field">
                                <label className="auth-label">{t.preferredDate}</label>
                                <input
                                    type="date"
                                    name="Date"
                                    className="auth-input"
                                    value={formData.Date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="auth-field">
                                <label className="auth-label">{t.deliveryMethod}</label>
                                <select
                                    name="DeliveryMethod"
                                    className="auth-input auth-select"
                                    value={formData.DeliveryMethod}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">-</option>
                                    <option value="Online">{t.online}</option>
                                    <option value="Hybrid">{t.hybrid}</option>
                                </select>
                            </div>

                            <div className="reg-btn-row">
                                <button type="button" className="auth-back-btn" onClick={handlePrevious}>← {t.previous}</button>
                                <button type="submit" className="auth-submit-btn reg-submit">{t.submit}</button>
                            </div>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default RequestSpeaker;