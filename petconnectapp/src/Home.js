import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './styles/Home.css'
import Search from './Search';
import Profile from './Profile';

function PrintHomeScreen() {
    if (localStorage.getItem('userObject') != null) {
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role == "minder" || userObject.user.role == "moderator"){
            return <Profile></Profile>
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