import React from 'react';
import './BusinessCard.css';

const BusinessCard = ({ business }) => {
  return (
    <div className="business-card">
      <h3>{business.Name || "Unnamed Business"}</h3>
      <p><strong>Category:</strong> {business.Category || "N/A"}</p>
      {/* <p><strong>Keywords:</strong> {business.Keywords?.join(", ") || "None"}</p>   removed this statement bc the user doesnt need to see them, maybe we should add a description option too*/} //
      <p><strong>Address:</strong> {
        business.Address || 
        (business.Addresses ? business.Addresses.join(", ") : "N/A")
      }</p>
    </div>
  );
};

export default BusinessCard;
