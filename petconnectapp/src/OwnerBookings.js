import React, { useState, useEffect } from 'react';
import './styles/bookings.css';
import { useLocation } from 'react-router-dom';

const ViewOwnerBookings = () => {
    const [bookings, setBookings] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterDate = queryParams.get('date');


    //remove denied bookings 
    const handleRemoveBooking = async (bookingId) => {
        try {
            const response = await fetch(`http://localhost:5000/bookings/remove/${bookingId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Remove the booking from the client-side state
                setBookings(prevBookings => prevBookings.filter(booking => booking.bookingId !== bookingId));
                console.log('Booking removed successfully.');
            } else {
                const errorData = await response.json();
                console.error("Failed to remove booking:", errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };



    function formatDate(dateString) { // formats the date so it looks a bit nicer
        const date = new Date(dateString);

        const dateOptions = {
            weekday: 'short',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            timeZone: 'UTC'
        };

        const formattedDate = new Intl.DateTimeFormat('en-GB', dateOptions).format(date);

        const timePart = dateString.split(' ')[1];

        const day = date.getUTCDate();
        const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3) ? 0 : (((day % 100) - (day % 10) !== 10) ? day % 10 : 0)];

        const finalDate = formattedDate.replace(day, `${day}${suffix}`) + ' ' + timePart;

        return finalDate;
    }

    function DateFilterFormat(dateString) {
        const date = new Date(dateString);

        const day = date.getUTCDate().toString().padStart(2, '0');
        const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
        const year = date.getUTCFullYear();

        return `${day}/${month}/${year}`;
    }

    useEffect(() => {
        const fetchBookings = async () => {

            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;

                try {
                    const response = await fetch(`http://localhost:5000/bookings/owners/${userid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setBookings(data);
                        console.log(data);

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


    const filteredBookings = filterDate
        ? bookings.filter(booking => DateFilterFormat(booking.dateTime).startsWith(filterDate))
        : bookings;

    return (
        <div>
            <h3>My Bookings</h3>
            {filteredBookings.length > 0 ? (
                <ul>
                    {filteredBookings.map((booking) => (
                        <li key={booking.bookingId} className='bookings_'>
                            <div>
                                <strong>Pet Minder:</strong> {booking.firstName} {booking.lastName}
                            </div>
                            <div>
                                <strong> Pet:</strong> {booking.name} <strong>Type:</strong> {booking.type}
                            </div>
                            <div>
                                <strong>Date:</strong> {formatDate(booking.dateTime)}
                            </div>
                            <div>
                                <strong> Duration:</strong> {booking.durationMins} mins
                            </div>
                            {/* renders based on status*/}
                            <div className={`bookingStatus ${booking.status === 'denied' ? 'deniedStatus' : (booking.status === 'accepted' ? 'acceptedStatus' : '')}`}>
                                {booking.status}
                            </div>
                            {booking.status === 'denied' && (
                                <button className="rm-button" onClick={() => handleRemoveBooking(booking.bookingId)}>Remove?</button>
                            )}
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

                <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '5px' }} >
                    <ViewOwnerBookings />
                </td>
            </tr>
        </tbody>
    </table>)
};


export default Bookings;