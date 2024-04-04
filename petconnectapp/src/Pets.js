import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import './styles/Pets.css';
import ViewPets from './ViewPets';

const AddPets = () => {
    const [petName, setPetName] = useState('');
    const [type, setType] = useState('');
    const [dob, setDob] = useState('');
    const [breed, setBreed] = useState('');
    const [weight, setWeight] = useState('');
    const [diet, setDiet] = useState('');
    const [special, setSpecial] = useState('');
    const [emergencyNumber, setEmergencyNumber] = useState('');

    const handlePetName = (event) => setPetName(event.target.value);
    const handleType = (event) => setType(event.target.value);
    const handleDob = (event) => setDob(event.target.value);
    const handleBreed = (event) => setBreed(event.target.value);
    const handleWeight = (event) => setWeight(event.target.value);
    const handleDiet = (event) => setDiet(event.target.value);
    const handleSpecial = (event) => setSpecial(event.target.value);
    const handleEmergencyNumber = (event) => setEmergencyNumber(event.target.value);

    
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        const userObjectString = localStorage.getItem('userObject');
        if (userObjectString) {
            const userObject = JSON.parse(userObjectString);
            if (userObject.user.role === 'owner') {
                try {
                    const response = await fetch(`http://localhost:5000/addpet`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            userid: userObject.user.id, 
                            petName,
                            type, 
                            dob, 
                            breed, 
                            weight, 
                            diet, 
                            special,
                            emergencyNumber
                        }),
                    });
                    if (response.ok) {
                        console.log("Pet added successfully");
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to add pet:", errorData.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            } else {
                console.error("Unauthorized: Only owners can add pets.");
            }
        } else {
            console.error("User is not logged in.");
        }
    };

    return (
        <div>
            
            <h3>Add Pets</h3>
            <form onSubmit={handleSubmit} className="pets-form">
                <p>Pet Name:</p>
                <input type='text' value={petName} onChange={handlePetName} />
                <select value={type} onChange={handleType}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="exotic">Exotic</option>
                </select>
                <p>Date of birth</p>
                <input type='date' value={dob} onChange={handleDob} />
                <p>Breed</p>
                <input type='text' value={breed} onChange={handleBreed} />
                <p>Weight (kg)</p>
                <input type='number' value={weight} onChange={handleWeight} />
                <p>Diet</p>
                <input type='text' value={diet} onChange={handleDiet} />
                <label>Special requirements?</label>
                <p>Special Requirements?</p>
                <input type='text' value={special} onChange={handleSpecial} />
                <p>Emergency Contact Number:</p>
                <input type='text' value={emergencyNumber} onChange={handleEmergencyNumber} />
                <button type='submit' className='add-pet-button'>Add Pet</button>
            </form>
        </div>
    );
}


const Pets = () => {
    function BackButton() {
        const navigate = useNavigate();
    
        // Function to go back
        const goBack = () => navigate(-1);
    
        return (
            <button onClick={goBack}>Go Back</button>
        );
    }
    return (
        <div>
            <br></br>
            <table style={{ borderCollapse: 'collapse', width: '80%', marginTop: '20px', backgroundColor: 'white', margin: 'auto' }}>
                <thead>
                    <tr>
                        <th className="pets-header">Add Pets</th>
                        <th className="pets-header">My Pets</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="pets-table-cell"> 
                            <AddPets />
                        </td>
                        <td className="pets-table-cell"> 
                            <ViewPets />
                        </td>
                    </tr>
            
                </tbody>
                
            </table>
            <BackButton />
        </div>);
};


export default Pets;
