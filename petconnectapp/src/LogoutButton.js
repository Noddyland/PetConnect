import React from 'react';
import { Link } from 'react-router-dom';



function LogoutButton(){
    
    const handleLogout = () => {
        localStorage.removeItem('userObject'); // Removes the token from localStorage
        window.location.reload();
    }
    if (localStorage.getItem('userObject') != null){
        return (
            <Link onClick={handleLogout}>
                Logout
            </Link>
        );
    }
    return (null);
};

export default LogoutButton;