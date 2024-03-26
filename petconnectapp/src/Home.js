import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
function PrintHomeScreen(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        return "Hello " + userObject.user.firstName;
    }
    return ""
}


const Home = () => {


    return (
        <div>
            <h1>Home</h1>
            <PrintHomeScreen></PrintHomeScreen>
        </div>
    );
};



export default Home;