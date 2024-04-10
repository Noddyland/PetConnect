import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Pets.css';
import ViewPets from './ViewPets';

const AddPets = () => {
    const [petDetails, setPetDetails] = useState({
        petName: '',
        type: 'dog',
        dob: '',
        breed: '',
        weight: '',
        diet: '',
        special: '',
        emergencyNumber: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPetDetails(prevState => ({
            ...prevState,
            [name]: value
        }));
        
    };

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
                            ...petDetails 
                        }),
                    });
                    if (response.ok) {
                        console.log("Pet added successfully");
                        setPetDetails({
                            petName: '',
                            type: '',
                            dob: '',
                            breed: '',
                            weight: '',
                            diet: '',
                            special: '',
                            emergencyNumber: ''
                        });
                        window.location.reload(false);
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
                <input type='text' name='petName' value={petDetails.petName} onChange={handleChange} />
                <select name='type' value={petDetails.type} onChange={handleChange}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="exotic">Exotic</option>
                </select>
                <p>Date of birth</p>
                <input type='date' name='dob' value={petDetails.dob} onChange={handleChange} />
                <p>Breed</p>
                <input type='text' name='breed' value={petDetails.breed} onChange={handleChange} />
                <p>Weight (kg)</p>
                <input type='number' name='weight' value={petDetails.weight} onChange={handleChange} />
                <p>Diet</p>
                <input type='text' name='diet' value={petDetails.diet} onChange={handleChange} />
                <label>Special requirements?</label>
                <p>Special Requirements?</p>
                <input type='text' name='special' value={petDetails.special} onChange={handleChange} />
                <p>Emergency Contact Number:</p>
                <input type='text' name='emergencyNumber' value={petDetails.emergencyNumber} onChange={handleChange} />
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
            <button onClick={goBack} className="back-button">Go Back</button>

        );
    }
    return (
        <div className="pets-table-wrapper">
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
            

            </div>
 
        );
};


export default Pets;
