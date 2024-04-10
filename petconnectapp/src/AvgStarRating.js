import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/AvgStarRating.css';

const fetchAverageRating = async (userId) => {
    try {
        const response = await fetch(`http://localhost:5000/GetAvgStarRating/${userId}`);
        if (response.ok) {
            const data = await response.json();
            return data.avgRating; 
        } else {
            throw new Error('cant get average star rating');
        }
    } catch (error) {
        console.error('Error:', error);
        return 0; 
    }
};

const AvgStarRating = ({ userId }) => {
    const [rating, setRating] = useState(0);

    useEffect(() => {
        fetchAverageRating(userId).then(avgRating => {
            setRating(Math.round(avgRating)); 
        });
    }, [userId]);

    return (
        <div className="rating-box">
            {[1, 2, 3, 4, 5].map(star => (
                <Star key={star} filled={star <= rating} />
            ))}
        </div>
    );
};

const Star = ({ filled }) => {
    const style = {
        color: filled ? '#ffc107' : '#e4e5e9', 
        fontSize: '40px' 
    };
    return <span style={style}>&#9733;</span>; 
};

export default AvgStarRating;
