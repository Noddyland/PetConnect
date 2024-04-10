import React, { useState, useEffect } from 'react';
import './styles/EditPet.css'

const EditPet = ({ petId, petDetails, onClose }) => {
    const [petDetailsForm, setPetDetailsForm] = useState({
        petName: '',
        type: '',
        dob: '',
        breed: '',
        weight: '',
        diet: '',
        special: '',
        emergencyNumber: ''
    });

    useEffect(() => {
        if (petDetails) {
            console.log(petDetails);
            setPetDetailsForm({
                petName: petDetails.name || '',
                type: petDetails.type || '',
                dob: petDetails.dob || '',
                breed: petDetails.breed || '',
                weight: petDetails.weightKg || '',
                diet: petDetails.dietaryPreferences || '',
                special: petDetails.specialRequirements || '',
                emergencyNumber: petDetails.EmergencyContactInfo || ''
            });
        }
    }, [petDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Input changed:", name, value); 
        setPetDetailsForm(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("Updated petDetailsForm:", petDetailsForm); 
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/editpet/${petId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(petDetailsForm)
            });
    
            if (response.ok) {
                console.log('Pet details updated successfully');
                window.location.reload(false);
                onClose();
            } else {
                console.error('Failed to update pet details');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };
    

    return (
        <div>
            <h3>Edit Pet: {petDetailsForm.petName}</h3>
            <form onSubmit={handleSubmit} className="edit-pet-form">
                <label htmlFor="petName">Pet Name:</label>
                <input type='text' id="petName" name='petName' value={petDetailsForm.petName} onChange={handleChange} />
                <label htmlFor="type">Type:</label>
                <input type='text' id="type" name='type' value={petDetailsForm.type} onChange={handleChange} />
                <label htmlFor="dob">Date of Birth:</label>
                <input type='date' id="dob" name='dob' value={petDetailsForm.dob} onChange={handleChange} />
                <label htmlFor="breed">Breed:</label>
                <input type='text' id="breed" name='breed' value={petDetailsForm.breed} onChange={handleChange} />
                <label htmlFor="weight">Weight:</label>
                <input type='number' id="weight" name='weight' value={petDetailsForm.weight} onChange={handleChange} />
                <label htmlFor="diet">Diet:</label>
                <input type='text' id="diet" name='diet' value={petDetailsForm.diet} onChange={handleChange} />
                <label htmlFor="special">Special:</label>
                <input type='text' id="special" name='special' value={petDetailsForm.special} onChange={handleChange} />
                <label htmlFor="emergencyNumber">Emergency Number:</label>
                <input type='text' id="emergencyNumber" name='emergencyNumber' value={petDetailsForm.emergencyNumber} onChange={handleChange} />
                <button type='submit'>Save Changes</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default EditPet;
