import React, { useState, useEffect } from 'react';
import './styles/bookings.css';
import { useLocation } from 'react-router-dom';

const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [buttonClicked, setButtonClicked] = useState({});
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const filterDate = queryParams.get('date'); 

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
        const suffix = ['th', 'st', 'nd', 'rd'][(day % 10 > 3) ? 0 : (((day % 100) - (day % 10) != 10) ? day % 10 : 0)];
      
        const finalDate = formattedDate.replace(day, `${day}${suffix}`) + ', ' + timePart;
      
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
                    const response = await fetch(`http://localhost:5000/bookings/${userid}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        const buttonVisibility = data.reduce((acc, booking) => {
                            acc[booking.bookingId] = booking.status !== 'accepted';
                            return acc;
                        }, {});
                        setBookings(data);
                        console.log(data);
                        setButtonClicked(buttonVisibility);
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

    const backendUrl = 'http://localhost:5000';

    //accept booking
    const handleAccept = async (e, bookingId) => {
        e.preventDefault();
        console.log("Booking ID:", bookingId);

        const userObject = JSON.parse(localStorage.getItem('userObject'));

        const bookingStatus = {
            bookingId: bookingId,
            minderId: userObject.user.id,
            status: 'accepted'
        };

        try {
            const response = await fetch(`${backendUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingStatus),
            });

            if (response.ok) {
                console.log("Booking accepted!");
                const bookingAcceptedElement = document.getElementById(`bookingAccepted_${bookingId}`);
                if (bookingAcceptedElement) {
                    bookingAcceptedElement.innerHTML = `Booking accepted!`;
                }
                setButtonClicked((prevState) => {
                    const updatedState = { ...prevState };
                    delete updatedState[bookingId];
                    return updatedState;
                });
            } else {
                console.error("Failed to update:", await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    //deny booking
    const handleDeny = async (e, bookingId) => {
        e.preventDefault();
        const userObject = JSON.parse(localStorage.getItem('userObject'));

        const bookingStatus = {
            bookingId: bookingId,
            minderId: userObject.user.id,
            status: 'denied'
        };

        try {
            const response = await fetch(`${backendUrl}/bookings`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingStatus),
            });

            if (response.ok) {
                const bookingAcceptedElement = document.getElementById(`bookingDenied_${bookingId}`);
                if (bookingAcceptedElement) {
                    bookingAcceptedElement.innerHTML = `Booking denied!`;
                }
                setButtonClicked((prevState) => {
                    const updatedState = { ...prevState };
                    delete updatedState[bookingId];
                    return updatedState;
                });
            } else {
                console.error("Failed to update:", await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                            <strong>Pet Minder:</strong> {booking.firstName} {booking.lastName}
                            <strong> Pet:</strong> {booking.name} <strong>Type:</strong> {booking.type}
                            <br/><strong>Date:</strong> {formatDate(booking.dateTime)}
                            <strong> Duration:</strong> {booking.durationMins} mins
                            <div>
                                {buttonClicked[booking.bookingId] && (
                                    <>
                                        <button onClick={(e) => handleAccept(e, booking.bookingId)}>Accept</button>
                                        <button onClick={(e) => handleDeny(e, booking.bookingId)}>Deny</button>
                                    </>
                                )}
                            </div>
                            <p id={`bookingDenied_${booking.bookingId}`}></p>
                            <p id={`bookingAccepted_${booking.bookingId}`}></p>
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
                    <ViewBookings />
                </td>
            </tr>
        </tbody>
    </table>)
};


export default Bookings;