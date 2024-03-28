import React from 'react';
import { useSearchParams } from 'react-router-dom';

const SearchResults = () => {
    const [searchParams] = useSearchParams();

    const service = searchParams.get('service');
    const pet = searchParams.get('pet');
    const date = searchParams.get('date');
    const city = searchParams.get('city');

    return (
        <div>
            <h1>Search Results</h1>
            <h2>temporary search results page to check values are correct</h2>
            <p>Service: {service}</p>
            <p>Pet: {pet}</p>
            <p>Date: {date}</p>
            <p>City: {city}</p>
        </div>
    );
};

export default SearchResults;
