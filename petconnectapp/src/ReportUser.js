import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './styles/ReviewMinder.css'; 

const ReportUser = () => {
  const backendUrl = 'http://localhost:5000';
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('userId');
  const firstName = queryParams.get('firstName');

  const [reportText, setReportText] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userObject = JSON.parse(localStorage.getItem('userObject'));
    const reporterId = userObject.user.id;

    const reportData = {
      reportedUserId: userId, // User being reported
      reporterId,
      reportText,
    };

    try {
      const response = await fetch(`${backendUrl}/submitReport`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (response.ok) {
        setSuccessMessage('Report submitted successfully!');
        setReportText('');
      } else {
        console.error("Failed to submit report", await response.json());
        setSuccessMessage('Failed to submit report');
      }
    } catch (error) {
      console.error('Error:', error);
      setSuccessMessage('Error submitting report');
    }
  };

  return (
    <div className="review-minder">
      <h1>Report {firstName}</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="report-text">Report Details</label>
        <textarea
          id="report-text"
          value={reportText}
          onChange={(e) => setReportText(e.target.value)}
          placeholder="Describe the issue."
          required
        ></textarea>

        <button type="submit">Submit Report</button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>
    </div>
  );
};

export default ReportUser;
