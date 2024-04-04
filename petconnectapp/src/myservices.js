import './styles/myservices.css'
import Calendar from 'react-calendar'
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';


const MyServices = () => {
    const [minderStatus, setMinderStatus] = useState([]);

    useEffect(() => {
        const fetchStatus = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;

                try {
                    const response = await fetch(`http://localhost:5000/minderStatus/${userid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setMinderStatus(data);
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to fetch status:", errorData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchStatus();
    }, []);
    return (
        <div className="profile-services-container">
            <table className="services-table">
                <thead>
                    <tr>
                        <th>My Services</th>
                    </tr>
                </thead>
                {minderStatus.length > 0 ? (
                    <tbody>
                        {minderStatus.map((status) => (
                            <>
                                <tr>
                                    <td>Location: {status.city}</td>
                                </tr>
                                <tr>
                                    <td>Pets: {status.dog} {status.cat} {status.rabbit} {status.exotic}</td>
                                </tr>
                                <tr>
                                    <td>Services: {status.dogWalking} {status.petSitting} {status.grooming}</td>
                                </tr>
                                <tr>
                                    <td><Link to="/EditServices">Update</Link></td>
                                </tr>
                            </>
                        ))}
                    </tbody>
                ) : (
                    <tbody>
                        <tr>
                            <td>Update your services.</td>
                        </tr>
                    </tbody>
                )}
            </table>
            <div className="calendar">
                Calendar
                <Calendar />
            </div>
        </div>
    );

};


export default MyServices;