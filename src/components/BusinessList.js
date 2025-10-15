import React, { useState, useEffect } from 'react';
import BusinessCard from './BusinessCard';
import { getAllBusinesses, getBusinessesByKeyword } from '../services/businessService';
import './BusinessList.css';

const BusinessList = () => {
  const [businesses, setBusinesses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // load all businesses on component mount
  useEffect(() => {
    const loadBusinesses = async () => {
      setIsLoading(true);
      try {
        const allBusinesses = await getAllBusinesses();
        setBusinesses(allBusinesses);
      } catch (error) {
        console.error('Error loading businesses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, []);

  // Handle search
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      // If search is empty, load all businesses
      const allBusinesses = await getAllBusinesses();
      setBusinesses(allBusinesses);
      return;
    }

    setIsLoading(true);
    try {
      const results = await getBusinessesByKeyword(searchQuery.trim());
      setBusinesses(results);
    } catch (error) {
      console.error('Error searching businesses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="business-list-container">
      <div className="search-container">
        <label htmlFor="search-input" className="visually-hidden">
          Search Businesses!
        </label>
        <input
          type="text"
          id="search-input"
          name="search"
          className="search-input"
          placeholder="Search for local restaurants"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <button id="search-btn" onClick={handleSearch}>
          Search
        </button>
      </div>

      {isLoading && <div className="loading">Loading...</div>}

      <div className="business-list">
        {businesses.length === 0 && !isLoading ? (
          <p>No businesses found.</p>
        ) : (
          businesses.map((business, index) => (
            <BusinessCard key={index} business={business} />
          ))
        )}
      </div>
    </div>
  );
};

export default BusinessList;
