
// added compoment - changed from static in feature 3 to js - Profile page 

// also need to add auth to parse so that we can save profiles to specific users
// also need to add ability to view and edit your own profile
// also need to add ability to delete your own profile
// also need to add ability to view other profiles, maybe a list of profiles or a search function
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';
import { createProfile } from '../models/Profile.js';

const Profile = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    location: '',
    interests: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // create profile in Parse
    createProfile(formData)
      .then((saved) => {
        console.log('Saved profile:', saved.toJSON());
        alert('Profile created successfully!');
        setFormData({ firstName: '', lastName: '', email: '', phone: '', location: '', interests: '' });
      })
      .catch((err) => {
        console.error('Error saving profile:', err);
        alert('There was a problem saving your profile.');
      });
  };

  return (
    <div className="profile-page">
      <div className="home-nav">
        <Link to="/" className="home-button">Home</Link>
      </div>

      <div className="container">
        <h1>User Profile</h1>
        <p>Please fill in this form to create an account.</p>
        <hr />

        <p className="intro-text">
          Tell us about yourself to create your local profile.
        </p>

        <hr />

        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="first-name"><b>First Name</b></label>
              <input
                type="text"
                placeholder="Enter your first name"
                name="firstName"
                id="first-name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="last-name"><b>Last Name</b></label>
              <input
                type="text"
                placeholder="Enter your last name"
                name="lastName"
                id="last-name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="email"><b>Email Address</b></label>
          <input
            type="email"
            placeholder="Enter your email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="phone"><b>Phone Number</b></label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            name="phone"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
          />

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="location"><b>Location</b></label>
              <input
                type="text"
                placeholder="City, State"
                name="location"
                id="location"
                value={formData.location}
                onChange={handleChange}
              />
            </div>
          </div>

          <label htmlFor="interests"><b>Interests</b></label>
          <select 
            name="interests" 
            id="interests"
            value={formData.interests}
            onChange={handleChange}
          >
            <option value="">Select your main interest</option>
            <option value="dining">Dining and Restaurants</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="fitness">Fitness & Recreation</option>
            <option value="arts">Arts & Culture</option>
            <option value="outdoor">Outdoor Activities</option>
          </select>

          <button type="submit">Create Profile</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
