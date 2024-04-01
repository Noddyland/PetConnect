import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pets from './Pets';
import Bookings from './bookings';
import Reviews from './review';

function DisplayDetails(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        console.log(userObject.user.role)
        if(userObject.user.role === 'owner'){

            return <div>
            {userObject.user.firstName} {userObject.user.lastName}<br/>
            {userObject.user.biography}<br/>
            {userObject.user.role}
            <div><Reviews/></div>
            <div><Pets /></div>
        </div>;
        }
        else if (userObject.user.role === 'minder'){

            return <div>
                {userObject.user.firstName} {userObject.user.lastName}<br/>
                {userObject.user.biography}<br/>
                {userObject.user.role}
                <div><Reviews/></div>
                <div><Bookings/></div>
            </div>
            }
    
    }
    return ""
}

function Profile() {

    return (
        <div>
            <h1>Profile</h1>
            <div><DisplayDetails /></div>
        </div>
    );
};

export default Profile;