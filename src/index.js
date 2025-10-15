import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import './services/parseService'; // initializing parse/back4App connection

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


