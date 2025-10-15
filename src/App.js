// Student B - configured webpack, migrated files from feature 3 into live-local (the new create-react-app directory)

import React from 'react';
// Student b - adding in routing 
// the Link part in the router allows us to navigate w/out reloading the page - tells router to render the matching route

import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import BusinessList from './components/BusinessList';
import Application from './components/Application';
import Profile from './components/Profile';
import Results from './components/Results';
import './App.css';

function HomePage() {
  return (
    <main>
      <BusinessList />
      
        <div className="suggested-section">
          <h2>Suggested Categories to Explore</h2>
          <div className="image-row">
            <Link to="/results?keyword=Cafes" className="image-container">
              <img src="/images/coffee.jpg" alt="Cafes" />
              <div className="image-caption">Cafes</div>
            </Link>
            <Link to="/results?keyword=Lunch" className="image-container">
              <img src="/images/sanwich.jpg" alt="Lunch Places" />
              <div className="image-caption">Lunch Places</div>
            </Link>
            <Link to="/results?keyword=Other" className="image-container">
              <img src="/images/clothes_picture.jpg" alt="Other" />
              <div className="image-caption">Other</div>
            </Link>
          </div>
        </div>
      
      <div className="map-section">
        <h2>Location Map</h2>
        <div className="map-container">
          <img src="/images/map_image.webp" alt="Location Map" />
        </div>
      </div>
    </main>
  );
}


// registering routes 
function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <h1>Live Local</h1>
          <nav>
            <ul className="nav-links">
              <li><Link to="/application">Apply</Link></li>
              <li><Link to="/profile">User Profile</Link></li>
            </ul>
          </nav>
        </header>
        <Routes>
          {/* pages we want to be able to navigate to - in each of these pages we have to import the Link var from react-router-dom to allow for routing to work */}
          <Route path="/" element={<HomePage />} /> 
          <Route path="/application" element={<Application />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/results" element={<Results />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
