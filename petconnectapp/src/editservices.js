// FormComponent.js
import React, { useState } from 'react';
import './editservices.css'

const EditServices = () => {
    const [location, setLocation] = useState('');
    const [selectedPets, setSelectedPets] = useState([]);
    const { minderObject } = location.state || {}; 



    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        if (checked) {
            setSelectedPets([...selectedPets, value]);
        } else {
            setSelectedPets(selectedPets.filter(pet => pet !== value));
        }
    };
  
    const handleLocationChange = (e) => {
        setLocation(e.target.value);
    };

    const backendUrl = 'http://localhost:5000';
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userObject = JSON.parse(localStorage.getItem('userObject'));

        const minderDetails = {
            minderId: userObject.user.id,
            city: location,
            dog: selectedPets.includes('dog') ? 'true' : 'false',
            cat: !!selectedPets.includes('cat')? 'true' : 'false',
            rabbit: !!selectedPets.includes('rabbit')? 'true' : 'false',
            exotic: !!selectedPets.includes('exotic') ? 'true' : 'false'
        };

        try {
            const response = await fetch(`${backendUrl}/minderStatus`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(minderDetails),
            });

            if (response.ok) {
                console.log("Updated successfully!");
                document.getElementById('bookingConfirmation').innerHTML = `Request sent!`;
            } else {
                console.error("Failed to book:", await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

   
    return (
        <form className="edit-services" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Location</label>
                <input type="text" id="location" name="location" value={location} onChange={handleLocationChange} />
            </div>
            <div>
                <label htmlFor="pets">Pets</label>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            value="dog"
                            checked={selectedPets.includes('dog')}
                            onChange={handleCheckboxChange}
                        />
                        Dog
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="cat"
                            checked={selectedPets.includes('cat')}
                            onChange={handleCheckboxChange}
                        />
                        Cat
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="rabbit"
                            checked={selectedPets.includes('rabbit')}
                            onChange={handleCheckboxChange}
                        />
                        Rabbit
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="exotic"
                            checked={selectedPets.includes('exotic')}
                            onChange={handleCheckboxChange}
                        />
                        Exotic
                    </label>
                </div>
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
        </form >
    );
};

export default EditServices;
