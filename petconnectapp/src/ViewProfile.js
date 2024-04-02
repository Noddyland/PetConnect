import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
        <div>
            {userId && <p>Id from URL: {userId}</p>}
            <h1>User Profile</h1>
            {userData ? (
                <div>

                    <p>Username: {userData.username}</p>
                    <p>Email: {userData.email}</p>
                    <p>Phone Number: {userData.phoneNumber}</p>
                    <p>Name: {userData.firstName} {userData.lastName}</p>
                    <p>Biography: {userData.biography}</p>
                    <p>Account Status: {userData.accountStatus}</p>
                    <p>Role: {userData.role}</p>
                </div>
            ) : (
                <p>Loading user data...</p>
            )}
        </div>
    );
};

export default ViewProfile;
