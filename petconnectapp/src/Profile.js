import React from 'react';
import { Link } from 'react-router-dom';

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
const Profile = () => {
    return (
        <div><DisplayDetails></DisplayDetails></div>
    );
};

export default Profile;