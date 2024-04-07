import React, { useState, useEffect } from 'react';

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
            setPetDetailsForm({
                petName: petDetails.petName || '',
                type: petDetails.type || '',
                dob: petDetails.dob || '',
                breed: petDetails.breed || '',
                weight: petDetails.weight || '',
                diet: petDetails.diet || '',
                special: petDetails.special || '',
                emergencyNumber: petDetails.emergencyNumber || ''
            });
        }
    }, [petDetails]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log("Input changed:", name, value); // Log the event
        setPetDetailsForm(prevState => ({
            ...prevState,
            [name]: value
        }));
        console.log("Updated petDetailsForm:", petDetailsForm); // Log the updated state
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
                <input type='text' name='petName' value={petDetailsForm.petName} onChange={handleChange} />
                <input type='text' name='type' value={petDetailsForm.type} onChange={handleChange} />
                <input type='date' name='dob' value={petDetailsForm.dob} onChange={handleChange} />
                <input type='text' name='breed' value={petDetailsForm.breed} onChange={handleChange} />
                <input type='number' name='weight' value={petDetailsForm.weight} onChange={handleChange} />
                <input type='text' name='diet' value={petDetailsForm.diet} onChange={handleChange} />
                <input type='text' name='special' value={petDetailsForm.special} onChange={handleChange} />
                <input type='text' name='emergencyNumber' value={petDetailsForm.emergencyNumber} onChange={handleChange} />
                <button type='submit'>Save Changes</button>
                <button onClick={onClose}>Close</button>
            </form>
        </div>
    );
};

export default EditPet;
