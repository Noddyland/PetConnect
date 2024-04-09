import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import './styles/Login.css';

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(''); // Clear previous errors
    // Check if email or password is empty
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password fields.');
      return; // Prevent form submission
    }
    const backendUrl = 'http://localhost:5000'; // Define your backend URL
    try {
      const response = await fetch(`${backendUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const userData = await response.json();
        const { token } = userData;

        const decodedToken = jwtDecode(token);

        localStorage.setItem('userObject', JSON.stringify(decodedToken));

        navigate('/');
        window.location.reload();
      } else {
        // Handle different statuses with specific messages
        if (response.status === 401) {
          const { error } = await response.json();
          setErrorMessage(error);
        } else if (response.status === 404) {
          setErrorMessage('User not found, please check your credentials.');
        } else {
          setErrorMessage('Login failed due to server error, please try again later.');
        }
      }
    } catch (error) {
      setErrorMessage('Network error, please try again.');
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
      {errorMessage && <div className="login-error">{errorMessage}</div>}
    </div>
  );
}

export default Login;
