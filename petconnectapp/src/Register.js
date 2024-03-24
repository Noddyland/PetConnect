import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [biography, setBiography] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password, email, phoneNumber, firstName, lastName, biography }),
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
      <div>
        <h1>Register</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </label><br/>
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </label><br/>
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </label><br/>
          <label>
            Phone Number:
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          </label><br/>
          <label>
            First Name:
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </label><br/>
          <label>
            Last Name:
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </label><br/>
          <label>
            Biography:
            <input type="text" value={biography} onChange={(e) => setBiography(e.target.value)} />
          </label><br/>
          
          <button type="submit">Register</button>
        </form>
      </div>
    );
  }

export default Register;