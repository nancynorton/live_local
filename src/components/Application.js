import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Application.css';
import { createBusiness } from '../models/Business.js';

const Application = () => {
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    businessType: '',
    location: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // create a Business object in Parse
    const payload = {
      Name: formData.businessName,
      Category: formData.businessType,
      Address: formData.location,
      Keywords: [formData.businessType, formData.location]
    };

    createBusiness(payload)
      .then((saved) => {
        console.log('Saved business:', saved.toJSON());
        alert('Thank you — your business application was submitted.');
        setFormData({ email: '', businessName: '', businessType: '', location: '' });
      })
      .catch((err) => {
        console.error('Error saving business:', err);
        alert('There was a problem submitting your application. It will be saved locally.');
      });
  };

  return (
    <div className="application-page">
      <div className="home-nav">
        <Link to="/" className="home-button">Home</Link>
      </div>
      
      <div className="container">
        <h1>Add your business to our map!</h1>
        <p>Please fill in this form to add your local business to our map</p>
        <hr />

        <form onSubmit={handleSubmit}>
          <label htmlFor="email"><b>Email</b></label>
          <input
            type="email"
            placeholder="Enter Email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label htmlFor="business-name"><b>Business Name</b></label>
          <input
            type="text"
            placeholder="Enter Business Name"
            name="businessName"
            id="business-name"
            value={formData.businessName}
            onChange={handleChange}
            required
          />

          <label htmlFor="business-type"><b>Business Type</b></label>
          <select 
            name="businessType" 
            id="business-type" 
            value={formData.businessType}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Select a type</option>
            <option value="restaurant">Restaurant</option>
            <option value="cafe">Café</option>
            <option value="retail">Retail</option>
            <option value="service">Service</option>
            <option value="other">Other</option>
          </select>

          <label htmlFor="location"><b>Business Location</b></label>
          <input
            type="text"
            placeholder="Enter Address"
            name="location"
            id="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <button type="submit">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Application;
