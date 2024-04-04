import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const GetReports = () => {
    const [reports, setReports] = useState([]); // Changed from reviews to reports

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
            <div>
                <h3 style={{ color: '#A70909' }}>
                    Reports
                </h3>
                <table style={{ width: '100%', backgroundColor: 'white', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ color: '#A70909', borderBottom: '2px solid #A70909' }}>Author</th>
                            <th style={{ color: '#A70909', borderBottom: '2px solid #A70909' }}>Subject</th>
                            <th style={{ color: '#A70909', borderBottom: '2px solid #A70909' }}>Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reports.map((report) => (
                            <tr key={report.reportId}>
                                <td>
                                    <Link to={`/ViewProfile?userId=${report.authorId}`} style={{ color: '#A70909' }}>
                                        {report.authorFirstName} {report.authorLastName}
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/ViewProfile?userId=${report.subjectId}`} style={{ color: '#A70909' }}>
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
