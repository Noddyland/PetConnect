import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


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
            const userData = await response.json();
            const { token } = userData;
            const decodedToken = jwtDecode(token);
            // Store the decoded token object as a string
            localStorage.setItem('userObject', JSON.stringify(decodedToken));

            // Retrieve the string and parse it back into an object
            const userObjectString = localStorage.getItem('userObject');
            const userObject = JSON.parse(userObjectString);
            console.log(userObject.user.username);
            // alert('WOW FANTASTIC');
        } else {
        alert('Login failed!');
        }
    };

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit">Login</button>
      </form>
    </div>
  );
  }

export default Login;