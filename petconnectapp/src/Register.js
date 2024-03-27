import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './register.css'

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
        <div className='centring_div'>

        <form onSubmit={handleSubmit} className='registerform'>
          <label className='parentcontainer'>
            <div className='input_text'>
              <p className='input_p'>Username</p>
            </div>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>Password</p>
            </div>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>Email</p>
            </div>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>Phone Number</p>
            </div>
            <input type="text" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>First Name</p>
            </div>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>Last Name</p>
            </div>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className='input_box'/>
          </label><br/>
          <label className='parentcontainer'>
            <div className='input_text'>
            <p className='input_p'>Bio</p>
            </div>
            <input type="text" value={biography} onChange={(e) => setBiography(e.target.value)} className='input_box'/>
          </label><br/>
          
          <button type="submit" className='register_button'>Register</button>
        </form>
        </div>
      </div>
    );
  }

export default Register;