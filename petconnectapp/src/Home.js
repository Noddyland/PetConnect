import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import './Home.css'
function PrintHomeScreen() {
    if (localStorage.getItem('userObject') != null) {
        const userObjectString = localStorage.getItem('userObject');
        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role == "minder"){
            return <p>pet minder homescreen coming soon...</p>
        }
    }
    return (<Search></Search>)
}

const Search = () => {
    const [selectedService, setSelectedService] = useState('');
    const [selectedPet, setSelectedPet] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const navigate = useNavigate();


    const handleServiceChange = (event) => {
        const service = event.target.value;
        setSelectedService(service);
    };

    const handlePetChange = (event) => {
        setSelectedPet(event.target.value);
    };

    const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
    };
    const handleCityChange = (event) => {
        setSelectedCity(event.target.value);
    };

    const handleSearch = () => {
        // Check all inputs have been provided 
        if (!selectedService || !selectedPet || !selectedDate || !selectedCity) {
            alert('Please select all options before searching.');
            return;
        }
        // Navigate to SearchResults and pass the values as parameters
        navigate(`/search-results?service=${selectedService}&pet=${selectedPet}&date=${selectedDate}&city=${selectedCity}`);
    };

    //set pet as dog if dog walking is chosen, other pet selections are disabled
    useEffect(() => {
        console.log("Selected Service:", selectedService);
        if (selectedService === 'dog-walking') {
            setSelectedPet('dog');
        }
    }, [selectedService]);

    return (
        <div>
            <h1>Find your perfect pet sitter today</h1>
            <div id="search-container">
                <div id="input-content">
                    <div className="input-container">
                        <div className="dropdown-content">
                            <label htmlFor="services">Service</label>
                            <select name="services" id="services" onChange={handleServiceChange}>
                                <option
                                    value="pet-sitting">Pet Sitting
                                </option>
                                <option
                                    value="dog-walking">Dog Walking
                                </option>
                            </select>
                        </div>
                        <div class="dropdown-content">
                            <label htmlFor="date">Date</label>
                            <input type="date" id="date" onChange={handleDateChange} />
                        </div>
                    </div>
                    <div className="input-container">
                        <div className="dropdown-content">
                            <label htmlFor="pet">Pet</label>
                            <select name="pet" id="pet" onChange={handlePetChange} disabled={selectedService === 'dog-walking'}>
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
                        </div>
                        <div class="dropdown-content">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" onChange={handleCityChange} />
                        </div>
                    </div>
                </div>
                <button id ="search-button" onClick={handleSearch}>Search</button>
            </div>
            
        </div>
    );
}

const Home = () => {
    return (
        <PrintHomeScreen></PrintHomeScreen>
    )
    
};



export default Home;