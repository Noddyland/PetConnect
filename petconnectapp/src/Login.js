import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Login() {
    
  
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
            const { token } = await response.json();
            // Store the token in localStorage/sessionStorage
            localStorage.setItem('token', token);
            // Redirect user or update UI
        } else {
        alert('Login failed!');
        }
    };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Login</button>
    </form>
  );
  }

export default Login;