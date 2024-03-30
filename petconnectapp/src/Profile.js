import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import Pets from './Pets';

function DisplayDetails(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        return <div>
            {userObject.user.firstName} {userObject.user.lastName}<br/>
            {userObject.user.biography}
        </div>;
    }
    return ""
}

function Profile() {

    return (
        <div>
            <h1>Profile</h1>
            <div><DisplayDetails /></div>
            <div><Pets /></div>
        </div>
    );
};

export default Profile;