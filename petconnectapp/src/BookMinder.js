import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './styles/BookMinder.css'; // Include your stylesheet
import AvgStarRating from './AvgStarRating';

const BookMinder = () => {
    const location = useLocation();
    const { minderObject } = location.state || {};
    const [pets, setPets] = useState([]);
    const [selectedPetId, setSelectedPetId] = useState('');
    const [selectedTime, setSelectedTime] = useState('');
    const [duration, setDuration] = useState('');

    useEffect(() => {
        const fetchPets = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userId = userObject.user.id;

                try {
                    const response = await fetch(`http://localhost:5000/pets/${userId}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setPets(data);
                        if (data.length > 0) {
                            setSelectedPetId(data[0].petId);
                        }
                    } else {
                        console.error("Failed to fetch pets.");
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchPets();
    }, []);

    if (!minderObject) {
        return <div>Loading...</div>;
    }

    const backendUrl = 'http://localhost:5000';

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Check if any required field is empty
        if (!selectedPetId || !selectedTime || !duration) {
            // Display an error message
            document.getElementById('bookingConfirmation').innerHTML = 'Please fill in all the fields';
            return; // Prevent form submission
        }
        const userObject = JSON.parse(localStorage.getItem('userObject'));

        const bookingDetails = {
            ownerId: userObject.user.id,
            minderId: minderObject.id,
            petId: selectedPetId,
            date: minderObject.dateTime,
            time: selectedTime,
            duration: duration,
        };

        try {
            const response = await fetch(`${backendUrl}/BookMinder`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(bookingDetails),
            });

            if (response.ok) {
                console.log("Requested booking successfully!");
                document.getElementById('bookingConfirmation').innerHTML = `Request sent!`;
            } else {
                console.error("Failed to book:", await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="book-minder-container">
            <div className = "profile-header"><h1 className="book-minder-header"><u>Book {minderObject.firstName} {minderObject.lastName}</u></h1><AvgStarRating userId={minderObject.id} /></div> 
            <div className="service-info">Service: {minderObject.service}</div>
            <p style={{ color: '#A70909' }}><u>Select a pet:</u></p>
            <select name="pets" id="pet-select" className="pet-select-dropdown" value={selectedPetId} onChange={(e) => setSelectedPetId(e.target.value)}>
                {pets.length > 0 ? (

                    pets.map((pet) => (
                        <option key={pet.petId} value={pet.petId}>

                            {pet.name} - {pet.type}
                        </option>
                    ))
                ) : (
                    <option>No pets found</option>
                )}
            </select>
            <div className="date-info">Date: {minderObject.dateTime}</div>
            <p style={{ color: '#A70909' }}><u>Select a time:</u></p>
            <input type="time" id="time-select" name="time" className="time-input-dropdown" value={selectedTime} onChange={(e) => setSelectedTime(e.target.value)} />
            <p style={{ color: '#A70909' }}><u>Duration (mins):</u></p>
            <input
                type="number"
                id="duration"
                name="duration"
                className="duration-input-dropdown"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                min="0"
            />
            <div className="profile-link">
                <p>View <Link to={`/ViewProfile?userId=${minderObject.id}`} style={{ color: '#A70909' }}>{minderObject.firstName}'s profile</Link></p>
            </div>
            <div className="profile-link">
                <p>Review <Link to={`/ReviewMinder`} style={{ color: '#A70909' }}>{minderObject.firstName}'s profile</Link></p>
            </div>
            <button className="request-to-book-button" onClick={handleSubmit}>Request to Book</button>
            <p id="bookingConfirmation" style={{ color: 'green' }}></p>
        </div>
    );
};

export default BookMinder;
