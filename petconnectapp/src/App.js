import React, { useEffect, useState } from 'react';
import './styles/App.css';
import Navbar from './Navbar';
import './styles/Navbar.css'; // Import the CSS file here
import Home from './Home'; // Your component for the Home page
import Login from './Login'; // Your component for the About page
import Services from './Services'; // Your component for the Services page
import Contact from './Contact'; // Your component for the Contact page
import Register from './Register';
import Profile from './Profile';
import SearchResults from './SearchResults';
import BookMinder from './BookMinder';
import ReviewMinder from './ReviewMinder';
import Pets from './Pets';
import ViewProfile from './ViewProfile';
import EditServices from './editservices';
import ViewUsers from './ViewUsers';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
      <Router>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/SearchResults" element={<SearchResults />} />
          <Route path="/Login" element={
          <div>
            <Login />
            <Link to="/Register">No account? Register here!</Link>
          </div>
          } />
          <Route path="/Profile" element = {<Profile />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/Register" element={<Register></Register>}/>
          <Route path="/BookMinder" element={<BookMinder />}/>
          <Route path="/ReviewMinder" element={<ReviewMinder />}/>
          <Route path="/Pets" element={<Pets />} />
          <Route path="/ViewProfile" element={<ViewProfile />} />
          <Route path="/EditServices" element={<EditServices/>} />
          <Route path="/ViewUsers" element={<ViewUsers/>} />
        </Routes>
      </Router>

    </div>
  );
}

export default App;
