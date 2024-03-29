import React from 'react';
import { useLocation } from 'react-router-dom';

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
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>First Name</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Last Name</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Email</th>
                        <th style={{ border: '1px solid #A70909', color: 'white', backgroundColor: '#A70909', padding: '10px' }}>Phone Number</th>
                        {/* Adjust styles as necessary for additional headers */}
                    </tr>
                </thead>
                <tbody>
                    {searchResults.map((result, index) => (
                        <tr key={index}>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.firstName}</td>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.lastName}</td>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.email}</td>
                            <td style={{ border: '1px solid #A70909', textAlign: 'center', padding: '8px' }}>{result.phoneNumber}</td>
                            {/* Render more data as needed */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default SearchResults;
