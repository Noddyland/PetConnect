import './myservices.css'
import Calendar from 'react-calendar'
import React from 'react';
import { Link } from 'react-router-dom';

const MyServices = () => {
    return (
        <div className="profile-services-container">
            <table className="services-table">
                <thead>
                    <tr>
                        <th>My Services</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Location</td>
                    </tr>
                    <tr>
                        <td>Pets</td>
                    </tr>
                    <tr>
                        <td>Services</td>
                    </tr>
                    <tr>
                        <td><Link to="/EditServices">Edit</Link></td>
                    </tr>
                </tbody>
            </table>
            <div className="calendar">
                Calendar
                <Calendar />
            </div>
        </div>

    )
};


export default MyServices;