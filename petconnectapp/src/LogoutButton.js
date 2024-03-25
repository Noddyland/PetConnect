import React from 'react';
import { Link } from 'react-router-dom';



function LogoutButton(){
    
    const handleLogout = () => {
        localStorage.removeItem('userObject'); // Removes the token from localStorage
        window.location.reload();
    }
    if (localStorage.getItem('userObject') != null){
        return (
            <div>
                <button onClick={handleLogout}>Logout</button>
            </div>
        );
    }
    return (null);
};

export default LogoutButton;