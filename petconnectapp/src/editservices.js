// FormComponent.js
import React, { useState } from 'react';
import './styles/editservices.css'

const EditServices = () => {
    const [location, setLocation] = useState('');
    const [selectedPets, setSelectedPets] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);

    const handleCheckboxChange = (e, type) => {
        const { value, checked } = e.target;
        if (type === 'pets') {
            if (checked) {
                setSelectedPets([...selectedPets, value]);
            } else {
                setSelectedPets(selectedPets.filter(pet => pet !== value));
            }
        } else if (type === 'services') {
            if (checked) {
                setSelectedServices([...selectedServices, value]);
            } else {
                setSelectedServices(selectedServices.filter(service => service !== value));
            }
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
            cat: selectedPets.includes('cat') ? 'true' : 'false',
            rabbit: selectedPets.includes('rabbit') ? 'true' : 'false',
            exotic: selectedPets.includes('exotic') ? 'true' : 'false',
            dogWalking: selectedServices.includes('dogWalking') ? 'true' : 'false',
            petSitting: selectedServices.includes('petSitting') ? 'true' : 'false',
            grooming: selectedServices.includes('grooming') ? 'true' : 'false'
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
                document.getElementById('updateConfirmation').innerHTML = `Updated successfully!`;
            } else {
                console.error("Failed to update.", await response.json());
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
                            onChange={(e) => handleCheckboxChange(e, 'pets')}
                        />
                        Dog
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="cat"
                            checked={selectedPets.includes('cat')}
                            onChange={(e) => handleCheckboxChange(e, 'pets')}
                        />
                        Cat
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="rabbit"
                            checked={selectedPets.includes('rabbit')}
                            onChange={(e) => handleCheckboxChange(e, 'pets')}
                        />
                        Rabbit
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="exotic"
                            checked={selectedPets.includes('exotic')}
                            onChange={(e) => handleCheckboxChange(e, 'pets')}
                        />
                        Exotic
                    </label>
                </div>
                <div>
                    <label htmlFor="name">Services</label>
                    <label>
                        <input
                            type="checkbox"
                            value="dogWalking"
                            checked={selectedServices.includes('dogWalking')}
                            onChange={(e) => handleCheckboxChange(e, 'services')}
                        />
                        Dog Walking
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="petSitting"
                            checked={selectedServices.includes('petSitting')}
                            onChange={(e) => handleCheckboxChange(e, 'services')}
                        />
                        Pet Sitting
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            value="grooming"
                            checked={selectedServices.includes('grooming')}
                            onChange={(e) => handleCheckboxChange(e, 'services')}
                        />
                        Grooming
                    </label>
                </div>
            </div>
            <div>
                <input type="submit" value="Submit" />
            </div>
            <p id="updateConfirmation"></p>
        </form >

    );
};

export default EditServices;
