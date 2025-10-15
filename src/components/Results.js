// results page for when we click on suggested categories - wille ventually display all suggested businesses in each category 

import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import BusinessCard from './BusinessCard';
import { getBusinessesByKeyword } from '../services/businessService';
import './Results.css';

const Results = () => {
  const [searchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const keyword = searchParams.get('keyword');

  useEffect(() => {
    const loadResults = async () => {
      if (!keyword) return;
      
      setIsLoading(true);
      try {
        // fetch matching businesses 
        const results = await getBusinessesByKeyword(keyword);
        setBusinesses(results);
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadResults();
  }, [keyword]);

  if (!keyword) {
    return (
      <div className="results-page">
        <div className="home-nav">
          <Link to="/" className="home-button">Home</Link>
        </div>
        <div className="container">
          <h1>No search keyword provided</h1>
          <p>Please go back and select a category to search.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="home-nav">
        <Link to="/" className="home-button">Home</Link>
      </div>
      
      <div className="container">
        <h1 id="results-title">
          {isLoading ? 'Loading...' : `Results for "${keyword}"`}
        </h1>
        
        {isLoading ? (
          <div className="loading">Loading results...</div>
        ) : businesses.length === 0 ? (
          <p>No results found for "{keyword}".</p>
        ) : (
          <div className="business-list">
            {businesses.map((business, index) => (
              <BusinessCard key={index} business={business} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
