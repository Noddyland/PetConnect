import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './styles/UserCalendar.css';
import { useNavigate } from 'react-router-dom';

const UserCalendar = () => {
    const [bookings, setBookings] = useState([]);
    const [date, setDate] = useState(new Date());
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;
                const userRole = userObject.user.role;

                try {
                    const response = await fetch(`http://localhost:5000/bookings?userid=${userid}&userRole=${userRole}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log(data);
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

    const formatDate = (date) => {
        return new Date(date).toLocaleString('en-GB', {
          timeZone: 'Europe/London',
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).split(', ')[0]; 
    };
      
    const dateHasBookings = (date) => {
        const checkDate = formatDate(date);
        return bookings.some(booking => formatDate(new Date(booking.dateTime)) === checkDate);
    };

    const handleDayClick = (date, event) => {
        navigate(`/ViewBookings?date=${formatDate(date)}`);
    };

    return (
        <Calendar
            onChange={setDate}
            value={new Date()}
            tileClassName={({ date, view }) => view === 'month' && dateHasBookings(date) ? 'highlight' : null}
            onClickDay={handleDayClick}
        />
    );
};
export default UserCalendar;
