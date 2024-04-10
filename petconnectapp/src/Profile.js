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
import OwnerBookings from './OwnerBookings';
import UserCalendar from './UserCalendar';
import AvgStarRating from './AvgStarRating';

function DisplayDetails() {
    if (localStorage.getItem('userObject') != null) {
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);

        const reviews = <div><DisplayReviews /></div>;

        if (userObject.user.role === 'owner') {
            return <div>
                
                <div className="moderator-panel">
                    <ViewPets />
                    <UserCalendar />
                </div>
                {reviews}
                <br />
                <div className="bookingsOwner"><OwnerBookings/></div>
            </div>;
        }
        else if (userObject.user.role === 'minder') {
            return <div>
                
                <div><Bookings /></div>
                {reviews}
                <br></br>
                <div><MyServices /></div>
            </div>;
        }

        else if (userObject.user.role === 'moderator') {
            return <div className="moderator-panel">
                <GetReports />
                <ApproveMinders />
            </div>
        }
    }
    return "";
}

function ProfileHeader() {
    const userObjectString = localStorage.getItem('userObject');
    const userObject = JSON.parse(userObjectString);

    return (
        <div className="profile-header">
            <h1><u>{userObject.user.firstName} {userObject.user.lastName} - <GetRole role={userObject.user.role} /></u></h1>
            <AvgStarRating userId={userObject.user.id} />
        </div>
    );
}


function GetRole({ role }) {
    if (role === "owner") {
        return "Pet Owner";
    } else if (role === "minder") {
        return "Pet Minder";
    } else {
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