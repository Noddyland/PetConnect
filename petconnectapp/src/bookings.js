import React, { useState, useEffect } from 'react';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    
    useEffect(() => {
        const fetchBookings = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;
                
                try {
                    const response = await fetch(`http://localhost:5000/bookings/${userid}`, {
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        setBookings(data);
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to fetch bookings:", errorData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };
        
        fetchBookings();
    }, []); 
    
    return (
        <div>
                <h3>My Bookings</h3>
                {bookings.length > 0 ? (
                    <ul>
                        {bookings.map((booking) => (
                            <li key={booking.id}>
                                booking user: {booking.username} pet name: {booking.name} pet type: {booking.type} date: {booking.dateTime} duration: {booking.durationMins} mins
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No bookings found.</p>
                    )}
            </div>
        );
    };
    
const Bookings = () => {
        return (<table style={{ borderCollapse: 'collapse', width: '80%', marginTop: '20px', backgroundColor: 'white', margin: 'auto' }}>
        <thead>
            <tr>
                
                <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px', textAlign: 'center' }}>
                    My Bookings
                </th>
            </tr>
        </thead>
        <tbody>
            <tr>
                
                <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>
                    <ViewBookings />
                </td>
            </tr>
        </tbody>
    </table>)
};


export default Bookings;