import React, { useState, useEffect } from 'react';
import './styles/bookings.css';
const ViewBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [buttonClicked, setButtonClicked] = useState({});

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
                        // track button visibility based on booking status
                        const buttonVisibility = data.reduce((acc, booking) => {
                            acc[booking.bookingId] = booking.status !== 'accepted';
                            return acc;
                        }, {});
                        setBookings(data);
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
                //remove booking from buttonClicked state
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


    return (
        <div>
            <h3>My Bookings</h3>
            {bookings.length > 0 ? (
                <ul>
                    {bookings.map((booking) => (
                        <li key={booking.bookingId} className='bookings_'>
                            <strong>booking user:</strong> {booking.username} <strong>pet name:</strong> {booking.name} <strong>pet type:</strong> {booking.type} <strong>date:</strong> {booking.dateTime} <strong>duration:</strong> {booking.durationMins} mins
                            <div>
                                {/* render the buttons only if buttonClicked[booking.bookingId] is true */}
                                {buttonClicked[booking.bookingId] && (
                                    <>
                                        <button id="accept-button" onClick={(e) => handleAccept(e, booking.bookingId)}>Accept</button>
                                        <button id="deny-button" onClick={(e) => handleDeny(e, booking.bookingId)}>Deny</button>
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