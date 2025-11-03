import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../Profile.css';
import { signUp } from './authService.js';

const Register = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    location: '',
    interests: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      // sign up using username/password and store additional profile fields
      const attrs = {
        email: form.email,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        location: form.location,
        interests: form.interests,
      };
      await signUp(form.username, form.password, attrs);
      // navigate to home (or intended page); since root is protected this will show app
      navigate('/', { replace: true });
    } catch (err) {
      console.error('Signup failed', err);
      setError(err.message || 'Sign up failed');
    }
  };

  return (
    <div className="profile-page">
      <div className="container">
        <h1>Create an account</h1>
        <p>Register to access the Live Local app.</p>
        <hr />


        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName"><b>First Name</b></label>
              <input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="lastName"><b>Last Name</b></label>
              <input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} required />
            </div>
          </div>

          <label htmlFor="username"><b>Username</b></label>
          <input id="username" name="username" value={form.username} onChange={handleChange} required />

          <label htmlFor="email"><b>Email</b></label>
          <input id="email" name="email" value={form.email} onChange={handleChange} type="email" required />

          <label htmlFor="password"><b>Password</b></label>
          <input id="password" name="password" type="password" value={form.password} onChange={handleChange} required />

          <label htmlFor="phone"><b>Phone</b></label>
          <input id="phone" name="phone" value={form.phone} onChange={handleChange} />

          <label htmlFor="location"><b>Location</b></label>
          <input id="location" name="location" value={form.location} onChange={handleChange} />

          <label htmlFor="interests"><b>Interests</b></label>
          <select id="interests" name="interests" value={form.interests} onChange={handleChange}>
            <option value="">Select your main interest</option>
            <option value="dining">Dining and Restaurants</option>
            <option value="shopping">Shopping</option>
            <option value="entertainment">Entertainment</option>
            <option value="fitness">Fitness & Recreation</option>
            <option value="arts">Arts & Culture</option>
            <option value="outdoor">Outdoor Activities</option>
          </select>

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button type="submit">Register</button>
        </form>

        <p>
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
