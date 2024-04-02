import React from 'react';
import { useLocation } from 'react-router-dom';
import { Link, useNavigate } from 'react-router-dom';

const BookingLink = ({ minderObject }) => {
    const navigate = useNavigate();


    const GoBook = () => {
        console.log('Booking object:', minderObject);

        if (minderObject) {
            navigate('/BookMinder', { state: { minderObject: minderObject } });
        } else {
            console.error('No minder object available for booking.');
        }
    };

    if (localStorage.getItem('userObject') != null) {
        return (
            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>
                <span 
                    style={{ cursor: 'pointer', color: 'green', textDecoration: 'underline' }}
                    onClick={GoBook} 
                >
                    Book {minderObject.firstName}
                </span>
            </td>
        );
    }
    return (
        <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px', color: 'green' }}>
            Sign up to book!
        </td>
    );
};


const SearchResults = () => {
    const location = useLocation();
    const { searchResults } = location.state;
    console.log(searchResults);

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', marginTop: '20px' }}>
            <h1 style={{ color: '#A70909' }}>Search Results</h1>
            <table style={{ borderCollapse: 'collapse', width: '80%', marginTop: '20px', backgroundColor: 'white' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Name</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Email</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Phone Number</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Book</th>
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((result, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{`${result.firstName} ${result.lastName}`}</td>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.email}</td>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.phoneNumber}</td>
                            <BookingLink minderObject = {result} ></BookingLink>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchResults;
