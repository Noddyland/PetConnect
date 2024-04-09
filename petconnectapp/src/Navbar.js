import React from 'react';
import { Link } from 'react-router-dom';
import petConnectLogo from './images/petconnectlogo.png';
import Login from './Login';
import LogoutButton from './LogoutButton';

const ShowProfile = () => {
    if (localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role == "owner"){
            return(
            <Link to="/profile">Profile</Link>
            )
        }
    }
    return (null);
}

const ViewUsers = () => {
    if (localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role == "moderator"){
            return(
            <Link to="/viewUsers">View Users</Link>
            )
        }
    }
    return (null);
}
const LoginSwitch = () => {
    if (localStorage.getItem('userObject') == null){
        return (
            <Link to="/login">Login</Link>
        );
    }
    return (<LogoutButton></LogoutButton>);
}

const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="home-link">
                <img src={petConnectLogo} alt="Home" />
            </Link>
            <ul className="nav-links">
                <li>
                    <ViewUsers />
                </li>
                <li>
                    <ShowProfile></ShowProfile>
                </li>
                <li>
                    <LoginSwitch></LoginSwitch>
                </li>
                <li>
                    <Link to="/services">Services</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
