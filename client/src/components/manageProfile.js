import React, { useEffect, useState } from 'react';
import { NavLink, Link } from "react-router-dom";
import { UserHeader } from './Dashboard';
import useTranslation from '../utils/useTranslation';
import './LandingPage.css';
import './manageProfile.css';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'de', label: 'Deutsch' },
  { code: 'zh', label: '中文' },
  { code: 'ar', label: 'العربية' },
  { code: 'pt', label: 'Português' },
  { code: 'ru', label: 'Русский' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'hi', label: 'हिंदी' },
];

const EditProfile = () => {
  const t = useTranslation();
  const userID = localStorage.getItem('userID') || 2;
  const [activeTab, setActiveTab] = useState('profile');

  const [profileInfo, setProfileInfo] = useState({
    FirstName: '', LastName: '', Email: '', Bio: '', Affiliation: '', ExpertiseID: '', Role: 1
  });
  const [errors, setErrors] = useState({});

  const [availability, setAvailability] = useState([]);
  const [newSlot, setNewSlot] = useState({ DayOfWeek: 'Monday', StartTime: '09:00', EndTime: '17:00' });
  const [availabilityError, setAvailabilityError] = useState('');

  const [emailForm, setEmailForm] = useState({ newEmail: '', password: '' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [accountError, setAccountError] = useState('');
  const [accountSuccess, setAccountSuccess] = useState('');

  const [selectedLang, setSelectedLang] = useState(localStorage.getItem('preferredLanguage') || 'en');
  const [langSaved, setLangSaved] = useState(false);

  const handleSaveLanguage = () => {
    localStorage.setItem('preferredLanguage', selectedLang);
    setLangSaved(true);
    setTimeout(() => setLangSaved(false), 3000);
    window.location.reload();
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/${userID}`);
        const data = await response.json();
        setProfileInfo({
          FirstName: data.FirstName || '', LastName: data.LastName || '',
          Email: data.Email || '', Bio: data.Bio || '',
          Affiliation: data.Affiliation || '', ExpertiseID: data.ExpertiseID || '', Role: data.Role || 1,
        });
      } catch (error) { console.error('Error fetching profile:', error); }
    };
    fetchProfile();
  }, [userID]);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await fetch(`http://localhost:3001/users/availability/${userID}`);
        const data = await response.json();
        setAvailability(data || []);
      } catch (error) { console.error('Error fetching availability:', error); }
    };
    fetchAvailability();
  }, [userID]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileInfo(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!profileInfo.FirstName.trim()) newErrors.FirstName = 'First name is required';
    if (!profileInfo.LastName.trim()) newErrors.LastName = 'Last name is required';
    if (!profileInfo.Affiliation.trim()) newErrors.Affiliation = 'Affiliation is required';
    if (!profileInfo.Bio.trim()) newErrors.Bio = 'Bio is required';
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setErrors({});
    try {
      const response = await fetch(`http://localhost:3001/users/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          FirstName: profileInfo.FirstName, LastName: profileInfo.LastName,
          Bio: profileInfo.Bio, Affiliation: profileInfo.Affiliation,
          ExpertiseID: profileInfo.ExpertiseID, Role: profileInfo.Role,
        }),
      });
      if (response.ok) alert('Profile updated successfully!');
      else alert('Failed to update profile');
    } catch (error) { alert('Error updating profile'); }
  };

  const handleAddSlot = () => {
    setAvailabilityError('');
    if (newSlot.StartTime >= newSlot.EndTime) { setAvailabilityError('Start time must be before end time.'); return; }
    setAvailability(prev => [...prev, { ...newSlot }]);
    setNewSlot({ DayOfWeek: 'Monday', StartTime: '09:00', EndTime: '17:00' });
  };

  const handleRemoveSlot = (index) => setAvailability(prev => prev.filter((_, i) => i !== index));

  const handleSaveAvailability = async () => {
    setAvailabilityError('');
    try {
      const response = await fetch(`http://localhost:3001/users/availability/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots: availability }),
      });
      if (response.ok) alert('Availability updated successfully!');
      else { const data = await response.json(); setAvailabilityError(data.error || 'Failed to update availability'); }
    } catch (error) { setAvailabilityError('Error updating availability'); }
  };

  const handleUpdateEmail = async (e) => {
    e.preventDefault();
    setAccountError(''); setAccountSuccess('');
    if (!emailForm.newEmail.trim() || !emailForm.password.trim()) { setAccountError('All fields are required.'); return; }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailForm.newEmail.trim())) { setAccountError('Please enter a valid email address.'); return; }
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
      } else { setAccountError(data.error || 'Failed to update email.'); }
    } catch (error) { setAccountError('Error updating email.'); }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setAccountError(''); setAccountSuccess('');
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) { setAccountError('All fields are required.'); return; }
    if (passwordForm.newPassword.length < 6) { setAccountError('New password must be at least 6 characters.'); return; }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setAccountError('New passwords do not match.'); return; }
    try {
      const response = await fetch(`http://localhost:3001/users/password/${userID}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const data = await response.json();
      if (response.ok) { setAccountSuccess('Password updated successfully!'); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); }
      else { setAccountError(data.error || 'Failed to update password.'); }
    } catch (error) { setAccountError('Error updating password.'); }
  };

  const formatTime = (time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 || 12;
    return `${displayH}:${minutes} ${ampm}`;
  };

  const tabs = [
    { key: 'profile', label: t.profileTab || 'Profile' },
    { key: 'availability', label: t.availabilityTab || 'Availability' },
    { key: 'account', label: t.accountTab || 'Account' },
  ];

  return (
    <div className="dash-root">
      <UserHeader />

      {/* Banner */}
      <div className="dash-banner">
        <div className="dash-banner-inner">
          <h1 className="dash-banner-title">Settings</h1>
          <p className="dash-banner-sub">Manage your profile, availability, and account</p>
        </div>
      </div>

      <div className="mp-body">
        {/* Sidebar */}
        <aside className="mp-sidebar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`mp-tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </aside>

        {/* Content */}
        <div className="mp-content">

          {/* ---- Profile Tab ---- */}
          {activeTab === 'profile' && (
            <div className="mp-panel">
              <div className="mp-panel-header">
                <h2 className="mp-panel-title">{t.manageProfileTitle || 'Edit Profile'}</h2>
                <p className="mp-panel-sub">{t.manageProfileSubtitle || 'Update your public profile information'}</p>
              </div>

              <form onSubmit={handleSubmitProfile} className="auth-form">
                <div className="reg-row">
                  <div className="auth-field">
                    <label className="auth-label">{t.firstName}</label>
                    <input type="text" name="FirstName" value={profileInfo.FirstName} onChange={handleProfileChange} className={`auth-input ${errors.FirstName ? 'input-error' : ''}`} />
                    {errors.FirstName && <span className="field-error">{errors.FirstName}</span>}
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.lastName}</label>
                    <input type="text" name="LastName" value={profileInfo.LastName} onChange={handleProfileChange} className={`auth-input ${errors.LastName ? 'input-error' : ''}`} />
                    {errors.LastName && <span className="field-error">{errors.LastName}</span>}
                  </div>
                </div>

                <div className="auth-field">
                  <label className="auth-label">{t.affiliation}</label>
                  <input type="text" name="Affiliation" value={profileInfo.Affiliation} onChange={handleProfileChange} className={`auth-input ${errors.Affiliation ? 'input-error' : ''}`} />
                  {errors.Affiliation && <span className="field-error">{errors.Affiliation}</span>}
                </div>

                <div className="auth-field">
                  <label className="auth-label">{t.bio}</label>
                  <textarea name="Bio" value={profileInfo.Bio} onChange={handleProfileChange} className={`auth-input auth-textarea ${errors.Bio ? 'input-error' : ''}`} placeholder="Tell us about yourself..." />
                  {errors.Bio && <span className="field-error">{errors.Bio}</span>}
                </div>

                <div className="mp-form-actions">
                  <button type="submit" className="auth-submit-btn mp-save-btn">{t.saveChanges || 'Save Changes'}</button>
                </div>
              </form>
            </div>
          )}

          {/* ---- Availability Tab ---- */}
          {activeTab === 'availability' && (
            <div className="mp-panel">
              <div className="mp-panel-header">
                <h2 className="mp-panel-title">{t.manageAvailabilityTitle || 'Availability'}</h2>
                <p className="mp-panel-sub">{t.availabilitySubtitle || 'Set the times you are available'}</p>
              </div>

              {availabilityError && <div className="auth-error">{availabilityError}</div>}

              {/* Add Slot */}
              <div className="mp-slot-form">
                <h4 className="mp-slot-form-title">{t.addTimeSlot || 'Add Time Slot'}</h4>
                <div className="mp-slot-inputs">
                  <div className="auth-field">
                    <label className="auth-label">{t.day || 'Day'}</label>
                    <select className="auth-input auth-select" value={newSlot.DayOfWeek} onChange={(e) => setNewSlot({ ...newSlot, DayOfWeek: e.target.value })}>
                      {DAYS_OF_WEEK.map(day => <option key={day} value={day}>{day}</option>)}
                    </select>
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.startTime || 'Start Time'}</label>
                    <input type="time" className="auth-input" value={newSlot.StartTime} onChange={(e) => setNewSlot({ ...newSlot, StartTime: e.target.value })} />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.endTime || 'End Time'}</label>
                    <input type="time" className="auth-input" value={newSlot.EndTime} onChange={(e) => setNewSlot({ ...newSlot, EndTime: e.target.value })} />
                  </div>
                </div>
                <button type="button" className="mp-add-slot-btn" onClick={handleAddSlot}>
                  + {t.addSlot || 'Add Slot'}
                </button>
              </div>

              {/* Slot Table */}
              {availability.length > 0 ? (
                <div className="mp-slot-table-wrapper">
                  <table className="mp-slot-table">
                    <thead>
                      <tr>
                        <th>Day</th>
                        <th>Start</th>
                        <th>End</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {availability.map((slot, index) => (
                        <tr key={index}>
                          <td>{slot.DayOfWeek}</td>
                          <td>{formatTime(slot.StartTime)}</td>
                          <td>{formatTime(slot.EndTime)}</td>
                          <td>
                            <button className="mp-remove-btn" onClick={() => handleRemoveSlot(index)}>Remove</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="dash-empty">{t.noSlots || 'No availability slots added yet.'}</p>
              )}

              <div className="mp-form-actions">
                <button className="auth-submit-btn mp-save-btn" onClick={handleSaveAvailability}>
                  {t.saveAvailability || 'Save Availability'}
                </button>
              </div>
            </div>
          )}

          {/* ---- Account Tab ---- */}
          {activeTab === 'account' && (
            <div className="mp-panel">
              <div className="mp-panel-header">
                <h2 className="mp-panel-title">{t.accountSettingsTitle || 'Account Settings'}</h2>
                <p className="mp-panel-sub">{t.accountSubtitle || 'Manage your email, password, and language'}</p>
              </div>

              {accountError && <div className="auth-error">{accountError}</div>}
              {accountSuccess && <div className="mp-success">{accountSuccess}</div>}

              {/* Language */}
              <div className="mp-sub-section">
                <h4 className="mp-sub-title">{t.changeLanguage || 'Language'}</h4>
                <div className="auth-field" style={{ maxWidth: '300px' }}>
                  <label className="auth-label">{t.selectLanguageLbl || 'Preferred Language'}</label>
                  <select className="auth-input auth-select" value={selectedLang} onChange={(e) => { setSelectedLang(e.target.value); setLangSaved(false); }}>
                    {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.label}</option>)}
                  </select>
                </div>
                {langSaved && <div className="mp-success">{t.languageSaved || 'Language saved!'}</div>}
                <button className="auth-submit-btn mp-save-btn" onClick={handleSaveLanguage}>{t.saveChanges || 'Save'}</button>
              </div>

              <div className="mp-divider" />

              {/* Change Email */}
              <div className="mp-sub-section">
                <h4 className="mp-sub-title">{t.changeEmail || 'Change Email'}</h4>
                <p className="mp-sub-hint">{t.currentEmail || 'Current email:'} <strong>{profileInfo.Email}</strong></p>
                <form onSubmit={handleUpdateEmail} className="auth-form" style={{ maxWidth: '460px' }}>
                  <div className="auth-field">
                    <label className="auth-label">{t.newEmail || 'New Email'}</label>
                    <input type="email" className="auth-input" value={emailForm.newEmail} onChange={(e) => setEmailForm({ ...emailForm, newEmail: e.target.value })} placeholder="Enter new email" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.confirmPasswordLbl || 'Confirm Password'}</label>
                    <input type="password" className="auth-input" value={emailForm.password} onChange={(e) => setEmailForm({ ...emailForm, password: e.target.value })} placeholder="Confirm your current password" />
                  </div>
                  <button type="submit" className="auth-submit-btn mp-save-btn">{t.updateEmail || 'Update Email'}</button>
                </form>
              </div>

              <div className="mp-divider" />

              {/* Change Password */}
              <div className="mp-sub-section">
                <h4 className="mp-sub-title">{t.changePassword || 'Change Password'}</h4>
                <form onSubmit={handleUpdatePassword} className="auth-form" style={{ maxWidth: '460px' }}>
                  <div className="auth-field">
                    <label className="auth-label">{t.currentPassword || 'Current Password'}</label>
                    <input type="password" className="auth-input" value={passwordForm.currentPassword} onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })} placeholder="Enter current password" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.newPassword || 'New Password'}</label>
                    <input type="password" className="auth-input" value={passwordForm.newPassword} onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })} placeholder="Min. 6 characters" />
                  </div>
                  <div className="auth-field">
                    <label className="auth-label">{t.confirmNewPassword || 'Confirm New Password'}</label>
                    <input type="password" className="auth-input" value={passwordForm.confirmPassword} onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })} placeholder="Confirm new password" />
                  </div>
                  <button type="submit" className="auth-submit-btn mp-save-btn">{t.updatePassword || 'Update Password'}</button>
                </form>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default EditProfile; 