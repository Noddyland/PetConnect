import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css'
import Search from './Search';

function PrintHomeScreen() {
    if (localStorage.getItem('userObject') != null) {
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role == "minder"){
            return <p>pet minder homescreen coming soon...</p>
        }
    }
    return (<Search></Search>)
}

const Home = () => {
    return (
        <PrintHomeScreen></PrintHomeScreen>
    )
};



export default Home;