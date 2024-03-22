import React from 'react';
import './App.css';
import Navbar from './Navbar';
import './Navbar.css'; // Import the CSS file here
import Home from './Home'; // Your component for the Home page
import Login from './Login'; // Your component for the About page
import Services from './Services'; // Your component for the Services page
import Contact from './Contact'; // Your component for the Contact page

import { Link } from 'react-router-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
