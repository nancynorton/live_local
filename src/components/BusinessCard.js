import React from 'react';
import './BusinessCard.css';
import { Link } from 'react-router-dom';

const BusinessCard = ({ business }) => {
  const id = business.objectId || encodeURIComponent(business.Name || '');

  return (
    <Link to={`/business/${id}`} className="business-card-link">
      <div className="business-card">
        <div className="card-image" style={{ backgroundImage: `url(${business.Image || '/images/coffee.jpg'})` }} />
        <div className="card-body">
          <h3>{business.Name || "Unnamed Business"}</h3>
          <p className="address"><strong>Address:</strong> {
            business.Address || (business.Addresses ? business.Addresses.join(", ") : "N/A")
          }</p>
        </div>
      </div>
    </Link>
  );
};

export default BusinessCard;
