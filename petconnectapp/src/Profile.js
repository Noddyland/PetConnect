import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pets from './Pets';
import './styles/Profile.css';

import ViewPets from './ViewPets';
import Bookings from './bookings';
import DisplayReviews from './DisplayReviews';
import MyServices from './myservices';
import GetReports from './GetReports';
import ApproveMinders from './ApproveMinders';

function DisplayDetails(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);

        const reviews = <div><DisplayReviews/></div>;

        if(userObject.user.role === 'owner'){
            return <div>
                {reviews}
                <div><ViewPets /></div>
                <div>
                    <Link to="/pets" className="profile-to-pets-button">Manage My Pets</Link>
                </div>
            </div>;
        }
        else if (userObject.user.role === 'minder'){
            return <div>
                {reviews}
                <div><Bookings/></div>
                <div><MyServices/></div>
            </div>;
        }

        else if (userObject.user.role === 'moderator'){
            return <div className="moderator-panel">
                <GetReports />
                <ApproveMinders />
            </div>
        }
    }
    return "";
}

function ProfileHeader(){
    const userObjectString = localStorage.getItem('userObject');
    const userObject = JSON.parse(userObjectString);
    return <h1><u>{userObject.user.firstName} {userObject.user.lastName} - <GetRole role = {userObject.user.role} /></u></h1>
}

function GetRole({role}){ 
    if(role === "owner"){
        return "Pet Owner";
    } else if(role === "minder"){
        return "Pet Minder";
    } else{
        return "Moderator";
    }
}

function Profile() {

    return (
        <div>
            <ProfileHeader />
            <DisplayDetails />
        </div>
    );
};

export default Profile;