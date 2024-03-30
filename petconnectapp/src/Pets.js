import React, { useState, useEffect } from 'react';

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
            <form onSubmit={handleSubmit}>
                <label>Pet Name:</label>
                <p>Pet Name:</p>
                <input type='text' value={petName} onChange={handlePetName} />
                <label>Type:</label>
                <select value={type} onChange={handleType}>
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="rabbit">Rabbit</option>
                    <option value="exotic">Exotic</option>
                </select>
                <label>Date Of Birth:</label>
                <p>Date of birth</p>
                <input type='date' value={dob} onChange={handleDob} />
                <label>Breed:</label>
                <p>Breed</p>
                <input type='text' value={breed} onChange={handleBreed} />
                <label>Weight (kg):</label>
                <p>Weight (kg)</p>
                <input type='number' value={weight} onChange={handleWeight} />
                <label>Diet:</label>
                <p>Diet</p>
                <input type='text' value={diet} onChange={handleDiet} />
                <label>Special requirements?</label>
                <p>Special Requirements?</p>
                <input type='text' value={special} onChange={handleSpecial} />
                <label>Emergency Contact Number:</label>
                <p>Emergency Contact Number:</p>
                <input type='text' value={emergencyNumber} onChange={handleEmergencyNumber} />
                <button type='submit'>Add Pet</button>
            </form>
        </div>
    );
}

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

    return (
        <div>
            <h3>My Pets</h3>
            {pets.length > 0 ? (
                <ul>
                    {pets.map((pet) => (
                        <li key={pet.id}>
                            Name: {pet.name}, Type: {pet.type}, DOB: {pet.dob}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No pets found.</p>
            )}
        </div>
    );
};


const Pets = () => {
    return (<table style={{ borderCollapse: 'collapse', width: '80%', marginTop: '20px', backgroundColor: 'white', margin: 'auto' }}>
    <thead>
        <tr>
            <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px', textAlign: 'center' }}>
                Add Pets
            </th>
            <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px', textAlign: 'center' }}>
                My Pets
            </th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>
                <AddPets />
            </td>
            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>
                <ViewPets />
            </td>
        </tr>
    </tbody>
</table>)
};

export default Pets;
