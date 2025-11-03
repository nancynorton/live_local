
// added compoment - changed from static in feature 3 to js - Profile page 

// also need to add auth to parse so that we can save profiles to specific users
// also need to add ability to view and edit your own profile
// also need to add ability to delete your own profile
// also need to add ability to view other profiles, maybe a list of profiles or a search function
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Profile.css';
import Parse from '../services/parseService.js';
import { logout } from './Auth/authService.js';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const u = Parse.User.current();
    if (u) {
      // convert Parse.User to plain object
      setUser(u);
      setFormData({
        username: u.get('username') || '',
        email: u.get('email') || '',
        firstName: u.get('firstName') || '',
        lastName: u.get('lastName') || '',
        phone: u.get('phone') || '',
        location: u.get('location') || '',
        interests: u.get('interests') || ''
      });
    }
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error', err);
    }
    navigate('/login', { replace: true });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      // update Parse.User fields and save
      Object.keys(formData).forEach((k) => {
        if (k === 'username') return; // avoid changing username here
        user.set(k, formData[k]);
      });
      // email can be updated
      user.set('email', formData.email || null);
      await user.save();
      setMessage('Profile updated successfully.');
      setEditing(false);
    } catch (err) {
      console.error('Save profile failed', err);
      setMessage('Failed to update profile.');
    }
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="home-nav">
          <Link to="/" className="home-button">Home</Link>
        </div>
        <div className="container">
          <h1>User Profile</h1>
          <p>No user signed in. Please <Link to="/login">sign in</Link> or <Link to="/register">register</Link>.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="home-nav">
        <Link to="/" className="home-button">Home</Link>
      </div>

      <div className="container">
        <h1>Your Account</h1>
        <p className="intro-text">View and edit your account information.</p>
        <hr />

        {message && <p style={{ color: 'green' }}>{message}</p>}

        {!editing ? (
          <div>
            <p><strong>Username:</strong> {user.get('username')}</p>
            <p><strong>Email:</strong> {user.get('email') || '—'}</p>
            <p><strong>Name:</strong> {(user.get('firstName') || '') + ' ' + (user.get('lastName') || '')}</p>
            <p><strong>Phone:</strong> {user.get('phone') || '—'}</p>
            <p><strong>Location:</strong> {user.get('location') || '—'}</p>
            <p><strong>Interests:</strong> {user.get('interests') || '—'}</p>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button onClick={() => setEditing(true)} className="btn-inline">Edit Profile</button>
              <button onClick={handleLogout} className="btn-inline">Logout</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName"><b>First Name</b></label>
                <input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label htmlFor="lastName"><b>Last Name</b></label>
                <input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
              </div>
            </div>

            <label htmlFor="email"><b>Email</b></label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} />

            <label htmlFor="phone"><b>Phone</b></label>
            <input id="phone" name="phone" value={formData.phone} onChange={handleChange} />

            <label htmlFor="location"><b>Location</b></label>
            <input id="location" name="location" value={formData.location} onChange={handleChange} />

            <label htmlFor="interests"><b>Interests</b></label>
            <select id="interests" name="interests" value={formData.interests} onChange={handleChange}>
              <option value="">Select your main interest</option>
              <option value="dining">Dining and Restaurants</option>
              <option value="shopping">Shopping</option>
              <option value="entertainment">Entertainment</option>
              <option value="fitness">Fitness & Recreation</option>
              <option value="arts">Arts & Culture</option>
              <option value="outdoor">Outdoor Activities</option>
            </select>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <button type="submit" className="btn-inline">Save</button>
              <button type="button" onClick={() => { setEditing(false); setMessage(null); }} className="btn-inline">Cancel</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default Profile;
