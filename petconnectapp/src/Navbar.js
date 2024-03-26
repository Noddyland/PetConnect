import React from 'react';
import { Link } from 'react-router-dom';
import petConnectLogo from './petconnectlogo.png';

const ShowProfile = () => {
    if (localStorage.getItem('userObject') != null){
        return (
            "Profile"
        );
    }
    return (null);
}
const Navbar = () => {
    return (
        <nav className="navbar">
            <Link to="/" className="home-link">
                <img src={petConnectLogo} alt="Home" />
            </Link>
            <ul className="nav-links">
                <li>
                    <Link to="/profile"><ShowProfile></ShowProfile></Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>
                <li>
                    <Link to="/services">Services</Link>
                </li>
                <li>
                    <Link to="/contact">Contact Us</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
