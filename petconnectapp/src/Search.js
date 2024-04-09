import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Search = () => {
    const [selectedService, setSelectedService] = useState('pet-sitting');
    const [selectedPet, setSelectedPet] = useState('dog');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const navigate = useNavigate();

    const handleServiceChange = (event) => setSelectedService(event.target.value);
    const handlePetChange = (event) => setSelectedPet(event.target.value);
    const handleDateChange = (event) => setSelectedDate(event.target.value);
    const handleCityChange = (event) => setSelectedCity(event.target.value);

    const handleSearch = async () => {
        // Check all inputs have been provided 
        if (!selectedService || !selectedPet || !selectedDate || !selectedCity) {
            setShowErrorMessage(true);
            return;
        }
        else {
            setShowErrorMessage(false);
        }

        const searchParams = {
            pet: selectedPet,
            city: selectedCity
        };

        try {
            const response = await fetch(`http://localhost:5000/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(searchParams),

            });

            const data = await response.json();
            const updatedData = data.map(item => ({
                ...item,
                dateTime: selectedDate,
                service: selectedService
            }));


            navigate('/SearchResults', {
                state: {
                    searchResults: updatedData,
                }
            }
            );

        } catch (error) {
            console.error('Error:', error);
        }
    };

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
                            <select name="services" id="services" onChange={handleServiceChange} defaultValue="pet-sitting">
                                <option
                                    value="pet-sitting">Pet Sitting
                                </option>
                                <option
                                    value="dog-walking">Dog Walking
                                </option>
                            </select>
                        </div>
                        <div className="dropdown-content">
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
                        <div className="dropdown-content">
                            <label htmlFor="city">City</label>
                            <input type="text" id="city" onChange={handleCityChange} />
                        </div>
                    </div>
                </div>
                <button id="search-button" onClick={handleSearch}>Search</button>
                {showErrorMessage && (
                    <div className="error-message">Please fill out all required fields.</div>
                )}
            </div>
            <p>(only London works for now)</p>
        </div>
    );
}

export default Search;