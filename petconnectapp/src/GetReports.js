import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './styles/GetReports.css';

const GetReports = () => {
    const [reports, setReports] = useState([]);

    useEffect(() => {
        const fetchReports = async () => {
            const userObjectString = localStorage.getItem('userObject');
            if (userObjectString) {
                const userObject = JSON.parse(userObjectString);
                const userid = userObject.user.id;

                try {
                    const response = await fetch(`http://localhost:5000/GetReports`, { 
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        setReports(data.reports); 
                    } else {
                        const errorData = await response.json();
                        console.error("Failed to fetch Reports:", errorData.message);
                    }
                    
                } catch (error) {
                    console.error('Error:', error);
                }
            }
        };

        fetchReports();
    }, []);

    if (reports.length > 0) {
        return (
                <div className="reports-container">
        <h3 className="reports-header">
            <u>Reports</u>
        </h3>
        <table className="minders-table">
            <thead>
                <tr>
                    <th>Author</th>
                    <th>Subject</th>
                    <th>Details</th>
                </tr>
            </thead>
            <tbody>
                {reports.map((report) => (
                    <tr key={report.reportId}>
                        <td>
                            <Link to={`/ViewProfile?userId=${report.authorId}`} className="report-link">
                                {report.authorFirstName} {report.authorLastName}
                            </Link>
                        </td>
                        <td>
                            <Link to={`/ViewProfile?userId=${report.subjectId}`} className="report-link">
                                {report.subjectFirstName} {report.subjectLastName}
                            </Link>
                        </td>
                        <td>{report.reportDetails}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
    );
    } else {
        return <div>No reports found.</div>;
    }
}



export default GetReports;
