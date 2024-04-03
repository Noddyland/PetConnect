import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ReviewMinder.css';

const ReviewMinder = () => {
  // Define the backend URL here
  const backendUrl = 'http://localhost:5000'; // Replace with your actual backend URL if different

  const [minder, setMinder] = useState('');
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const authorId = localStorage.getItem('userId');
    const reviewData = {
      minderId: minder, 
      authorId,
      reviewText: review,
      rating,
    };
    
    try {
      const response = await fetch(`${backendUrl}/submitReview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reviewData),
      });
      if (response.ok) {
        navigate('/reviewSuccess');
      } else {
        console.error("Failed to submit review:", await response.json());
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="review-minder">
      <h1>Drop a review for your Pet Minder!</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="minder-select">Pet Minder</label>
        <select
          id="minder-select"
          value={minder}
          onChange={(e) => setMinder(e.target.value)}
          required
        >
          <option value="">Select a minder</option>
          {/* The options here should be populated dynamically based on data */}
          <option value="minder1">Minder 1</option>
          <option value="minder2">Minder 2</option>
        </select>

        <label htmlFor="review-text">Review</label>
        <textarea
          id="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience with the minder"
          required
        ></textarea>

        <div className="star-rating">
          {[...Array(5)].map((star, index) => {
            index += 1;
            return (
              <button
                type="button"
                key={index}
                className={index <= (hover || rating) ? "star on" : "star off"}
                onClick={() => setRating(index)}
                onMouseEnter={() => setHover(index)}
                onMouseLeave={() => setHover(rating)}
              >
                &#9733;
              </button>
            );
          })}
        </div>

        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default ReviewMinder;
