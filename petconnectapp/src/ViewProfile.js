import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './styles/ViewProfile.css';
import AvgStarRating from './AvgStarRating';

const ViewProfile = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const userId = queryParams.get('userId');

    const [userData, setUserData] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/ViewProfile/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); 
                } else {
                    const errorData = await response.json();
                    console.error("Failed to fetch user data:", errorData.message);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        };

        if (userId) {
            fetchUserData();
        }
    }, [userId]); 

    return (
        <div className="ViewProfile-container"> 
            {userData ? (
                <>
                    <div className = "profile-header"><h1 className="ViewProfile-header"><u>{userData.firstName} {userData.lastName}</u></h1><AvgStarRating userId={userData.id} /></div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Username: </span>
                        <span className="ViewProfile-value">{userData.username}</span>
                    </div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Name: </span>
                        <span className="ViewProfile-value">{userData.firstName} {userData.lastName}</span>
                    </div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Email: </span>
                        <span className="ViewProfile-value">{userData.email}</span>
                    </div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Phone Number: </span>
                        <span className="ViewProfile-value">{userData.phoneNumber}</span>
                    </div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Biography: </span>
                        <span className="ViewProfile-value">{userData.biography}</span>
                    </div>
                    <div className="ViewProfile-block">
                        <span className="ViewProfile-label">Role: </span>
                        <span className="ViewProfile-value">{userData.role}</span>
                    </div> 
                    <Link to={`/ReviewMinder?userId=${userId}&firstName=${userData.firstName}`} style={{ color: '#A70909' }}>Review {userData.firstName}</Link> 
                    <br></br>
                    <Link to={`/ReportUser?userId=${userId}&firstName=${userData.firstName}`} style={{ color: '#A70909' }}>Report {userData.firstName}</Link>
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default ViewProfile;
