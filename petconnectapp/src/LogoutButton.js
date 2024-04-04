import React from 'react';
import { Link, useNavigate } from 'react-router-dom';



function LogoutButton(){
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('userObject'); // Removes the token from localStorage
        navigate('/');
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