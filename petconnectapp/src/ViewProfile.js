import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/ViewProfile.css';

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
                    <h1 className="ViewProfile-header">{userData.firstName} {userData.lastName}</h1> 
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
                </>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default ViewProfile;
