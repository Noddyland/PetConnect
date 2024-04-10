import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/ReviewMinder.css';

const ReviewMinder = () => {
  const backendUrl = 'http://localhost:5000';
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const firstName = queryParams.get('firstName');

  const [review, setReview] = useState('');
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [successMessage, setSuccessMessage] = useState('');

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObject = JSON.parse(localStorage.getItem('userObject'));
    const authorId = userObject.user.id;
    
    const reviewData = {
      minderId: userId, // User being reviewed
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
        setSuccessMessage('Review submitted successfully!');
        setReview('');
        setRating(0);
      } else {
        console.error("Failed to submit review:", await response.json());
        setSuccessMessage('Failed to submit review. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('Error submitting review. Please check your network.');
    }
  };

  return (
    <div className="review-minder">
      <h1>Drop a review for {firstName}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="review-text">Review</label>
        <textarea
          id="review-text"
          value={review}
          onChange={(e) => setReview(e.target.value)}
          placeholder="Share your experience!"
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
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default ReviewMinder;
