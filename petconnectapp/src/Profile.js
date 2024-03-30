import React, { useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useState } from 'react';

function Profile() {

    
const backendUrl = 'http://localhost:5000'; // Define your backend URL
const [type, setType] = useState('')
const [dob, setDob] = useState('')
const [breed, setBreed] = useState('')
const [weight, setWeight] = useState('')
const [diet, setDiet] = useState('')
const [special, setSpecial] = useState('')
const [emergency, setEmergency] = useState('')

const handletype =(event)=> setType(event.target.vale)
const handledob = (event) => setDob(event.target.value)
const handlebreed = (event) => setBreed(event.target.value)
const handleweight = (event) => setWeight(event.target.value)
const handlediet = (event) => setDiet(event.target.value)
const handlespecial = (event) => setSpecial(event.target.value)

function DisplayDetails(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        return <div>
            {userObject.user.firstName} {userObject.user.lastName}<br/>
            {userObject.user.biography}
        </div>;
    }
    return ""
}
const handlepets = async () => {
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role === 'owner'){
            let id = userObject.user.id
            try {
                const response = await fetch(`http://localhost:5000/pets`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({id}),
                    
                });
                let data = await response.json()
                return(
                    <div>{data}</div>
                )
            } catch (error) {
                console.error('Error:', error);
            }  
    }
}
}
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        const userid = userObject.user.id
        const response = await fetch(`http://localhost:5000/addpet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ type, dob, breed, weight, diet, special, userid}),
      });
      if (response.ok) {
        console.log("pet added");
      } else {
        console.log(await response.json()); // Log the response body for more details
        console.error("Failed to add pet");
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
function Display_pets(){
    if(localStorage.getItem('userObject') != null){
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role === 'owner'){
            handlepets()
            return(
                <div>
                    <h3>Add Pets</h3>
                    <form onSubmit={handleSubmit}>
                        <label>Type:</label>
                            <select  value={type} onChange={handletype}>
                                <option
                                    value="dog">Dog
                                </option>
                                <option
                                    value="cat">Cat
                                </option>
                                <option
                                    value="rabbit">Rabbit
                                </option>
                                <option
                                    value="exotic">Exotic
                                </option>
                            </select>
                        <label>Date Of Birth</label>
                        <input 
                            type='date'
                            value={dob}
                            onChange={handledob}
                        />
                        <label>Breed</label>
                        <input 
                            type='text'
                            value={breed}
                            onChange={handlebreed}
                        />
                        <label>Weight (kg)</label>
                        <input 
                            type='number'
                            value={weight}
                            onChange={handleweight}
                        />
                        <label>diet</label>
                        <input
                            type='text'
                            value={diet}
                            onChange={handlediet}
                        />
                        <label>Special requirements?</label>
                        <input 
                            type='text'
                            value={special}
                            onChange={handlespecial}
                        />
                        <button type='submit'>Add Pet</button>
                    </form>
                </div>
            )
        }
    }
}
    return (
        <><h1>Profile</h1>
        <div><DisplayDetails></DisplayDetails></div>
        <div><Display_pets></Display_pets></div>
        </>
    );
};

export default Profile;