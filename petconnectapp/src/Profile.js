import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pets from './Pets';
import './Profile.css';

import ViewPets from './ViewPets';
import Bookings from './bookings';
import DisplayReviews from './DisplayReviews';

function DisplayDetails(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);

        // Common elements
        const userDetails = (
            <div>
                {userObject.user.firstName} {userObject.user.lastName}<br/>
                {userObject.user.biography}<br/>
                {userObject.user.role}
            </div>
        );

        const reviews = <div><DisplayReviews/></div>;

        if(userObject.user.role === 'owner'){
            return <div>
                {userDetails}
                {reviews}
                <div><ViewPets /></div>
                <div>
                    <Link to="/pets" className="profile-to-pets-button">Manage My Pets</Link>
                </div>
            </div>;
        }
        else if (userObject.user.role === 'minder'){
            return <div>
                {userDetails}
                {reviews}
                <div><Bookings/></div>
            </div>;
        }
    }
    return "";
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