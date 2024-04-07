import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ApproveMinders from './ApproveMinders';

const ViewUsers = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const userObjectString = localStorage.getItem('userObject');
        if (!userObjectString) {
            console.log("Not logged in!");
            navigate('/login'); 
            return;
        }

        const userObject = JSON.parse(userObjectString);
        if (userObject.user.role !== 'moderator') {
            console.log("You cannot access this page!");
            navigate('/'); 
            return;
        }

        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:5000/GetUsers');
                if (response.ok) {
                    const data = await response.json();
                    const filteredUsers = data.users.filter(u => u.id !== userObject.user.id);
                    setUsers(filteredUsers);
                } else {
                    console.error("Failed to fetch users:", await response.text());
                }
            } catch (error) {
                console.error('Network error:', error);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleUserStatusChange = async (userId, newStatus) => {
        try {
            const response = await fetch(`http://localhost:5000/UserDecision/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ decision: newStatus })
            });

            if (response.ok) {
                setUsers(users.map(user =>
                    user.id === userId ? { ...user, accountStatus: newStatus } : user
                ));
            } else {
                console.error("Failed to update user status:", await response.text());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const renderUserTable = (users, status, actionLabel, nextStatus) => (
        <table className="minders-table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Username</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Action</th>
                </tr>
            </thead>
            <tbody>
                {users.filter(user => user.accountStatus === status).map(user => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.username}</td>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.email}</td>
                        <td>
                            <button onClick={() => handleUserStatusChange(user.id, nextStatus)}>
                                {actionLabel}
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );

    return (
        <div className="tables-container">
            <div className="table-wrapper">
            <h3 style={{ color: '#A70909' }}>
                <u>Approved Users</u>
            </h3>
                {renderUserTable(users, 'approved', 'Ban', 'banned')}
            </div>
            <div className="table-wrapper">
                <ApproveMinders />
            </div>
            <div className="table-wrapper">
            <h3 style={{ color: '#A70909' }}>
                <u>Banned Users</u>
            </h3>
                {renderUserTable(users, 'banned', 'Unban', 'approved')}
            </div>
        </div>
    );
}

export default ViewUsers;
