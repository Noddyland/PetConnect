import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/ApproveMinders.css';

const ApproveMinders = () => {
    const [pendingMinders, setPendingMinders] = useState([]);

    useEffect(() => {
        fetchPendingMinders();
    }, []);

    const fetchPendingMinders = async () => {
        try {
            const response = await fetch(`http://localhost:5000/GetPendingMinders`, { 
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                setPendingMinders(data.pendingMinders); 
            } else {
                console.error("Failed to fetch minders:", await response.text());
            }
            
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleApprove = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/approveMinder/${id}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Fetch the updated list of minders after the approval
                fetchPendingMinders();
            } else {
                console.error("Failed to approve minder:", await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDeny = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/approveMinder/${id}`, { 
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Fetch the updated list of minders after the approval
                fetchPendingMinders();
            } else {
                console.error("Failed to approve minder:", await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div>
    {pendingMinders.length > 0 ? (
        <div>
            <h3 style={{ color: '#A70909' }}>
                <u>Approve/Deny Minders</u>
            </h3>
        <table className="minders-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Email</th>
                    <th>Name</th>
                    <th>Approve</th>
                </tr>
            </thead>
            <tbody>
                {pendingMinders.map(minder => (
                    <tr key={minder.id}>
                        <td>{minder.id}</td>
                        <td>{minder.email}</td>
                        <td>{minder.firstName} {minder.lastName}</td>
                        <td>
                            <button onClick={() => handleApprove(minder.id)}>Approve</button> <button onClick={() => handleDeny(minder.id)}>Deny</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    ) : (
        <div>No minders found.</div>
    )}
</div>
    );
};

export default ApproveMinders;
