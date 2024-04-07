import React, { useState, useEffect } from 'react';
import './styles/Pets.css';


const ViewPets = () => {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const fetchPets = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;

                try {
                    const response = await fetch(`http://localhost:5000/pets/${userid}`, {
                        method: 'GET', 
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setPets(data);
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to fetch pets:", errorData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchPets();
    }, []); 

    const handleRemovePet = async (petId) => {
        try {
            const response = await fetch(`http://localhost:5000/removepet/${petId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setPets(prevPets => prevPets.filter(pet => pet.petId !== petId));
                console.log("Pet removed successfully");
            } else {
                const errorData = await response.json();
                console.error("Failed to remove pet:", errorData.message);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="my-pets-container">
            <h3 className="my-pets-header">My Pets</h3>
            {pets.length > 0 ? (
                <ul className="my-pets-list">
                    {pets.map((pet) => (
                        <li key={pet.petId}>
                            <button onClick={() => handleRemovePet(pet.petId)}>Remove Pet</button>
                            <strong>Name:</strong> {pet.name}, <strong>Type:</strong> {pet.type}, <strong>DOB:</strong> {pet.dob}
                            
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-pets-found">No pets found.</p>
            )}
        </div>
    );
    
};

export default ViewPets;