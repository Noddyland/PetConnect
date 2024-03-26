import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });
        if (response.ok) {
            const userData = await response.json();
            const { token } = userData;
            const decodedToken = jwtDecode(token);
            // Store the decoded token object as a string
            localStorage.setItem('userObject', JSON.stringify(decodedToken));
            navigate('/');
            window.location.reload();
              
        } else {
        alert('Login failed!');
        }
    };

    return (
      <div className="login-container">
        <h1 className="login-title">Log in</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <input 
            className="login-input"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
          <input 
            className="login-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
          <button className="login-button" type="submit">Log in</button>
        </form>
      </div>
    );
  }
  

export default Login;