// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import App from './App';
import Chatbot from './Chatbot';
import Camera from './components/Camera';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/camera" element={<Camera />} />
        {/* Add other routes as needed */}
        {/* <Route path="/about" element={<About />} /> */}
        {/* <Route path="/contact" element={<Contact />} /> */}
        {/* <Route path="/proxy" element={<Proxy />} /> */}
      </Routes>
    </Router>
  </React.StrictMode>
);