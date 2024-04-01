import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './BookMinder.css'; // Include your stylesheet

const BookMinder = () => {
    const location = useLocation();
    const { minderObject } = location.state || {}; // Add default empty object
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userId = userObject.user.id; // Make sure this matches how your userObject is structured

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
                    } else {
                        // Handle HTTP errors
                        console.error("Failed to fetch pets.");
                    }
                } catch (error) {
                    // Handle fetch errors
                    console.error('Error:', error);
                }
            }
        };

        fetchPets();
    }, []); // Empty dependency array means this effect runs once on mount

    if (!minderObject) {
        return <div>Loading...</div>;
    }

    return (
        <div className="book-minder-container">
            <h1 className="book-minder-header"><u>Book {minderObject.firstName} {minderObject.lastName}</u></h1>
            <div className="service-info">Service: {minderObject.service}</div>
            <p style={{ color: '#A70909' }}><u>Select a pet:</u></p>
            <select name="pets" id="pet-select" className="pet-select-dropdown">
                {pets.length > 0 ? (
                    pets.map((pet) => (
                        <option key={pet.id} value={pet.id}>
                            
                            {pet.name} - {pet.type}
                        </option>
                    ))
                ) : (
                    <option>No pets found</option>
                )}
            </select>
            <div className="date-info">Date: {minderObject.dateTime}</div>
            <p style={{ color: '#A70909' }}><u>Select a time:</u></p>
            <input type="time" id="time-select" name="time" className="time-input-dropdown" />
            <div className="profile-link">
                <p>View <Link to={`/profile/${minderObject.id}`} style={{ color: '#A70909' }}>{minderObject.firstName}'s profile</Link></p>
            </div>
            <button className="request-to-book-button">Request to Book</button>
        </div>
    );
};

export default BookMinder;
