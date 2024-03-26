import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css'

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [biography, setBiography] = useState('');
    const [userRole, setUserRole] = useState('owner'); // Default to 'owner', or leave empty if no default

  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email, phoneNumber, firstName, lastName, biography, userRole }),
        });
        if (response.ok) {
          console.log("User registered successfully!");
          // Handle successful registration here (e.g., redirect to login page)
        } else {
          console.error("Failed to register user.");
          // Handle errors or unsuccessful registration here
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };
  
    return (
      <div className="container">
        <h1>Register</h1>
        <form onSubmit={handleSubmit} className="form-container">
          <div className="form-group">
            <label className="form-label">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
            />
          </div>
    
          <div className="form-group">
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
          </div>
    
          <div className="form-group">
            <label className="form-label">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
          </div>
    
          <div className="form-group">
              <label className="form-label">Phone Number:</label>
              <div className="input-container">
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-row"> 
              <div className="form-group form-half">
                <label className="form-label">First Name:</label>
                <div className="input-container">
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group form-half">
                <label className="form-label">Last Name:</label>
                <div className="input-container">
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="form-input"
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Biography:</label>
              <div className="input-container">
                <input
                  type="text"
                  value={biography}
                  onChange={(e) => setBiography(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
    
          <div className="form-group">
            <label className="form-label">I am a:</label>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value)}
              className="form-select"
            >
              <option value="owner">Pet Owner</option>
              <option value="minder">Pet Minder</option>
            </select>
          </div>
    
          <div className="form-group">
            <button type="submit" className="form-button">Register</button>
          </div>
        </form>
      </div>
    );
    
  }

export default Register;