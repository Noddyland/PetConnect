import React, { useEffect, useState } from 'react';
import './App.css';
import Navbar from './Navbar';
import './Navbar.css'; // Import the CSS file here
import Home from './Home'; // Your component for the Home page
import Login from './Login'; // Your component for the About page
import Services from './Services'; // Your component for the Services page
import Contact from './Contact'; // Your component for the Contact page

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  const [backendData, setBackendData] = useState([{}])

  useEffect(() => {
    fetch("/api").then(
      response => response.json()
    ).then(
      data => {
        setBackendData(data)
      }
    )
  }, [])
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
      
      {(typeof backendData.users === 'undefined') ? (
        <p>Loading...</p>
      ) : (
        backendData.users.map((user, i) => (
          <p key = {i}>{user}</p>
        ))
      )}
    </div>
  );
}

export default App;
