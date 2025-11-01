import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Application.css';
import { createBusiness } from '../models/Business.js';

const Application = () => {
  const [formData, setFormData] = useState({
    email: '',
    businessName: '',
    businessType: '',
    location: '',
    additionalLocations: [''],
    keywords: '',
    description: '',
    image: null
  });

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      setFormData({
        ...formData,
        [name]: files[0]
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleLocationChange = (index, value) => {
    const newLocations = [...formData.additionalLocations];
    newLocations[index] = value;
    setFormData({
      ...formData,
      additionalLocations: newLocations
    });
  };

  const addLocationField = () => {
    setFormData({
      ...formData,
      additionalLocations: [...formData.additionalLocations, '']
    });
  };

  const removeLocationField = (index) => {
    const newLocations = formData.additionalLocations.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      additionalLocations: newLocations
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse keywords into an array, removing empty strings
    const keywordsArray = formData.keywords
      .split(',')
      .map(k => k.trim())
      .filter(k => k);

    // Combine all addresses
    const addresses = [formData.location, ...formData.additionalLocations.filter(loc => loc && loc.trim())];

    // create a Business object in Parse
    const payload = {
      Name: formData.businessName,
      Category: formData.businessType,
      Address: formData.location,
      Addresses: addresses,
      Keywords: [formData.businessType, ...keywordsArray],
      Description: formData.description,
      Image: formData.image
    };

    createBusiness(payload)
      .then((saved) => {
        console.log('Saved business:', saved.toJSON());
        alert('Thank you — your business application was submitted.');
        setFormData({
          email: '',
          businessName: '',
          businessType: '',
          location: '',
          additionalLocations: [''],
          keywords: '',
          description: '',
          image: null
        });
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
           {/* Additional Locations */}
           <label><b>Additional Locations</b></label>
           {formData.additionalLocations.map((location, index) => (
             <div key={index} className="additional-location">
               <input
                 type="text"
                 placeholder="Enter Additional Address"
                 value={location}
                 onChange={(e) => handleLocationChange(index, e.target.value)}
               />
               <button 
                 type="button" 
                 onClick={() => removeLocationField(index)}
                 className="remove-location"
               >
                 Remove
               </button>
             </div>
           ))}
           <button 
             type="button" 
             onClick={addLocationField}
             className="add-location"
           >
             Add Another Location
           </button>
 
           <label htmlFor="keywords"><b>Keywords</b></label>
           <input
             type="text"
             placeholder="Enter keywords (comma-separated)"
             name="keywords"
             id="keywords"
             value={formData.keywords}
             onChange={handleChange}
           />
           <small>Example: lunch, coffee, vegan, pet-friendly</small>
 
           <label htmlFor="description"><b>Business Description</b></label>
           <textarea
             placeholder="Tell us about your business..."
             name="description"
             id="description"
             value={formData.description}
             onChange={handleChange}
             rows="4"
           />
 
           <label htmlFor="image"><b>Business Image</b></label>
           <input
             type="file"
             accept="image/*"
             name="image"
             id="image"
             onChange={handleChange}
           />
           <small>Upload a photo of your business (JPEG, PNG)</small>

          <button type="submit" className="submit-button">Register</button>
        </form>
      </div>
    </div>
  );
};

export default Application;
